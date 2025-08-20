import { render } from '@react-email/components';
import { Resend } from 'resend';
import { EmailVerificationEmail, PasswordResetEmail, WelcomeEmail } from './index';
import type { EmailVerificationProps, PasswordResetProps, WelcomeEmailProps } from './types';

// Initialize Resend client
const resend = new Resend(process.env['RESEND_API_KEY']);

// Email renderer utility class
export class EmailRenderer {
  /**
   * Render a React Email template to HTML string
   */
  static async renderTemplate(template: React.ReactElement): Promise<string> {
    try {
      return await render(template);
    } catch (error) {
      console.error('Error rendering email template:', error);
      throw new Error(`Failed to render email template: ${error}`);
    }
  }

  /**
   * Send welcome email using Resend
   */
  static async sendWelcomeEmail(props: WelcomeEmailProps) {
    try {
      const html = await this.renderTemplate(WelcomeEmail(props));

      const result = await resend.emails.send({
        from: 'CalcBuilder Pro <noreply@calcbuilder.com>',
        to: [props.userEmail],
        subject: this.getWelcomeEmailSubject(props.language),
        html,
        text: this.generateTextVersion(props),
      });

      return result;
    } catch (error) {
      console.error('Error sending welcome email:', error);
      throw new Error(`Failed to send welcome email: ${error}`);
    }
  }

  /**
   * Send email verification email using Resend
   */
  static async sendVerificationEmail(props: EmailVerificationProps) {
    try {
      const html = await this.renderTemplate(EmailVerificationEmail(props));

      const result = await resend.emails.send({
        from: 'CalcBuilder Pro <noreply@calcbuilder.com>',
        to: [props.userEmail],
        subject: this.getVerificationEmailSubject(props.language),
        html,
        text: this.generateVerificationTextVersion(props),
      });

      return result;
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw new Error(`Failed to send verification email: ${error}`);
    }
  }

  /**
   * Send password reset email using Resend
   */
  static async sendPasswordResetEmail(props: PasswordResetProps) {
    try {
      const html = await this.renderTemplate(PasswordResetEmail(props));

      const result = await resend.emails.send({
        from: 'CalcBuilder Pro <noreply@calcbuilder.com>',
        to: [props.userEmail],
        subject: this.getPasswordResetSubject(props.language),
        html,
        text: this.generatePasswordResetTextVersion(props),
      });

      return result;
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw new Error(`Failed to send password reset email: ${error}`);
    }
  }

  /**
   * Get localized subject for welcome email
   */
  private static getWelcomeEmailSubject(language: string = 'fi'): string {
    const subjects = {
      fi: 'Tervetuloa CalcBuilder Pro:hon!',
      en: 'Welcome to CalcBuilder Pro!',
      sv: 'Välkommen till CalcBuilder Pro!',
    };
    return subjects[language as keyof typeof subjects] || subjects.fi;
  }

  /**
   * Get localized subject for verification email
   */
  private static getVerificationEmailSubject(language: string = 'fi'): string {
    const subjects = {
      fi: 'Vahvista sähköpostiosoitteesi - CalcBuilder Pro',
      en: 'Verify Your Email Address - CalcBuilder Pro',
      sv: 'Verifiera din e-postadress - CalcBuilder Pro',
    };
    return subjects[language as keyof typeof subjects] || subjects.fi;
  }

  /**
   * Get localized subject for password reset email
   */
  private static getPasswordResetSubject(language: string = 'fi'): string {
    const subjects = {
      fi: 'Salasanan nollaus - CalcBuilder Pro',
      en: 'Password Reset - CalcBuilder Pro',
      sv: 'Lösenordsåterställning - CalcBuilder Pro',
    };
    return subjects[language as keyof typeof subjects] || subjects.fi;
  }

  /**
   * Generate plain text version of welcome email
   */
  private static generateTextVersion(props: WelcomeEmailProps): string {
    const { userName, language = 'fi' } = props;

    const content = {
      fi: {
        greeting: `Hei ${userName}!`,
        body: 'Olemme iloisia, että liityit CalcBuilder Pro:hon. CalcBuilder Pro on tehokas no-code alusta ammattilaisten laskureiden luomiseen.',
        features:
          'Mitä voit tehdä:\n🎯 Luo laskureita vedä ja pudota -toiminnolla\n🎨 Mukauta ulkoasua ja brändäystä\n🔗 Upota laskureita verkkosivuille\n📊 Seuraa käyttöä analytiikalla',
        callToAction: 'Aloita nyt kirjautumalla sisään ja luomalla ensimmäinen laskurisi.',
        footer:
          'CalcBuilder Pro - Laskurigeneraattori ammattilaisille\nSupport: support@calcbuilder.com',
      },
      en: {
        greeting: `Hi ${userName}!`,
        body: "We're excited to have you join CalcBuilder Pro. CalcBuilder Pro is a powerful no-code platform for creating professional calculators.",
        features:
          'What you can do:\n🎯 Create calculators with drag & drop\n🎨 Customize appearance and branding\n🔗 Embed calculators on websites\n📊 Track usage with analytics',
        callToAction: 'Get started now by logging in and creating your first calculator.',
        footer:
          'CalcBuilder Pro - Calculator Generator for Professionals\nSupport: support@calcbuilder.com',
      },
      sv: {
        greeting: `Hej ${userName}!`,
        body: 'Vi är glada att du gick med i CalcBuilder Pro. CalcBuilder Pro är en kraftfull no-code-plattform för att skapa professionella kalkylatorer.',
        features:
          'Vad du kan göra:\n🎯 Skapa kalkylatorer med dra och släpp\n🎨 Anpassa utseende och varumärke\n🔗 Bädda in kalkylatorer på webbplatser\n📊 Spåra användning med analys',
        callToAction: 'Kom igång nu genom att logga in och skapa din första kalkylator.',
        footer: 'CalcBuilder Pro - Kalkylgenerator för proffs\nSupport: support@calcbuilder.com',
      },
    };

    const lang = content[language as keyof typeof content] || content.fi;

    return `${lang.greeting}\n\n${lang.body}\n\n${lang.features}\n\n${lang.callToAction}\n\n${
      lang.footer
    }`;
  }

