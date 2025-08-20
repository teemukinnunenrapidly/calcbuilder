import { Language, LanguageContent } from './types';

// Get localized text based on language
export function getLocalizedText(
  content: LanguageContent[string],
  language: Language = 'fi'
): string {
  return content[language] || content.en || content.fi;
}

// Common email content translations
export const EMAIL_CONTENT = {
  welcome: {
    subject: {
      fi: 'Tervetuloa CalcBuilder Pro:hon!',
      en: 'Welcome to CalcBuilder Pro!',
      sv: 'Välkommen till CalcBuilder Pro!',
    },
    preview: {
      fi: 'Tervetuloa CalcBuilder Pro -alustalle!',
      en: 'Welcome to the CalcBuilder Pro platform!',
      sv: 'Välkommen till CalcBuilder Pro-plattformen!',
    },
    intro: {
      fi: 'Hei {userName}!',
      en: 'Hi {userName}!',
      sv: 'Hej {userName}!',
    },
    body1: {
      fi: 'Olemme iloisia, että liityit CalcBuilder Pro:hon.',
      en: "We're excited to have you join CalcBuilder Pro.",
      sv: 'Vi är glada att du gick med i CalcBuilder Pro.',
    },
    body2: {
      fi: 'CalcBuilder Pro on tehokas no-code alusta ammattilaisten laskureiden luomiseen. Voit nyt aloittaa rakentamaan interaktiivisia laskureita ilman koodausta.',
      en: 'CalcBuilder Pro is a powerful no-code platform for creating professional calculators. You can now start building interactive calculators without coding.',
      sv: 'CalcBuilder Pro är en kraftfull no-code-plattform för att skapa professionella kalkylatorer. Du kan nu börja bygga interaktiva kalkylatorer utan kodning.',
    },
    features: {
      title: {
        fi: 'Mitä voit tehdä:',
        en: 'What you can do:',
        sv: 'Vad du kan göra:',
      },
      dragDrop: {
        fi: '🎯 Luo laskureita vedä ja pudota -toiminnolla',
        en: '🎯 Create calculators with drag & drop',
        sv: '🎯 Skapa kalkylatorer med dra och släpp',
      },
      customize: {
        fi: '🎨 Mukauta ulkoasua ja brändäystä',
        en: '🎨 Customize appearance and branding',
        sv: '🎨 Anpassa utseende och varumärke',
      },
      embed: {
        fi: '🔗 Upota laskureita verkkosivuille',
        en: '🔗 Embed calculators on websites',
        sv: '🔗 Bädda in kalkylatorer på webbplatser',
      },
      analytics: {
        fi: '📊 Seuraa käyttöä analytiikalla',
        en: '📊 Track usage with analytics',
        sv: '📊 Spåra användning med analys',
      },
    },
    callToAction: {
      fi: 'Aloita nyt kirjautumalla sisään ja luomalla ensimmäinen laskurisi.',
      en: 'Get started now by logging in and creating your first calculator.',
      sv: 'Kom igång nu genom att logga in och skapa din första kalkylator.',
    },
    loginButton: {
      fi: 'Kirjaudu sisään',
      en: 'Log In',
      sv: 'Logga in',
    },
    supportPrompt: {
      fi: 'Tarvitsetko apua? Tutustu dokumentaatioomme tai ota yhteyttä tukitiimiimme.',
      en: 'Need help? Check out our documentation or contact our support team.',
      sv: 'Behöver du hjälp? Kolla vår dokumentation eller kontakta vårt supportteam.',
    },
    supportButton: {
      fi: 'Ota yhteyttä tukeen',
      en: 'Contact Support',
      sv: 'Kontakta support',
    },
  },
  verification: {
    subject: {
      fi: 'Vahvista sähköpostiosoitteesi - CalcBuilder Pro',
      en: 'Verify Your Email Address - CalcBuilder Pro',
      sv: 'Verifiera din e-postadress - CalcBuilder Pro',
    },
    preview: {
      fi: 'Vahvista sähköpostiosoitteesi CalcBuilder Pro -tilin aktivointia varten',
      en: 'Verify your email address to activate your CalcBuilder Pro account',
      sv: 'Verifiera din e-postadress för att aktivera ditt CalcBuilder Pro-konto',
    },
    intro: {
      fi: 'Hei {userName}!',
      en: 'Hi {userName}!',
      sv: 'Hej {userName}!',
    },
    body1: {
      fi: 'Kiitos, että rekisteröidyit CalcBuilder Pro:hon!',
      en: 'Thank you for signing up for CalcBuilder Pro!',
      sv: 'Tack för att du registrerade dig för CalcBuilder Pro!',
    },
    body2: {
      fi: 'Vahvista sähköpostiosoitteesi klikkaamalla alla olevaa painiketta. Tämä on tärkeä turvallisuusvaihe tilisi aktivointia varten.',
      en: 'Please verify your email address by clicking the button below. This is an important security step to activate your account.',
      sv: 'Vänligen verifiera din e-postadress genom att klicka på knappen nedan. Detta är ett viktigt säkerhetssteg för att aktivera ditt konto.',
    },
    verifyButton: {
      fi: 'Vahvista sähköposti',
      en: 'Verify Email',
      sv: 'Verifiera e-post',
    },
    alternativeLink: {
      fi: 'Jos painike ei toimi, kopioi tämä linkki selaimeen:',
      en: 'If the button does not work, copy this link to your browser:',
      sv: 'Om knappen inte fungerar, kopiera den här länken till din webbläsare:',
    },
    expiration: {
      fi: 'Tämä linkki vanhenee {expiresIn} kuluttua.',
      en: 'This link expires in {expiresIn}.',
      sv: 'Den här länken går ut om {expiresIn}.',
    },
    security: {
      fi: 'Turvallisuussyistä älä jaa tätä linkkiä kenenkään kanssa. Jos et pyytänyt tätä viestiä, voit jättää sen huomiotta.',
      en: 'For security reasons, do not share this link with anyone. If you did not request this email, you can safely ignore it.',
      sv: 'Av säkerhetsskäl, dela inte den här länken med någon. Om du inte begärde denna e-post kan du tryggt ignorera den.',
    },
    supportPrompt: {
      fi: 'Jos sinulla on ongelmia tilin aktivointiin liittyen, ota yhteyttä tukitiimiimme.',
      en: 'If you have any issues activating your account, please contact our support team.',
      sv: 'Om du har problem med att aktivera ditt konto, kontakta vårt supportteam.',
    },
    supportButton: {
      fi: 'Ota yhteyttä tukeen',
      en: 'Contact Support',
      sv: 'Kontakta support',
    },
  },
  passwordReset: {
    subject: {
      fi: 'Salasanan nollaus - CalcBuilder Pro',
      en: 'Password Reset - CalcBuilder Pro',
      sv: 'Lösenordsåterställning - CalcBuilder Pro',
    },
    preview: {
      fi: 'Nollaa CalcBuilder Pro -tilisi salasana',
      en: 'Reset your CalcBuilder Pro account password',
      sv: 'Återställ ditt CalcBuilder Pro-kontolösenord',
    },
    intro: {
      fi: 'Hei {userName}!',
      en: 'Hi {userName}!',
      sv: 'Hej {userName}!',
    },
    body1: {
      fi: 'Olet pyytänyt salasanasi nollaamista CalcBuilder Pro -tilillesi.',
      en: 'You have requested to reset your password for your CalcBuilder Pro account.',
      sv: 'Du har begärt att återställa ditt lösenord för ditt CalcBuilder Pro-konto.',
    },
    body2: {
      fi: 'Klikkaa alla olevaa painiketta nollataksesi salasanasi. Jos et pyytänyt tätä toimintoa, voit jättää tämän viestin huomiotta.',
      en: 'Click the button below to reset your password. If you did not request this action, you can safely ignore this email.',
      sv: 'Klicka på knappen nedan för att återställa ditt lösenord. Om du inte begärde denna åtgärd kan du tryggt ignorera denna e-post.',
    },
    resetButton: {
      fi: 'Nollaa salasana',
      en: 'Reset Password',
      sv: 'Återställ lösenord',
    },
    alternativeLink: {
      fi: 'Jos painike ei toimi, kopioi tämä linkki selaimeen:',
      en: 'If the button does not work, copy this link to your browser:',
      sv: 'Om knappen inte fungerar, kopiera den här länken till din webbläsare:',
    },
    expiration: {
      fi: 'Tämä linkki vanhenee {expiresIn} kuluttua.',
      en: 'This link expires in {expiresIn}.',
      sv: 'Den här länken går ut om {expiresIn}.',
    },
    security: {
      fi: 'Turvallisuussyistä älä jaa tätä linkkiä kenenkään kanssa. Jos et pyytänyt salasanan nollaamista, voit jättää tämän viestin huomiotta.',
      en: 'For security reasons, do not share this link with anyone. If you did not request a password reset, you can safely ignore this email.',
      sv: 'Av säkerhetsskäl, dela inte den här länken med någon. Om du inte begärde en lösenordsåterställning kan du tryggt ignorera denna e-post.',
    },
    supportPrompt: {
      fi: 'Jos sinulla on ongelmia salasanan nollaamiseen liittyen, ota yhteyttä tukitiimiimme.',
      en: 'If you have any issues resetting your password, please contact our support team.',
      sv: 'Om du har problem med att återställa ditt lösenord, kontakta vårt supportteam.',
    },
    supportButton: {
      fi: 'Ota yhteyttä tukeen',
      en: 'Contact Support',
      sv: 'Kontakta support',
    },
  },
  footer: {
    address: {
      fi: 'CalcBuilder Pro, Helsinki, Suomi',
      en: 'CalcBuilder Pro, Helsinki, Finland',
      sv: 'CalcBuilder Pro, Helsingfors, Finland',
    },
    contact: {
      fi: 'Tarvitsetko apua? Ota yhteyttä:',
      en: 'Need help? Contact us:',
      sv: 'Behöver du hjälp? Kontakta oss:',
    },
  },
  greeting: {
    fi: 'Hei',
    en: 'Hello',
    sv: 'Hej',
  },
  buttons: {
    verify: {
      fi: 'Vahvista sähköposti',
      en: 'Verify Email',
      sv: 'Verifiera e-post',
    },
    reset: {
      fi: 'Nollaa salasana',
      en: 'Reset Password',
      sv: 'Återställ lösenord',
    },
    login: {
      fi: 'Kirjaudu sisään',
      en: 'Log In',
      sv: 'Logga in',
    },
    setup: {
      fi: 'Ota käyttöön',
      en: 'Set Up',
      sv: 'Konfigurera',
    },
    support: {
      fi: 'Ota yhteyttä tukeen',
      en: 'Contact Support',
      sv: 'Kontakta support',
    },
  },
  security: {
    linkExpiration: {
      fi: 'Tämä linkki vanhenee',
      en: 'This link expires in',
      sv: 'Den här länken går ut om',
    },
    doNotShare: {
      fi: 'Älä jaa tätä linkkiä kenenkään kanssa turvallisuussyistä.',
      en: 'Do not share this link with anyone for security reasons.',
      sv: 'Dela inte den här länken med någon av säkerhetsskäl.',
    },
  },
};

