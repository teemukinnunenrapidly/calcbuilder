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
  EmailVerificationProps,
  getButtonStyles,
  getContainerStyles,
  getFooterStyles,
  getHeaderStyles,
  getLocalizedText,
} from '../index';

export function EmailVerificationEmail({
  userName = 'User',
  userEmail = 'user@example.com',
  verificationUrl = 'https://calcbuilder.com/verify-email?token=abc123',
  language = 'en',
  companyName = DEFAULT_BRAND.companyName,
  supportEmail = DEFAULT_BRAND.supportEmail,
  expiresIn = '24 hours',
}: EmailVerificationProps) {
  const subject = getLocalizedText(EMAIL_CONTENT.verification.subject, language);
  const preview = getLocalizedText(EMAIL_CONTENT.verification.preview, language);
  const verifyButtonText = getLocalizedText(EMAIL_CONTENT.verification.verifyButton, language);
  const supportButtonText = getLocalizedText(EMAIL_CONTENT.verification.supportButton, language);

  const VERIFICATION_CONTENT = EMAIL_CONTENT.verification;

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
              {getLocalizedText(VERIFICATION_CONTENT.intro, language).replace(
                '{userName}',
                userName
              )}
            </Heading>

            <Text
              style={{ fontSize: '16px', lineHeight: '28px', color: '#374151', margin: '8px 0' }}
            >
              {getLocalizedText(VERIFICATION_CONTENT.body1, language)}
            </Text>

            <Text
              style={{ fontSize: '16px', lineHeight: '28px', color: '#374151', margin: '8px 0' }}
            >
              {getLocalizedText(VERIFICATION_CONTENT.body2, language)}
            </Text>

            {/* Verification Button */}
            <Section style={{ textAlign: 'center', margin: '32px 0' }}>
              <Button href={verificationUrl} style={getButtonStyles('primary')}>
                {verifyButtonText}
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
              {getLocalizedText(VERIFICATION_CONTENT.alternativeLink, language)}{' '}
              <Link
                href={verificationUrl}
                style={{ color: '#3b82f6', textDecoration: 'underline' }}
              >
                {verificationUrl}
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
              {getLocalizedText(VERIFICATION_CONTENT.expiration, language).replace(
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
              {getLocalizedText(VERIFICATION_CONTENT.security, language)}
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
              {getLocalizedText(VERIFICATION_CONTENT.supportPrompt, language)}
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
export default EmailVerificationEmail;
