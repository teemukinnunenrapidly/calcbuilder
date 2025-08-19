import { Resend } from 'resend';

// Initialize Resend client
export const resend = new Resend(process.env['RESEND_API_KEY']);

// Email template types
export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

// Authentication email templates
export const authEmailTemplates = {
  // Email verification template
  verification: (email: string, token: string, appUrl: string) => ({
    to: email,
    subject: 'Verify your email address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to CalcBuilder Pro!</h2>
        <p>Please verify your email address by clicking the button below:</p>
        <a href="${appUrl}/auth/verify?token=${token}" 
           style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px;">
          Verify Email
        </a>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p>${appUrl}/auth/verify?token=${token}</p>
        <p>This link will expire in 24 hours.</p>
      </div>
    `,
  }),

  // Password reset template
  passwordReset: (email: string, token: string, appUrl: string) => ({
    to: email,
    subject: 'Reset your password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>You requested a password reset. Click the button below to set a new password:</p>
        <a href="${appUrl}/auth/reset-password?token=${token}" 
           style="display: inline-block; padding: 12px 24px; background-color: #ef4444; color: white; text-decoration: none; border-radius: 6px;">
          Reset Password
        </a>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p>${appUrl}/auth/reset-password?token=${token}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  }),

  // Welcome email template
  welcome: (email: string, name: string, appUrl: string) => ({
    to: email,
    subject: 'Welcome to CalcBuilder Pro!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to CalcBuilder Pro, ${name}!</h2>
        <p>Your account has been successfully created. You can now:</p>
        <ul>
          <li>Create your first calculator</li>
          <li>Set up your company profile</li>
          <li>Start building forms and formulas</li>
        </ul>
        <a href="${appUrl}/dashboard" 
           style="display: inline-block; padding: 12px 24px; background-color: #10b981; color: white; text-decoration: none; border-radius: 6px;">
          Go to Dashboard
        </a>
        <p>If you have any questions, feel free to reach out to our support team.</p>
      </div>
    `,
  }),
};

// Send email function
export async function sendEmail(template: EmailTemplate) {
  try {
    const { data, error } = await resend.emails.send({
      from: template.from || 'CalcBuilder Pro <noreply@calcbuilder.com>',
      to: template.to,
      subject: template.subject,
      html: template.html,
    });

    if (error) {
      console.error('Error sending email:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

// Test email function for development
export async function sendTestEmail() {
  const testTemplate = {
    to: 'test@example.com',
    subject: 'Test Email from CalcBuilder Pro',
    html: '<h1>Test Email</h1><p>This is a test email to verify Resend integration.</p>',
  };

  return sendEmail(testTemplate);
}
