import { NextRequest, NextResponse } from 'next/server';
import { sendWelcomeEmail, sendVerificationEmail, sendPasswordResetEmail } from '@/emails';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { template, language = 'fi', testEmail } = body;

    if (!testEmail) {
      return NextResponse.json({ error: 'Test email address is required' }, { status: 400 });
    }

    let result;

    switch (template) {
      case 'welcome':
        result = await sendWelcomeEmail({
          userName: 'Test User',
          userEmail: testEmail,
          loginUrl: 'https://calcbuilder.com/login',
          language: language as 'fi' | 'en' | 'sv',
        });
        break;

      case 'verification':
        result = await sendVerificationEmail({
          userName: 'Test User',
          userEmail: testEmail,
          verificationUrl: 'https://calcbuilder.com/verify-email?token=test123',
          language: language as 'fi' | 'en' | 'sv',
          expiresIn: '24 hours',
        });
        break;

      case 'password-reset':
        result = await sendPasswordResetEmail({
          userName: 'Test User',
          userEmail: testEmail,
          resetUrl: 'https://calcbuilder.com/reset-password?token=test456',
          language: language as 'fi' | 'en' | 'sv',
          expiresIn: '1 hour',
        });
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid template type. Use: welcome, verification, or password-reset' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: `${template} email sent successfully to ${testEmail}`,
      result,
      template,
      language,
    });
  } catch (error) {
    console.error('Error sending test email:', error);

    return NextResponse.json(
      {
        error: 'Failed to send email',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Email testing endpoint',
    usage: 'POST with { template, language, testEmail }',
    templates: ['welcome', 'verification', 'password-reset'],
    languages: ['fi', 'en', 'sv'],
    example: {
      template: 'welcome',
      language: 'fi',
      testEmail: 'test@example.com',
    },
  });
}
