import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  resumeUrl?: string;
  linkedinUrl?: string;
}

export class AIApplyService {
  private browser: any = null;

  async initialize() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    }
  }

  async applyToJob(jobUrl: string, userProfile: UserProfile): Promise<{ success: boolean; message: string }> {
    try {
      await this.initialize();
      const page = await this.browser.newPage();
      
      await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');
      await page.goto(jobUrl, { waitUntil: 'networkidle2', timeout: 30000 });

      // Try to find and fill common application form fields
      const applied = await this.fillApplicationForm(page, userProfile);

      await page.close();

      return applied 
        ? { success: true, message: 'Application submitted successfully' }
        : { success: false, message: 'Could not auto-fill application form' };

    } catch (error: any) {
      console.error('AI Apply error:', error);
      return { success: false, message: error.message || 'Failed to apply' };
    }
  }

  private async fillApplicationForm(page: any, profile: UserProfile): Promise<boolean> {
    try {
      // Wait for form elements
      await page.waitForSelector('input, textarea', { timeout: 5000 });

      // Fill name fields
      const nameSelectors = ['input[name*="name"]', 'input[id*="name"]', 'input[placeholder*="name"]'];
      for (const selector of nameSelectors) {
        try {
          const elements = await page.$$(selector);
          for (const el of elements) {
            await el.type(profile.name, { delay: 50 });
          }
        } catch (e) {}
      }

      // Fill email fields
      const emailSelectors = ['input[type="email"]', 'input[name*="email"]', 'input[id*="email"]'];
      for (const selector of emailSelectors) {
        try {
          const elements = await page.$$(selector);
          for (const el of elements) {
            await el.type(profile.email, { delay: 50 });
          }
        } catch (e) {}
      }

      // Fill phone fields
      const phoneSelectors = ['input[type="tel"]', 'input[name*="phone"]', 'input[id*="phone"]'];
      for (const selector of phoneSelectors) {
        try {
          const elements = await page.$$(selector);
          for (const el of elements) {
            await el.type(profile.phone, { delay: 50 });
          }
        } catch (e) {}
      }

      // Upload resume if file input exists
      if (profile.resumeUrl) {
        try {
          const fileInput = await page.$('input[type="file"]');
          if (fileInput) {
            // Note: This requires local file path, not URL
            // await fileInput.uploadFile(profile.resumeUrl);
          }
        } catch (e) {}
      }

      // Try to find and click submit button
      const submitSelectors = [
        'button[type="submit"]',
        'input[type="submit"]',
        'button:contains("Submit")',
        'button:contains("Apply")',
        'a:contains("Apply")'
      ];

      for (const selector of submitSelectors) {
        try {
          const button = await page.$(selector);
          if (button) {
            await button.click();
            await page.waitForNavigation({ timeout: 5000 }).catch(() => {});
            return true;
          }
        } catch (e) {}
      }

      return false;
    } catch (error) {
      console.error('Form fill error:', error);
      return false;
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

export const aiApplyService = new AIApplyService();
