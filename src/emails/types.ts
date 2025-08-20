// Email template types and interfaces

export type Language = 'fi' | 'en' | 'sv';

export interface EmailUser {
  name: string;
  email: string;
  id?: string;
}

export interface EmailBaseProps {
  language?: Language;
  companyName?: string;
  supportEmail?: string;
  unsubscribeUrl?: string;
}

export interface WelcomeEmailProps extends EmailBaseProps {
  userName: string;
  userEmail: string;
  loginUrl: string;
}

export interface EmailVerificationProps extends EmailBaseProps {
  userName: string;
  userEmail: string;
  verificationUrl: string;
  expiresIn?: string;
}

export interface PasswordResetProps extends EmailBaseProps {
  userName: string;
  userEmail: string;
  resetUrl: string;
  expiresIn?: string;
}

export interface MfaEnrollmentProps extends EmailBaseProps {
  userName: string;
  enrollmentUrl: string;
  qrCodeUrl?: string;
}

// Brand configuration
export interface BrandConfig {
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
  companyName: string;
  websiteUrl: string;
  supportEmail: string;
}

// Default brand configuration for CalcBuilder Pro
export const DEFAULT_BRAND: BrandConfig = {
  primaryColor: '#3B82F6', // Blue-500
  secondaryColor: '#1F2937', // Gray-800
  logoUrl: 'https://calcbuilder.com/logo.png',
  companyName: 'CalcBuilder Pro',
  websiteUrl: 'https://calcbuilder.com',
  supportEmail: 'support@calcbuilder.com',
};

// Language content mapping
export interface LanguageContent {
  [key: string]: {
    fi: string;
    en: string;
    sv: string;
  };
}