  /**
   * Generate plain text version of verification email
   */
  private static generateVerificationTextVersion(props: EmailVerificationProps): string {
    const { userName, verificationUrl, expiresIn = '24 hours', language = 'fi' } = props;

    const content = {
      fi: {
        greeting: `Hei ${userName}!`,
        body: 'Kiitos, että rekisteröidyit CalcBuilder Pro:hon! Vahvista sähköpostiosoitteesi klikkaamalla alla olevaa linkkiä.',
        verification: `Vahvista sähköposti: ${verificationUrl}`,
        expiration: `Tämä linkki vanhenee ${expiresIn} kuluttua.`,
        security: 'Turvallisuussyistä älä jaa tätä linkkiä kenenkään kanssa.',
        footer:
          'CalcBuilder Pro - Laskurigeneraattori ammattilaisille\nSupport: support@calcbuilder.com',
      },
      en: {
        greeting: `Hi ${userName}!`,
        body: 'Thank you for signing up for CalcBuilder Pro! Please verify your email address by clicking the link below.',
        verification: `Verify Email: ${verificationUrl}`,
        expiration: `This link expires in ${expiresIn}.`,
        security: 'For security reasons, do not share this link with anyone.',
        footer:
          'CalcBuilder Pro - Calculator Generator for Professionals\nSupport: support@calcbuilder.com',
      },
      sv: {
        greeting: `Hej ${userName}!`,
        body: 'Tack för att du registrerade dig för CalcBuilder Pro! Vänligen verifiera din e-postadress genom att klicka på länken nedan.',
        verification: `Verifiera e-post: ${verificationUrl}`,
        expiration: `Den här länken går ut om ${expiresIn}.`,
        security: 'Av säkerhetsskäl, dela inte den här länken med någon.',
        footer: 'CalcBuilder Pro - Kalkylgenerator för proffs\nSupport: support@calcbuilder.com',
      },
    };

    const lang = content[language as keyof typeof content] || content.fi;

    return `${lang.greeting}\n\n${lang.body}\n\n${lang.verification}\n\n${
      lang.expiration
    }\n\n${lang.security}\n\n${lang.footer}`;
  }

  /**
   * Generate plain text version of password reset email
   */
  private static generatePasswordResetTextVersion(props: PasswordResetProps): string {
    const { userName, resetUrl, expiresIn = '1 hour', language = 'fi' } = props;

    const content = {
      fi: {
        greeting: `Hei ${userName}!`,
        body: 'Olet pyytänyt salasanasi nollaamista CalcBuilder Pro -tilillesi. Klikkaa alla olevaa linkkiä nollataksesi salasanasi.',
        reset: `Nollaa salasana: ${resetUrl}`,
        expiration: `Tämä linkki vanhenee ${expiresIn} kuluttua.`,
        security: 'Turvallisuussyistä älä jaa tätä linkkiä kenenkään kanssa.',
        footer:
          'CalcBuilder Pro - Laskurigeneraattori ammattilaisille\nSupport: support@calcbuilder.com',
      },
      en: {
        greeting: `Hi ${userName}!`,
        body: 'You have requested to reset your password for your CalcBuilder Pro account. Click the link below to reset your password.',
        reset: `Reset Password: ${resetUrl}`,
        expiration: `This link expires in ${expiresIn}.`,
        security: 'For security reasons, do not share this link with anyone.',
        footer:
          'CalcBuilder Pro - Calculator Generator for Professionals\nSupport: support@calcbuilder.com',
      },
      sv: {
        greeting: `Hej ${userName}!`,
        body: 'Du har begärt att återställa ditt lösenord för ditt CalcBuilder Pro-konto. Klicka på länken nedan för att återställa ditt lösenord.',
        reset: `Återställ lösenord: ${resetUrl}`,
        expiration: `Den här länken går ut om ${expiresIn}.`,
        security: 'Av säkerhetsskäl, dela inte den här länken med någon.',
        footer: 'CalcBuilder Pro - Kalkylgenerator för proffs\nSupport: support@calcbuilder.com',
      },
    };

    const lang = content[language as keyof typeof content] || content.fi;

    return `${lang.greeting}\n\n${lang.body}\n\n${lang.reset}\n\n${
      lang.expiration
    }\n\n${lang.security}\n\n${lang.footer}`;
  }
}

// Export individual functions for convenience
export const sendWelcomeEmail = EmailRenderer.sendWelcomeEmail.bind(EmailRenderer);
export const sendVerificationEmail = EmailRenderer.sendVerificationEmail.bind(EmailRenderer);
export const sendPasswordResetEmail = EmailRenderer.sendPasswordResetEmail.bind(EmailRenderer);
export const renderTemplate = EmailRenderer.renderTemplate.bind(EmailRenderer);
