// Email system exports

// Types
export type {
  BrandConfig,
  EmailBaseProps,
  EmailUser,
  EmailVerificationProps,
  Language,
  LanguageContent,
  MfaEnrollmentProps,
  PasswordResetProps,
  WelcomeEmailProps,
} from './types';

// Constants
export { DEFAULT_BRAND } from './types';

// Utilities
export {
  EMAIL_CONTENT,
  formatExpirationTime,
  getButtonStyles,
  getContainerStyles,
  getFooterStyles,
  getHeaderStyles,
  getLocalizedText,
  isSafeUrl,
  isValidEmail,
} from './utils';

// Templates
export { default as WelcomeEmail } from './templates/WelcomeEmail';
export { default as EmailVerificationEmail } from './templates/EmailVerificationEmail';
export { default as PasswordResetEmail } from './templates/PasswordResetEmail';
// export { MfaEnrollmentEmail } from './templates/MfaEnrollmentEmail';

// Email Renderer & Resend Integration
export {
  EmailRenderer,
  sendWelcomeEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  renderTemplate,
} from './email-renderer';
