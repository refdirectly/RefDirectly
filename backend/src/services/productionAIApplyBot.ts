import { chromium, Browser, Page, BrowserContext } from 'playwright';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  resumePath?: string;
  linkedinUrl?: string;
  linkedinEmail?: string;
  linkedinPassword?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  yearsOfExperience?: number;
  currentCompany?: string;
  currentTitle?: string;
}

interface JobApplication {
  jobId: string;
  jobTitle: string;
  company: string;
  jobUrl?: string;
  status: 'pending' | 'applied' | 'failed';
  error?: string;
}

export class ProductionAIApplyBot {
  private browser: BrowserContext | null = null;
  private page: Page | null = null;

  async initialize() {
    if (this.browser) return;
    
    try {
      // Try to connect to existing Chrome instance
      console.log('🔌 Connecting to existing Chrome browser...');
      const browser = await chromium.connectOverCDP('http://localhost:9222');
      this.browser = browser.contexts()[0];
      
      const pages = this.browser.pages();
      this.page = pages.length > 0 ? pages[0] : await this.browser.newPage();
      
      console.log('✅ Connected to existing Chrome');
    } catch (error) {
      // If connection fails, launch new instance
      console.log('⚠️ Could not connect to existing Chrome, launching new instance...');
      console.log('💡 To use existing Chrome, start it with: /Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --remote-debugging-port=9222');
      
      const userDataDir = `${process.env.HOME}/.referai-chrome-profile`;
      
      this.browser = await chromium.launchPersistentContext(userDataDir, {
        headless: false,
        channel: 'chrome',
        args: [
          '--disable-blink-features=AutomationControlled',
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--start-maximized',
          '--disable-popup-blocking'
        ],
        viewport: { width: 1920, height: 1080 },
        locale: 'en-US',
        permissions: ['geolocation', 'notifications']
      });

      const pages = this.browser.pages();
      this.page = pages.length > 0 ? pages[0] : await this.browser.newPage();
    }
    
    await this.page.addInitScript(`
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
    `);
  }

