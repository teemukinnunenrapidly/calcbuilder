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
import * as React from 'react';
import {
  DEFAULT_BRAND,
  EMAIL_CONTENT,
  PasswordResetProps,
  getButtonStyles,
  getContainerStyles,
  getFooterStyles,
  getHeaderStyles,
  getLocalizedText,
} from '../index';

export function PasswordResetEmail({
  userName = 'User',
  resetUrl = 'https://calcbuilder.com/reset-password?token=abc123',
  language = 'en',
  companyName = DEFAULT_BRAND.companyName,
  supportEmail = DEFAULT_BRAND.supportEmail,
  expiresIn = '1 hour',
}: PasswordResetProps) {
  const subject = getLocalizedText(EMAIL_CONTENT.passwordReset.subject, language);
  const preview = getLocalizedText(EMAIL_CONTENT.passwordReset.preview, language);
  const resetButtonText = getLocalizedText(EMAIL_CONTENT.passwordReset.resetButton, language);
  const supportButtonText = getLocalizedText(EMAIL_CONTENT.passwordReset.supportButton, language);

  const PASSWORD_RESET_CONTENT = EMAIL_CONTENT.passwordReset;

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
              {getLocalizedText(PASSWORD_RESET_CONTENT.intro, language).replace(
                '{userName}',
                userName
              )}
            </Heading>

            <Text
              style={{ fontSize: '16px', lineHeight: '28px', color: '#374151', margin: '8px 0' }}
            >
              {getLocalizedText(PASSWORD_RESET_CONTENT.body1, language)}
            </Text>

            <Text
              style={{ fontSize: '16px', lineHeight: '28px', color: '#374151', margin: '8px 0' }}
            >
              {getLocalizedText(PASSWORD_RESET_CONTENT.body2, language)}
            </Text>

            {/* Reset Button */}
            <Section style={{ textAlign: 'center', margin: '32px 0' }}>
              <Button href={resetUrl} style={getButtonStyles('primary')}>
                {resetButtonText}
              </Button>
            </Section>

            {/* Alternative Link */}
            <Text
              style={{
                fontSize: '14px',
                lineHeight: '20px',
                color: '#6b7280',
                textAlign: 'center',
                margin: '16px 0',
              }}
            >
              {getLocalizedText(PASSWORD_RESET_CONTENT.alternativeLink, language)}{' '}
              <Link href={resetUrl} style={{ color: '#3b82f6', textDecoration: 'underline' }}>
                {resetUrl}
              </Link>
            </Text>

            {/* Expiration Notice */}
            <Text
              style={{
                fontSize: '14px',
                lineHeight: '20px',
                color: '#dc2626',
                textAlign: 'center',
                margin: '16px 0',
              }}
            >
              ⏰{' '}
              {getLocalizedText(PASSWORD_RESET_CONTENT.expiration, language).replace(
                '{expiresIn}',
                expiresIn
              )}
            </Text>

            {/* Security Notice */}
            <Text
              style={{
                fontSize: '14px',
                lineHeight: '20px',
                color: '#6b7280',
                margin: '24px 0 8px',
              }}
            >
              {getLocalizedText(PASSWORD_RESET_CONTENT.security, language)}
            </Text>

            {/* Support Section */}
            <Text
              style={{
                fontSize: '16px',
                lineHeight: '28px',
                color: '#374151',
                margin: '24px 0 8px',
              }}
            >
              {getLocalizedText(PASSWORD_RESET_CONTENT.supportPrompt, language)}
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
export default PasswordResetEmail;