// Format expiration time
export function formatExpirationTime(expirationTime: string, language: Language = 'fi'): string {
  const expirationText = getLocalizedText(EMAIL_CONTENT.security.linkExpiration, language);
  return `${expirationText} ${expirationTime}`;
}

// Generate button styles
export function getButtonStyles(variant: 'primary' | 'secondary' = 'primary') {
  const baseStyles = {
    display: 'inline-block',
    padding: '12px 24px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '16px',
    textAlign: 'center' as const,
    border: 'none',
    cursor: 'pointer',
  };

  if (variant === 'primary') {
    return {
      ...baseStyles,
      backgroundColor: '#3B82F6',
      color: '#FFFFFF',
    };
  }

  return {
    ...baseStyles,
    backgroundColor: '#F3F4F6',
    color: '#374151',
    border: '1px solid #D1D5DB',
  };
}

// Generate container styles for email layout
export function getContainerStyles(type: 'body' | 'container' = 'container') {
  if (type === 'body') {
    return {
      margin: '0',
      padding: '0',
      backgroundColor: '#F6F9FC',
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    };
  }

  return {
    maxWidth: '600px',
    margin: '0 auto',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    backgroundColor: '#FFFFFF',
  };
}

// Generate header styles
export function getHeaderStyles() {
  return {
    backgroundColor: '#3B82F6',
    padding: '24px',
    textAlign: 'center' as const,
  };
}

// Generate footer styles
export function getFooterStyles() {
  return {
    backgroundColor: '#F9FAFB',
    padding: '24px',
    textAlign: 'center' as const,
    fontSize: '14px',
    color: '#6B7280',
  };
}

// Validate email address format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Generate safe URLs (basic validation)
export function isSafeUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'https:' || urlObj.protocol === 'http:';
  } catch {
    return false;
  }
}
