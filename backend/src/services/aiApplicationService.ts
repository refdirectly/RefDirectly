import { chromium, Browser, Page } from 'playwright';
import nodemailer from 'nodemailer';

interface ApplicationResult {
  jobId: string;
  jobTitle: string;
  company: string;
  status: 'success' | 'failed' | 'partial';
  submittedAt?: Date;
  error?: string;
  screenshotPath?: string;
}

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  resumePath?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  yearsOfExperience?: number;
  currentCompany?: string;
  currentTitle?: string;
  skills?: string[];
  coverLetter?: string;
}

export class AIApplicationService {
  private browser: Browser | null = null;
  private emailTransporter: any;

  constructor() {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      this.emailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      });
    }
  }

  async initialize() {
    if (this.browser) return;
    
    this.browser = await chromium.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }

  async applyToJob(jobUrl: string, profile: UserProfile): Promise<ApplicationResult> {
    if (!this.browser) await this.initialize();
    
    const page = await this.browser!.newPage();
    
    try {
      console.log(`🔍 Navigating to: ${jobUrl}`);
      await page.goto(jobUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(2000);

      // Detect platform and apply
      if (jobUrl.includes('linkedin.com')) {
        return await this.applyLinkedIn(page, jobUrl, profile);
      } else if (jobUrl.includes('indeed.com')) {
        return await this.applyIndeed(page, jobUrl, profile);
      } else if (jobUrl.includes('greenhouse.io')) {
        return await this.applyGreenhouse(page, jobUrl, profile);
      } else {
        return await this.applyGeneric(page, jobUrl, profile);
      }
    } catch (error: any) {
      console.error('Application error:', error.message);
      return {
        jobId: '',
        jobTitle: 'Unknown',
        company: 'Unknown',
        status: 'failed',
        error: error.message
      };
    } finally {
      await page.close();
    }
  }

  private async applyLinkedIn(page: Page, jobUrl: string, profile: UserProfile): Promise<ApplicationResult> {
    try {
      // Wait for Easy Apply button
      const easyApplyBtn = page.locator('button.jobs-apply-button, button:has-text("Easy Apply")').first();
      
      if (await easyApplyBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
        await easyApplyBtn.click();
        await page.waitForTimeout(2000);

        // Fill multi-step form
        let step = 0;
        while (step < 10) {
          await this.fillLinkedInFormStep(page, profile);
          
          // Check for submit button
          const submitBtn = page.locator('button:has-text("Submit application"), button[aria-label*="Submit"]').first();
          if (await submitBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
            await submitBtn.click();
            await page.waitForTimeout(3000);
            
            // Verify submission
            const successMsg = await page.locator('text=/application.*submitted|thank you/i').isVisible({ timeout: 5000 }).catch(() => false);
            
            return {
              jobId: jobUrl,
              jobTitle: await this.extractJobTitle(page),
              company: await this.extractCompany(page),
              status: successMsg ? 'success' : 'partial',
              submittedAt: new Date()
            };
          }

          // Click Next/Continue
          const nextBtn = page.locator('button:has-text("Next"), button:has-text("Continue"), button:has-text("Review")').first();
          if (await nextBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
            await nextBtn.click();
            await page.waitForTimeout(1500);
            step++;
          } else {
            break;
          }
        }
      }

      return {
        jobId: jobUrl,
        jobTitle: await this.extractJobTitle(page),
        company: await this.extractCompany(page),
        status: 'failed',
        error: 'Could not complete application'
      };
    } catch (error: any) {
      return {
        jobId: jobUrl,
        jobTitle: 'Unknown',
        company: 'Unknown',
        status: 'failed',
        error: error.message
      };
    }
  }

  private async fillLinkedInFormStep(page: Page, profile: UserProfile) {
    // Fill text inputs
    const inputs = await page.locator('input[type="text"]:visible, input[type="email"]:visible, input[type="tel"]:visible, textarea:visible').all();
    
    for (const input of inputs) {
      const label = (await input.getAttribute('aria-label') || '').toLowerCase();
      const name = (await input.getAttribute('name') || '').toLowerCase();
      const field = `${label} ${name}`;

      try {
        if (field.includes('phone') || field.includes('mobile')) {
          await input.fill(profile.phone);
        } else if (field.includes('email')) {
          await input.fill(profile.email);
        } else if (field.includes('first') && field.includes('name')) {
          await input.fill(profile.name.split(' ')[0]);
        } else if (field.includes('last') && field.includes('name')) {
          await input.fill(profile.name.split(' ').slice(1).join(' ') || profile.name);
        } else if (field.includes('linkedin')) {
          if (profile.linkedinUrl) await input.fill(profile.linkedinUrl);
        } else if (field.includes('github')) {
          if (profile.githubUrl) await input.fill(profile.githubUrl);
        } else if (field.includes('website') || field.includes('portfolio')) {
          if (profile.portfolioUrl) await input.fill(profile.portfolioUrl);
        }
      } catch (e) {}
    }

    // Handle file upload
    if (profile.resumePath) {
      const fileInput = page.locator('input[type="file"]').first();
      if (await fileInput.isVisible({ timeout: 1000 }).catch(() => false)) {
        await fileInput.setInputFiles(profile.resumePath);
        await page.waitForTimeout(2000);
      }
    }

    // Handle dropdowns
    const selects = await page.locator('select:visible').all();
    for (const select of selects) {
      try {
        const options = await select.locator('option').all();
        if (options.length > 1) await select.selectOption({ index: 1 });
      } catch (e) {}
    }
  }

  private async applyIndeed(page: Page, jobUrl: string, profile: UserProfile): Promise<ApplicationResult> {
    try {
      const applyBtn = page.locator('button:has-text("Apply now"), a:has-text("Apply now")').first();
      
      if (await applyBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
        await applyBtn.click();
        await page.waitForTimeout(2000);

        // Fill Indeed form
        await this.fillGenericForm(page, profile);

        // Submit
        const submitBtn = page.locator('button[type="submit"], button:has-text("Submit"), button:has-text("Continue")').first();
        if (await submitBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
          await submitBtn.click();
          await page.waitForTimeout(3000);

          return {
            jobId: jobUrl,
            jobTitle: await this.extractJobTitle(page),
            company: await this.extractCompany(page),
            status: 'success',
            submittedAt: new Date()
          };
        }
      }

      return {
        jobId: jobUrl,
        jobTitle: await this.extractJobTitle(page),
        company: await this.extractCompany(page),
        status: 'failed',
        error: 'Could not find apply button'
      };
    } catch (error: any) {
      return {
        jobId: jobUrl,
        jobTitle: 'Unknown',
        company: 'Unknown',
        status: 'failed',
        error: error.message
      };
    }
  }

  private async applyGreenhouse(page: Page, jobUrl: string, profile: UserProfile): Promise<ApplicationResult> {
    try {
      await page.fill('input[name="job_application[first_name]"]', profile.name.split(' ')[0]);
      await page.fill('input[name="job_application[last_name]"]', profile.name.split(' ').slice(1).join(' '));
      await page.fill('input[name="job_application[email]"]', profile.email);
      await page.fill('input[name="job_application[phone]"]', profile.phone);

      if (profile.resumePath) {
        await page.setInputFiles('input[type="file"]', profile.resumePath);
        await page.waitForTimeout(2000);
      }

      const submitBtn = page.locator('input[type="submit"], button[type="submit"]').first();
      await submitBtn.click();
      await page.waitForTimeout(3000);

      return {
        jobId: jobUrl,
        jobTitle: await this.extractJobTitle(page),
        company: await this.extractCompany(page),
        status: 'success',
        submittedAt: new Date()
      };
    } catch (error: any) {
      return {
        jobId: jobUrl,
        jobTitle: 'Unknown',
        company: 'Unknown',
        status: 'failed',
        error: error.message
      };
    }
  }

  private async applyGeneric(page: Page, jobUrl: string, profile: UserProfile): Promise<ApplicationResult> {
    try {
      await this.fillGenericForm(page, profile);

      const submitBtn = page.locator('button[type="submit"], input[type="submit"], button:has-text("Submit"), button:has-text("Apply")').first();
      if (await submitBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await submitBtn.click();
        await page.waitForTimeout(3000);

        return {
          jobId: jobUrl,
          jobTitle: await this.extractJobTitle(page),
          company: await this.extractCompany(page),
          status: 'success',
          submittedAt: new Date()
        };
      }

      return {
        jobId: jobUrl,
        jobTitle: await this.extractJobTitle(page),
        company: await this.extractCompany(page),
        status: 'partial',
        error: 'Form filled but could not submit'
      };
    } catch (error: any) {
      return {
        jobId: jobUrl,
        jobTitle: 'Unknown',
        company: 'Unknown',
        status: 'failed',
        error: error.message
      };
    }
  }

  private async fillGenericForm(page: Page, profile: UserProfile) {
    const inputs = await page.locator('input:visible, textarea:visible').all();
    
    for (const input of inputs) {
      try {
        const type = await input.getAttribute('type');
        const name = (await input.getAttribute('name') || '').toLowerCase();
        const id = (await input.getAttribute('id') || '').toLowerCase();
        const placeholder = (await input.getAttribute('placeholder') || '').toLowerCase();
        const field = `${name} ${id} ${placeholder}`;

        if (type === 'file' && profile.resumePath) {
          await input.setInputFiles(profile.resumePath);
        } else if (field.includes('phone') || field.includes('mobile') || type === 'tel') {
          await input.fill(profile.phone);
        } else if (type === 'email' || field.includes('email')) {
          await input.fill(profile.email);
        } else if (field.includes('first') && field.includes('name')) {
          await input.fill(profile.name.split(' ')[0]);
        } else if (field.includes('last') && field.includes('name')) {
          await input.fill(profile.name.split(' ').slice(1).join(' ') || profile.name);
        } else if (field.includes('name') && !field.includes('company')) {
          await input.fill(profile.name);
        }
      } catch (e) {}
    }
  }

  private async extractJobTitle(page: Page): Promise<string> {
    try {
      const title = await page.locator('h1, .job-title, [class*="job-title"]').first().textContent({ timeout: 2000 });
      return title?.trim() || 'Unknown Position';
    } catch {
      return 'Unknown Position';
    }
  }

  private async extractCompany(page: Page): Promise<string> {
    try {
      const company = await page.locator('.company-name, [class*="company"], [class*="employer"]').first().textContent({ timeout: 2000 });
      return company?.trim() || 'Unknown Company';
    } catch {
      return 'Unknown Company';
    }
  }

  async sendConfirmationEmail(userEmail: string, results: ApplicationResult[]) {
    if (!this.emailTransporter) {
      console.log('Email not configured');
      return;
    }

    const successful = results.filter(r => r.status === 'success');
    const partial = results.filter(r => r.status === 'partial');
    const failed = results.filter(r => r.status === 'failed');

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366f1;">🤖 AI Job Application Report</h2>
        
        <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #16a34a; margin: 0;">✅ Successfully Applied: ${successful.length}</h3>
          ${successful.map(r => `
            <div style="margin: 10px 0; padding: 10px; background: white; border-radius: 4px;">
              <strong>${r.jobTitle}</strong> at ${r.company}<br>
              <small style="color: #666;">Submitted: ${r.submittedAt?.toLocaleString()}</small>
            </div>
          `).join('')}
        </div>

        ${partial.length > 0 ? `
          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #d97706; margin: 0;">⚠️ Partially Completed: ${partial.length}</h3>
            ${partial.map(r => `
              <div style="margin: 10px 0; padding: 10px; background: white; border-radius: 4px;">
                <strong>${r.jobTitle}</strong> at ${r.company}<br>
                <small style="color: #666;">${r.error}</small>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${failed.length > 0 ? `
          <div style="background: #fee2e2; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #dc2626; margin: 0;">❌ Failed: ${failed.length}</h3>
            ${failed.map(r => `
              <div style="margin: 10px 0; padding: 10px; background: white; border-radius: 4px;">
                <strong>${r.jobTitle}</strong> at ${r.company}<br>
                <small style="color: #666;">${r.error}</small>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <p style="margin-top: 30px; color: #666;">
          <strong>Next Steps:</strong><br>
          • Check your email for confirmation from companies<br>
          • Review partially completed applications in your browser<br>
          • Follow up on applications after 3-5 days
        </p>

        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          This is an automated message from ReferAI. Do not reply to this email.
        </p>
      </div>
    `;

    try {
      await this.emailTransporter.sendMail({
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: `🤖 AI Applied to ${successful.length} Jobs Successfully!`,
        html
      });
      console.log('✅ Confirmation email sent');
    } catch (error: any) {
      console.error('Email error:', error.message);
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

export const aiApplicationService = new AIApplicationService();
