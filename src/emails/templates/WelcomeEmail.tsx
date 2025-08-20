import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

import {
  DEFAULT_BRAND,
  EMAIL_CONTENT,
  WelcomeEmailProps,
  getButtonStyles,
  getContainerStyles,
  getFooterStyles,
  getHeaderStyles,
  getLocalizedText,
} from '../index';

// Welcome email content translations
const WELCOME_CONTENT = {
  subject: {
    fi: 'Tervetuloa CalcBuilder Pro:hon!',
    en: 'Welcome to CalcBuilder Pro!',
    sv: 'Välkommen till CalcBuilder Pro!',
  },
  preview: {
    fi: 'Aloita rakentamaan ammattitasoisia laskureita',
    en: 'Start building professional calculators',
    sv: 'Börja bygga professionella kalkylatorer',
  },
  heading: {
    fi: 'Tervetuloa CalcBuilder Pro:hon!',
    en: 'Welcome to CalcBuilder Pro!',
    sv: 'Välkommen till CalcBuilder Pro!',
  },
  intro: {
    fi: 'Hei {userName}! Olemme iloisia, että liityit CalcBuilder Pro:hon.',
    en: "Hi {userName}! We're excited to have you join CalcBuilder Pro.",
    sv: 'Hej {userName}! Vi är glada att du gick med i CalcBuilder Pro.',
  },
  description: {
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
  getStarted: {
    fi: 'Aloita nyt kirjautumalla sisään ja luomalla ensimmäinen laskurisi.',
    en: 'Get started now by logging in and creating your first calculator.',
    sv: 'Kom igång nu genom att logga in och skapa din första kalkylator.',
  },
  needHelp: {
    fi: 'Tarvitsetko apua? Tutustu dokumentaatioomme tai ota yhteyttä tukitiimiimme.',
    en: 'Need help? Check out our documentation or contact our support team.',
    sv: 'Behöver du hjälp? Kolla vår dokumentation eller kontakta vårt supportteam.',
  },
};

export function WelcomeEmail({
  userName,
  userEmail,
  loginUrl,
  language = 'fi',
  companyName = DEFAULT_BRAND.companyName,
  supportEmail = DEFAULT_BRAND.supportEmail,
}: WelcomeEmailProps) {
  const WELCOME_CONTENT = EMAIL_CONTENT.welcome;
  const subject = getLocalizedText(WELCOME_CONTENT.subject, language);
  const preview = getLocalizedText(WELCOME_CONTENT.preview, language);
  const loginButtonText = getLocalizedText(EMAIL_CONTENT.buttons.login, language);
  const supportButtonText = getLocalizedText(EMAIL_CONTENT.buttons.support, language);

  return (
    <Html>
      <Head>
        <title>{subject}</title>
      </Head>
      <Preview>{preview}</Preview>
      <Body style={getContainerStyles('body')}>
        <Container style={getContainerStyles('container')}>
          {/* Header */}
          <Section style={getHeaderStyles()}>
            <Img
              src={DEFAULT_BRAND.logoUrl}
              width='150'
              height='50'
              alt={companyName}
              style={{ margin: '0 auto' }}
            />
          </Section>

          {/* Main Content */}
          <Section style={{ padding: '24px 0' }}>
            <Heading style={{ fontSize: '24px', lineHeight: '32px', color: '#1f2937' }}>
              {getLocalizedText(WELCOME_CONTENT.intro, language).replace('{userName}', userName)}
            </Heading>

            <Text
              style={{ fontSize: '16px', lineHeight: '28px', color: '#374151', margin: '8px 0' }}
            >
              {getLocalizedText(WELCOME_CONTENT.body1, language)}
            </Text>

            <Text
              style={{ fontSize: '16px', lineHeight: '28px', color: '#374151', margin: '8px 0' }}
            >
              {getLocalizedText(WELCOME_CONTENT.body2, language)}
            </Text>

            {/* Features Section */}
            <div style={{ margin: '32px 0' }}>
              <Heading
                style={{
                  fontSize: '20px',
                  lineHeight: '28px',
                  color: '#1f2937',
                  margin: '0 0 16px 0',
                }}
              >
                {getLocalizedText(WELCOME_CONTENT.features.title, language)}
              </Heading>

              <Text
                style={{ fontSize: '16px', lineHeight: '28px', color: '#374151', margin: '8px 0' }}
              >
                {getLocalizedText(WELCOME_CONTENT.features.dragDrop, language)}
              </Text>
              <Text
                style={{ fontSize: '16px', lineHeight: '28px', color: '#374151', margin: '8px 0' }}
              >
                {getLocalizedText(WELCOME_CONTENT.features.customize, language)}
              </Text>
              <Text
                style={{ fontSize: '16px', lineHeight: '28px', color: '#374151', margin: '8px 0' }}
              >
                {getLocalizedText(WELCOME_CONTENT.features.embed, language)}
              </Text>
              <Text
                style={{ fontSize: '16px', lineHeight: '28px', color: '#374151', margin: '8px 0' }}
              >
                {getLocalizedText(WELCOME_CONTENT.features.analytics, language)}
              </Text>
            </div>

            {/* Call to Action */}
            <Text
              style={{
                fontSize: '16px',
                lineHeight: '28px',
                color: '#374151',
                margin: '24px 0 8px',
              }}
            >
              {getLocalizedText(WELCOME_CONTENT.callToAction, language)}
            </Text>

            {/* Login Button */}
            <Section style={{ textAlign: 'center', margin: '32px 0' }}>
              <Button href={loginUrl} style={getButtonStyles('primary')}>
                {loginButtonText}
              </Button>
            </Section>

            <Text
              style={{ fontSize: '16px', lineHeight: '28px', color: '#374151', margin: '8px 0' }}
            >
              {getLocalizedText(WELCOME_CONTENT.supportPrompt, language)}
            </Text>

            {/* Support Button */}
            <Section style={{ textAlign: 'center', margin: '16px 0' }}>
              <Button href={`mailto:${supportEmail}`} style={getButtonStyles('secondary')}>
                {supportButtonText}
              </Button>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={getFooterStyles()}>
            <Text
              style={{
                fontSize: '12px',
                lineHeight: '20px',
                color: '#6b7280',
                textAlign: 'center',
              }}
            >
              © {new Date().getFullYear()} {companyName}. All rights reserved.
            </Text>
            <Text
              style={{
                fontSize: '12px',
                lineHeight: '20px',
                color: '#6b7280',
                textAlign: 'center',
              }}
            >
              {getLocalizedText(EMAIL_CONTENT.footer.address, language)}
            </Text>
            <Text
              style={{
                fontSize: '12px',
                lineHeight: '20px',
                color: '#6b7280',
                textAlign: 'center',
              }}
            >
              {getLocalizedText(EMAIL_CONTENT.footer.contact, language)}{' '}
              <Link
                href={`mailto:${supportEmail}`}
                style={{ color: '#3b82f6', textDecoration: 'underline' }}
              >
                {supportEmail}
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Default export
export default WelcomeEmail;
