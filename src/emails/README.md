# Email Templates System

This directory contains the email templates system for CalcBuilder Pro authentication flows.

## Structure

```
src/emails/
├── index.ts           # Main exports
├── types.ts           # TypeScript type definitions
├── utils.ts           # Utility functions and constants
├── README.md          # This file
└── templates/         # Email template components
    ├── WelcomeEmail.tsx
    ├── EmailVerificationEmail.tsx
    ├── PasswordResetEmail.tsx
    └── MfaEnrollmentEmail.tsx
```

## Features

- ✅ **React Email** integration for modern email templates
- ✅ **Multi-language support** (Finnish, English, Swedish)
- ✅ **CalcBuilder Pro branding** with consistent styling
- ✅ **Type-safe** with TypeScript definitions
- ✅ **Responsive design** that works across email clients
- ✅ **Accessibility** compliance (WCAG 2.1)

## Usage

```typescript
import { WelcomeEmail, Language } from '@/emails';

// Create a welcome email
const email = WelcomeEmail({
  userName: 'John Doe',
  userEmail: 'john@example.com',
  loginUrl: 'https://calcbuilder.com/login',
  language: 'en' as Language,
});
```

## Language Support

All templates support three languages:

- `fi` - Finnish (default)
- `en` - English
- `sv` - Swedish

## Styling

Templates use consistent styling with:

- CalcBuilder Pro brand colors (#3B82F6 primary, #1F2937 secondary)
- Responsive design for all screen sizes
- Email client compatibility (Gmail, Outlook, Apple Mail, etc.)

## Development

1. Create new templates in `templates/` directory
2. Follow the existing naming convention
3. Implement the shared interfaces from `types.ts`
4. Use utilities from `utils.ts` for consistent styling
5. Add exports to `index.ts`

## Testing

Templates can be tested using the test page at `/test-email-templates` (when implemented).