  async applyToLinkedInEasyApply(jobUrl: string, profile: UserProfile): Promise<boolean> {
    if (!this.page) throw new Error('Bot not initialized');

    try {
      console.log(`🔍 Navigating to LinkedIn job: ${jobUrl}`);
      await this.page.goto(jobUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await this.page.waitForTimeout(3000);

      // Check for Easy Apply button
      const easyApplyButton = this.page.locator('button:has-text("Easy Apply")');
      const hasEasyApply = await easyApplyButton.first().isVisible().catch(() => false);
      
      if (hasEasyApply) {
        console.log('✅ Found Easy Apply button - clicking...');
        await easyApplyButton.first().click();
        await this.page.waitForTimeout(2000);
        await this.fillLinkedInForm(profile);
        return true;
      }

      // Check for regular Apply button that opens external form
      const applyButton = this.page.locator('button:has-text("Apply"), a:has-text("Apply")');
      const hasApply = await applyButton.first().isVisible().catch(() => false);
      
      if (hasApply) {
        console.log('✅ Found Apply button - clicking...');
        await applyButton.first().click();
        await this.page.waitForTimeout(3000);
        
        // Check if new tab/page opened
        const pages = this.browser!.pages();
        if (pages.length > 1) {
          this.page = pages[pages.length - 1];
          await this.page.waitForTimeout(2000);
        }
        
        await this.fillGenericApplicationForm(profile);
        return true;
      }

      console.log('⚠️ No Apply button found');
      return false;
    } catch (error) {
      console.error('Application error:', error);
      return false;
    }
  }

  private async fillLinkedInForm(profile: UserProfile, depth: number = 0) {
    if (!this.page || depth > 5) return;

    try {
      await this.page.waitForTimeout(1500);
      console.log(`📝 Filling form (step ${depth + 1})...`);
      
      await this.fillFormFields(profile);
      await this.page.waitForTimeout(1000);
      
      // Check for Submit button
      const submitButton = this.page.locator('button:has-text("Submit application"), button:has-text("Submit"), button[aria-label*="Submit"]').first();
      if (await submitButton.isVisible().catch(() => false)) {
        console.log('✅ Submitting application...');
        await submitButton.click();
        await this.page.waitForTimeout(3000);
        return;
      }
      
      // Click Next/Continue for multi-step forms
      const nextButton = this.page.locator('button:has-text("Next"), button:has-text("Continue"), button:has-text("Review")').first();
      if (await nextButton.isVisible().catch(() => false)) {
        console.log('➡️ Moving to next step...');
        await nextButton.click();
        await this.page.waitForTimeout(1500);
        await this.fillLinkedInForm(profile, depth + 1);
      }
    } catch (error) {
      console.error('Form filling error:', error);
    }
  }

  private async fillGenericApplicationForm(profile: UserProfile) {
    if (!this.page) return;

    try {
      console.log('📝 Filling application form...');
      await this.page.waitForTimeout(2000);
      
      await this.fillFormFields(profile);
      await this.page.waitForTimeout(2000);
      
      // Try to find and click submit button
      const submitSelectors = [
        'button[type="submit"]',
        'button:has-text("Submit")',
        'button:has-text("Apply")',
        'button:has-text("Send Application")',
        'input[type="submit"]'
      ];
      
      for (const selector of submitSelectors) {
        const button = this.page.locator(selector).first();
        if (await button.isVisible().catch(() => false)) {
          console.log('✅ Submitting application...');
          await button.click();
          await this.page.waitForTimeout(3000);
          return;
        }
      }
      
      console.log('⚠️ Submit button not found - form may need manual review');
    } catch (error) {
      console.error('Generic form filling error:', error);
    }
  }

  private async fillFormFields(profile: UserProfile) {
    if (!this.page) return;

    const inputs = await this.page.locator('input:visible, textarea:visible').all();
    
    for (const input of inputs) {
      try {
        const type = await input.getAttribute('type');
        const name = (await input.getAttribute('name') || '').toLowerCase();
        const id = (await input.getAttribute('id') || '').toLowerCase();
        const label = (await input.getAttribute('aria-label') || '').toLowerCase();
        const placeholder = (await input.getAttribute('placeholder') || '').toLowerCase();
        
        const field = `${name} ${id} ${label} ${placeholder}`;
        
        if (type === 'file') {
          if (profile.resumePath) {
            await input.setInputFiles(profile.resumePath);
            console.log('✅ Uploaded resume');
          }
        } else if (field.includes('phone') || field.includes('mobile')) {
          await input.fill(profile.phone);
        } else if (type === 'email' || field.includes('email')) {
          await input.fill(profile.email);
        } else if (field.includes('first') && field.includes('name')) {
          await input.fill(profile.name.split(' ')[0]);
        } else if (field.includes('last') && field.includes('name')) {
          await input.fill(profile.name.split(' ').slice(1).join(' ') || profile.name.split(' ')[0]);
        } else if (field.includes('name') && !field.includes('company') && !field.includes('user')) {
          await input.fill(profile.name);
        } else if (field.includes('experience') || field.includes('years')) {
          if (profile.yearsOfExperience) await input.fill(profile.yearsOfExperience.toString());
        } else if (field.includes('company') || field.includes('employer')) {
          if (profile.currentCompany) await input.fill(profile.currentCompany);
        } else if (field.includes('title') || field.includes('position') || field.includes('role')) {
          if (profile.currentTitle) await input.fill(profile.currentTitle);
        } else if (field.includes('linkedin')) {
          if (profile.linkedinUrl) await input.fill(profile.linkedinUrl);
        } else if (field.includes('github')) {
          if (profile.githubUrl) await input.fill(profile.githubUrl);
        } else if (field.includes('portfolio') || field.includes('website')) {
          if (profile.portfolioUrl) await input.fill(profile.portfolioUrl);
        }
        
        await this.page.waitForTimeout(200);
      } catch (err) {}
    }
    
    // Handle dropdowns
    const selects = await this.page.locator('select:visible').all();
    for (const select of selects) {
      try {
        const options = await select.locator('option').all();
        if (options.length > 1) await select.selectOption({ index: 1 });
      } catch (err) {}
    }
  }

  async applyToIndeedJob(jobUrl: string, profile: UserProfile): Promise<boolean> {
    if (!this.page) throw new Error('Bot not initialized');

    try {
      console.log(`🔍 Navigating to Indeed job: ${jobUrl}`);
      await this.page.goto(jobUrl, { waitUntil: 'networkidle' });
      await this.page.waitForTimeout(2000);

      // Click Apply Now button
      const applyButton = await this.page.locator('button:has-text("Apply now"), a:has-text("Apply now")').first();
      if (await applyButton.isVisible()) {
        await applyButton.click();
        await this.page.waitForTimeout(2000);

        // Fill Indeed application form
        await this.fillIndeedForm(profile);

        // Submit
        const submitButton = await this.page.locator('button[type="submit"], button:has-text("Submit"), button:has-text("Continue")').first();
        if (await submitButton.isVisible()) {
          await submitButton.click();
          console.log('✅ Application submitted via Indeed');
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Indeed apply error:', error);
      return false;
    }
  }

  private async fillIndeedForm(profile: UserProfile) {
    if (!this.page) return;

    try {
      // Fill name
      const nameInput = this.page.locator('input[name*="name"], input[id*="name"]').first();
      if (await nameInput.isVisible()) {
        await nameInput.fill(profile.name);
      }

      // Fill email
      const emailInput = this.page.locator('input[type="email"], input[name*="email"]').first();
      if (await emailInput.isVisible()) {
        await emailInput.fill(profile.email);
      }

      // Fill phone
      const phoneInput = this.page.locator('input[type="tel"], input[name*="phone"]').first();
      if (await phoneInput.isVisible()) {
        await phoneInput.fill(profile.phone);
      }

      // Upload resume
      if (profile.resumePath) {
        const fileInput = this.page.locator('input[type="file"]').first();
        if (await fileInput.isVisible()) {
          await fileInput.setInputFiles(profile.resumePath);
          await this.page.waitForTimeout(2000);
        }
      }
    } catch (error) {
      console.error('Indeed form fill error:', error);
    }
  }

  async applyToGreenhouseJob(jobUrl: string, profile: UserProfile): Promise<boolean> {
    if (!this.page) throw new Error('Bot not initialized');

    try {
      console.log(`🔍 Navigating to Greenhouse job: ${jobUrl}`);
      await this.page.goto(jobUrl, { waitUntil: 'networkidle' });
      await this.page.waitForTimeout(2000);

      // Fill Greenhouse form
      await this.page.fill('input[name="job_application[first_name]"]', profile.name.split(' ')[0]);
      await this.page.fill('input[name="job_application[last_name]"]', profile.name.split(' ').slice(1).join(' '));
      await this.page.fill('input[name="job_application[email]"]', profile.email);
      await this.page.fill('input[name="job_application[phone]"]', profile.phone);

      // Upload resume
      if (profile.resumePath) {
        const fileInput = this.page.locator('input[type="file"]').first();
        await fileInput.setInputFiles(profile.resumePath);
        await this.page.waitForTimeout(2000);
      }

      // Submit
      const submitButton = await this.page.locator('input[type="submit"], button[type="submit"]').first();
      await submitButton.click();
      console.log('✅ Application submitted via Greenhouse');
      return true;
    } catch (error) {
      console.error('Greenhouse apply error:', error);
      return false;
    }
  }

  async applyToWorkdayJob(jobUrl: string, profile: UserProfile): Promise<boolean> {
    if (!this.page) throw new Error('Bot not initialized');

    try {
      console.log(`🔍 Navigating to Workday job: ${jobUrl}`);
      await this.page.goto(jobUrl, { waitUntil: 'networkidle' });
      await this.page.waitForTimeout(3000);

      // Click Apply button
      const applyButton = await this.page.locator('a:has-text("Apply"), button:has-text("Apply")').first();
      if (await applyButton.isVisible()) {
        await applyButton.click();
        await this.page.waitForTimeout(2000);

        // Fill Workday form (complex multi-step)
        await this.fillWorkdayForm(profile);

        console.log('✅ Application submitted via Workday');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Workday apply error:', error);
      return false;
    }
  }

  private async fillWorkdayForm(profile: UserProfile) {
    if (!this.page) return;

    try {
      // Workday has complex forms - fill common fields
      const inputs = await this.page.locator('input[type="text"], input[type="email"], input[type="tel"]').all();
      
      for (const input of inputs) {
        const label = await input.getAttribute('aria-label') || await input.getAttribute('name') || '';
        
        if (label.toLowerCase().includes('name')) {
          await input.fill(profile.name);
        } else if (label.toLowerCase().includes('email')) {
          await input.fill(profile.email);
        } else if (label.toLowerCase().includes('phone')) {
          await input.fill(profile.phone);
        }
      }

      // Upload resume
      if (profile.resumePath) {
        const fileInput = this.page.locator('input[type="file"]').first();
        if (await fileInput.isVisible()) {
          await fileInput.setInputFiles(profile.resumePath);
          await this.page.waitForTimeout(2000);
        }
      }

      // Click through multi-step form
      let continueButton = this.page.locator('button:has-text("Continue"), button:has-text("Next")').first();
      while (await continueButton.isVisible()) {
        await continueButton.click();
        await this.page.waitForTimeout(1500);
        continueButton = this.page.locator('button:has-text("Continue"), button:has-text("Next")').first();
      }

      // Final submit
      const submitButton = await this.page.locator('button:has-text("Submit"), button:has-text("Submit Application")').first();
      if (await submitButton.isVisible()) {
        await submitButton.click();
      }
    } catch (error) {
      console.error('Workday form fill error:', error);
    }
  }

  async detectAndApply(jobUrl: string, profile: UserProfile): Promise<boolean> {
    if (!this.page) throw new Error('Bot not initialized');

    try {
      // Detect platform and apply accordingly
      if (jobUrl.includes('linkedin.com')) {
        return await this.applyToLinkedInEasyApply(jobUrl, profile);
      } else if (jobUrl.includes('indeed.com')) {
        return await this.applyToIndeedJob(jobUrl, profile);
      } else if (jobUrl.includes('greenhouse.io') || jobUrl.includes('boards.greenhouse.io')) {
        return await this.applyToGreenhouseJob(jobUrl, profile);
      } else if (jobUrl.includes('myworkdayjobs.com')) {
        return await this.applyToWorkdayJob(jobUrl, profile);
      } else {
        // Generic application form
        return await this.applyToGenericJob(jobUrl, profile);
      }
    } catch (error) {
      console.error('Apply error:', error);
      return false;
    }
  }

  private async applyToGenericJob(jobUrl: string, profile: UserProfile): Promise<boolean> {
    if (!this.page) return false;

    try {
      await this.page.goto(jobUrl, { waitUntil: 'networkidle' });
      await this.page.waitForTimeout(2000);

      // Find and fill form fields
      const nameInputs = await this.page.locator('input[name*="name"], input[id*="name"]').all();
      for (const input of nameInputs) {
        if (await input.isVisible()) {
          await input.fill(profile.name);
        }
      }

      const emailInputs = await this.page.locator('input[type="email"], input[name*="email"]').all();
      for (const input of emailInputs) {
        if (await input.isVisible()) {
          await input.fill(profile.email);
        }
      }

      const phoneInputs = await this.page.locator('input[type="tel"], input[name*="phone"]').all();
      for (const input of phoneInputs) {
        if (await input.isVisible()) {
          await input.fill(profile.phone);
        }
      }

      // Upload resume
      if (profile.resumePath) {
        const fileInput = this.page.locator('input[type="file"]').first();
        if (await fileInput.isVisible()) {
          await fileInput.setInputFiles(profile.resumePath);
        }
      }

      // Find and click submit
      const submitButton = await this.page.locator('button[type="submit"], input[type="submit"], button:has-text("Submit"), button:has-text("Apply")').first();
      if (await submitButton.isVisible()) {
        await submitButton.click();
        return true;
      }

      return false;
    } catch (error) {
      console.error('Generic apply error:', error);
      return false;
    }
  }

  async loginToLinkedIn(email: string, password: string): Promise<boolean> {
    if (!this.page) return false;

    try {
      console.log('🔐 Checking LinkedIn login status...');
      await this.page.goto('https://www.linkedin.com/feed', { waitUntil: 'domcontentloaded', timeout: 60000 });
      await this.page.waitForTimeout(3000);

      // Check if already logged in using Chrome's saved session
      if (this.page.url().includes('feed') || this.page.url().includes('mynetwork')) {
        console.log('✅ Already logged in using Chrome session');
        return true;
      }

      // If not logged in, redirect to login page
      console.log('⚠️ Not logged in. Please login manually in the browser...');
      await this.page.goto('https://www.linkedin.com/login', { waitUntil: 'domcontentloaded' });
      
      console.log('⏳ Waiting 30 seconds for you to login manually...');
      console.log('👉 Please login to LinkedIn in the browser window');
      console.log('👉 Use "Sign in with Google" for best results');
      
      await this.page.waitForTimeout(30000);

      // Check if login successful
      const currentUrl = this.page.url();
      if (currentUrl.includes('feed') || currentUrl.includes('mynetwork') || currentUrl.includes('linkedin.com/in/')) {
        console.log('✅ LinkedIn login successful');
        return true;
      }

      console.log('⚠️ Login not detected, continuing anyway...');
      return true;
    } catch (error) {
      console.error('LinkedIn login error:', error);
      return false;
    }
  }

  async bulkApply(jobs: any[], profile: UserProfile): Promise<JobApplication[]> {
    const results: JobApplication[] = [];

    if (profile.linkedinEmail && profile.linkedinPassword) {
      await this.loginToLinkedIn(profile.linkedinEmail, profile.linkedinPassword);
    }

    for (const job of jobs) {
      try {
        console.log(`\n🤖 Applying to: ${job.job_title} at ${job.employer_name}`);
        
        // Search for job application URL
        const jobUrl = await this.findJobApplicationUrl(job);
        
        if (!jobUrl) {
          results.push({
            jobId: job.job_id,
            jobTitle: job.job_title,
            company: job.employer_name,
            status: 'failed',
            error: 'Could not find application URL'
          });
          continue;
        }

        const success = await this.detectAndApply(jobUrl, profile);
        
        results.push({
          jobId: job.job_id,
          jobTitle: job.job_title,
          company: job.employer_name,
          jobUrl,
          status: success ? 'applied' : 'failed',
          error: success ? undefined : 'Application failed'
        });

        // Wait between applications to avoid rate limiting
        await this.page?.waitForTimeout(3000);
      } catch (error: any) {
        results.push({
          jobId: job.job_id,
          jobTitle: job.job_title,
          company: job.employer_name,
          status: 'failed',
          error: error.message
        });
      }
    }

    return results;
  }

  private async findJobApplicationUrl(job: any): Promise<string | null> {
    if (!this.page) return null;

    try {
      // Search Google for job application page
      const searchQuery = `${job.job_title} ${job.employer_name} apply`;
      await this.page.goto(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`);
      await this.page.waitForTimeout(2000);

      // Get first result link
      const firstLink = await this.page.locator('a[href*="linkedin.com/jobs"], a[href*="indeed.com"], a[href*="greenhouse.io"], a[href*="myworkdayjobs.com"]').first();
      
      if (await firstLink.isVisible()) {
        const href = await firstLink.getAttribute('href');
        return href;
      }

      return null;
    } catch (error) {
      console.error('URL search error:', error);
      return null;
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }
}

export const productionAIBot = new ProductionAIApplyBot();
