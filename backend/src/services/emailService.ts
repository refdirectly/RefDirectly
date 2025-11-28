import nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter;

const initTransporter = () => {
  if (!transporter) {
    // For development: Use Ethereal (fake SMTP) if Gmail credentials are invalid
    if (process.env.NODE_ENV === 'development' && (!process.env.EMAIL_PASSWORD || process.env.EMAIL_PASSWORD.length < 16)) {
      console.log('⚠️  Using console logging for OTP (Gmail not configured)');
      return null;
    }
    
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      },
      pool: true,
      maxConnections: 5,
      maxMessages: 100
    });
  }
  return transporter;
};

export const sendOTP = async (email: string, otp: string, retries = 3): Promise<void> => {
  const transport = initTransporter();
  
  // Development fallback: Log OTP to console if email not configured
  if (!transport) {
    console.log('\n' + '='.repeat(60));
    console.log('📧 OTP EMAIL (Development Mode)');
    console.log('='.repeat(60));
    console.log(`To: ${email}`);
    console.log(`OTP Code: ${otp}`);
    console.log(`Expires: 10 minutes`);
    console.log('='.repeat(60) + '\n');
    return;
  }
  
  const mailOptions = {
    from: `"RefDirectly" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'RefDirectly - Email Verification OTP',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #f5f5f5;">
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          <div style="background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">RefDirectly</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Email Verification</p>
          </div>
          <div style="padding: 40px 30px;">
            <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">Hello,</p>
            <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">Your verification code is:</p>
            <div style="background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%); color: white; padding: 30px; text-align: center; border-radius: 12px; margin: 0 0 30px 0;">
              <h1 style="margin: 0; font-size: 48px; letter-spacing: 10px; font-weight: 700;">${otp}</h1>
            </div>
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 0 0 30px 0;">
              <p style="color: #92400e; margin: 0; font-size: 14px; line-height: 1.5;">
                <strong>⏱️ Important:</strong> This OTP will expire in <strong>10 minutes</strong>. Do not share this code with anyone.
              </p>
            </div>
            <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 0;">If you didn't request this verification, please ignore this email or contact our support team.</p>
          </div>
          <div style="background: #f9fafb; padding: 20px 30px; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0; text-align: center;">© 2024 RefDirectly. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  for (let i = 0; i < retries; i++) {
    try {
      await transport.sendMail(mailOptions);
      console.log(`✅ OTP sent to ${email}`);
      return;
    } catch (error: any) {
      console.error(`❌ Email send attempt ${i + 1} failed:`, error.message);
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};

export const verifyEmailConfig = async (): Promise<boolean> => {
  try {
    const transport = initTransporter();
    await transport.verify();
    console.log('✅ Email service configured correctly');
    return true;
  } catch (error: any) {
    console.error('❌ Email service configuration error:', error.message);
    return false;
  }
};
