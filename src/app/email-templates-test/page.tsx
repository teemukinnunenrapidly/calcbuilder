'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';

type Language = 'fi' | 'en' | 'sv';

interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

const TEMPLATES: TemplateConfig[] = [
  {
    id: 'welcome',
    name: 'Welcome Email',
    description: 'Sent to new users after registration',
    icon: '👋',
    color: 'bg-blue-500',
  },
  {
    id: 'verification',
    name: 'Email Verification',
    description: 'Sent to verify email address',
    icon: '✅',
    color: 'bg-green-500',
  },
  {
    id: 'password-reset',
    name: 'Password Reset',
    description: 'Sent when user requests password reset',
    icon: '🔐',
    color: 'bg-orange-500',
  },
];

export default function EmailTemplatesTestPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('welcome');
  const [language, setLanguage] = useState<Language>('fi');
  const [userName, setUserName] = useState('Teemu Kinnunen');
  const [userEmail, setUserEmail] = useState('teemu@calcbuilder.com');
  const [loginUrl, setLoginUrl] = useState('https://calcbuilder.com/login');
  const [verificationUrl, setVerificationUrl] = useState(
    'https://calcbuilder.com/verify-email?token=abc123'
  );
  const [resetUrl, setResetUrl] = useState('https://calcbuilder.com/reset-password?token=xyz789');
  const [expiresIn, setExpiresIn] = useState('24 hours');

  const renderTemplatePreview = () => {
    const baseProps = {
      userName,
      userEmail,
      language,
      companyName: 'CalcBuilder Pro',
      supportEmail: 'support@calcbuilder.com',
    };

    switch (selectedTemplate) {
      case 'welcome':
        return (
          <div className='max-w-[600px] mx-auto bg-white rounded-lg shadow-lg overflow-hidden'>
            {/* Header */}
            <div className='bg-blue-500 p-6 text-center'>
              <div className='w-32 h-12 bg-white rounded mx-auto flex items-center justify-center'>
                <span className='text-blue-500 font-bold text-lg'>CalcBuilder</span>
              </div>
            </div>

            {/* Content */}
            <div className='p-10'>
              <h1 className='text-3xl font-bold text-gray-800 text-center mb-6'>
                {language === 'fi' && 'Tervetuloa CalcBuilder Pro:hon!'}
                {language === 'en' && 'Welcome to CalcBuilder Pro!'}
                {language === 'sv' && 'Välkommen till CalcBuilder Pro!'}
              </h1>

              <p className='text-base text-gray-700 mb-4'>
                {language === 'fi' &&
                  `Hei ${userName}! Olemme iloisia, että liityit CalcBuilder Pro:hon.`}
                {language === 'en' &&
                  `Hi ${userName}! We're excited to have you join CalcBuilder Pro.`}
                {language === 'sv' &&
                  `Hej ${userName}! Vi är glada att du gick med i CalcBuilder Pro.`}
              </p>

              <p className='text-base text-gray-700 mb-6'>
                {language === 'fi' &&
                  'CalcBuilder Pro on tehokas no-code alusta ammattilaisten laskureiden luomiseen.'}
                {language === 'en' &&
                  'CalcBuilder Pro is a powerful no-code platform for creating professional calculators.'}
                {language === 'sv' &&
                  'CalcBuilder Pro är en kraftfull no-code-plattform för att skapa professionella kalkylatorer.'}
              </p>

              {/* Features */}
              <div className='mb-8'>
                <h2 className='text-xl font-semibold text-gray-800 mb-4'>
                  {language === 'fi' && 'Mitä voit tehdä:'}
                  {language === 'en' && 'What you can do:'}
                  {language === 'sv' && 'Vad du kan göra:'}
                </h2>
                <ul className='space-y-2 text-gray-700'>
                  <li>
                    🎯 {language === 'fi' && 'Luo laskureita vedä ja pudota -toiminnolla'}
                    {language === 'en' && 'Create calculators with drag & drop'}
                    {language === 'sv' && 'Skapa kalkylatorer med dra och släpp'}
                  </li>
                  <li>
                    🎨 {language === 'fi' && 'Mukauta ulkoasua ja brändäystä'}
                    {language === 'en' && 'Customize appearance and branding'}
                    {language === 'sv' && 'Anpassa utseende och varumärke'}
                  </li>
                  <li>
                    🔗 {language === 'fi' && 'Upota laskureita verkkosivuille'}
                    {language === 'en' && 'Embed calculators on websites'}
                    {language === 'sv' && 'Bädda in kalkylatorer på webbplatser'}
                  </li>
                </ul>
              </div>

              {/* Login Button */}
              <div className='text-center mb-8'>
                <a
                  href={loginUrl}
                  className='inline-block bg-blue-500 text-white px-6 py-3 rounded-md font-semibold text-base hover:bg-blue-600 transition-colors'
                >
                  {language === 'fi' && 'Kirjaudu sisään'}
                  {language === 'en' && 'Log In'}
                  {language === 'sv' && 'Logga in'}
                </a>
              </div>
            </div>

            {/* Footer */}
            <div className='bg-gray-50 p-6 text-center'>
              <p className='text-sm text-gray-600 mb-2'>
                CalcBuilder Pro - Laskurigeneraattori ammattilaisille
              </p>
              <p className='text-sm text-gray-600'>Support: support@calcbuilder.com</p>
            </div>
          </div>
        );

      case 'verification':
        return (
          <div className='max-w-[600px] mx-auto bg-white rounded-lg shadow-lg overflow-hidden'>
            {/* Header */}
            <div className='bg-blue-500 p-6 text-center'>
              <div className='w-32 h-12 bg-white rounded mx-auto flex items-center justify-center'>
                <span className='text-blue-500 font-bold text-lg'>CalcBuilder</span>
              </div>
            </div>

            {/* Content */}
            <div className='p-10'>
              <h1 className='text-3xl font-bold text-gray-800 text-center mb-6'>
                {language === 'fi' && 'Vahvista sähköpostiosoitteesi!'}
                {language === 'en' && 'Verify Your Email Address!'}
                {language === 'sv' && 'Verifiera din e-postadress!'}
              </h1>

              <p className='text-base text-gray-700 mb-4'>
                {language === 'fi' &&
                  `Hei ${userName}! Kiitos, että rekisteröidyit CalcBuilder Pro:hon!`}
                {language === 'en' &&
                  `Hi ${userName}! Thank you for signing up for CalcBuilder Pro!`}
                {language === 'sv' &&
                  `Hej ${userName}! Tack för att du registrerade dig för CalcBuilder Pro!`}
              </p>

              <p className='text-base text-gray-700 mb-6'>
                {language === 'fi' &&
                  'Vahvista sähköpostiosoitteesi klikkaamalla alla olevaa painiketta.'}
                {language === 'en' &&
                  'Please verify your email address by clicking the button below.'}
                {language === 'sv' &&
                  'Vänligen verifiera din e-postadress genom att klicka på knappen nedan.'}
              </p>

              {/* Verify Button */}
              <div className='text-center mb-8'>
                <a
                  href={verificationUrl}
                  className='inline-block bg-blue-500 text-white px-6 py-3 rounded-md font-semibold text-base hover:bg-blue-600 transition-colors'
                >
                  {language === 'fi' && 'Vahvista sähköposti'}
                  {language === 'en' && 'Verify Email'}
                  {language === 'sv' && 'Verifiera e-post'}
                </a>
              </div>

              {/* Expiration Notice */}
              <p className='text-sm text-red-600 text-center mb-4'>
                ⏰ {language === 'fi' && `Tämä linkki vanhenee ${expiresIn} kuluttua.`}
                {language === 'en' && `This link expires in ${expiresIn}.`}
                {language === 'sv' && `Den här länken går ut om ${expiresIn}.`}
              </p>
            </div>

            {/* Footer */}
            <div className='bg-gray-50 p-6 text-center'>
              <p className='text-sm text-gray-600 mb-2'>
                CalcBuilder Pro - Laskurigeneraattori ammattilaisille
              </p>
              <p className='text-sm text-gray-600'>Support: support@calcbuilder.com</p>
            </div>
          </div>
        );

      case 'password-reset':
        return (
          <div className='max-w-[600px] mx-auto bg-white rounded-lg shadow-lg overflow-hidden'>
            {/* Header */}
            <div className='bg-blue-500 p-6 text-center'>
              <div className='w-32 h-12 bg-white rounded mx-auto flex items-center justify-center'>
                <span className='text-blue-500 font-bold text-lg'>CalcBuilder</span>
              </div>
            </div>

            {/* Content */}
            <div className='p-10'>
              <h1 className='text-3xl font-bold text-gray-800 text-center mb-6'>
                {language === 'fi' && 'Salasanan nollaus'}
                {language === 'en' && 'Password Reset'}
                {language === 'sv' && 'Lösenordsåterställning'}
              </h1>

              <p className='text-base text-gray-700 mb-4'>
                {language === 'fi' &&
                  `Hei ${userName}! Olet pyytänyt salasanasi nollaamista CalcBuilder Pro -tilillesi.`}
                {language === 'en' &&
                  `Hi ${userName}! You have requested to reset your password for your CalcBuilder Pro account.`}
                {language === 'sv' &&
                  `Hej ${userName}! Du har begärt att återställa ditt lösenord för ditt CalcBuilder Pro-konto.`}
              </p>

              <p className='text-base text-gray-700 mb-6'>
                {language === 'fi' && 'Klikkaa alla olevaa painiketta nollataksesi salasanasi.'}
                {language === 'en' && 'Click the button below to reset your password.'}
                {language === 'sv' && 'Klicka på knappen nedan för att återställa ditt lösenord.'}
              </p>

              {/* Reset Button */}
              <div className='text-center mb-8'>
                <a
                  href={resetUrl}
                  className='inline-block bg-blue-500 text-white px-6 py-3 rounded-md font-semibold text-base hover:bg-blue-600 transition-colors'
                >
                  {language === 'fi' && 'Nollaa salasana'}
                  {language === 'en' && 'Reset Password'}
                  {language === 'sv' && 'Återställ lösenord'}
                </a>
              </div>

              {/* Expiration Notice */}
              <p className='text-sm text-red-600 text-center mb-4'>
                ⏰ {language === 'fi' && `Tämä linkki vanhenee ${expiresIn} kuluttua.`}
                {language === 'en' && `This link expires in ${expiresIn}.`}
                {language === 'sv' && `Den här länken går ut om ${expiresIn}.`}
              </p>
            </div>

            {/* Footer */}
            <div className='bg-gray-50 p-6 text-center'>
              <p className='text-sm text-gray-600 mb-2'>
                CalcBuilder Pro - Laskurigeneraattori ammattilaisille
              </p>
              <p className='text-sm text-gray-600'>Support: support@calcbuilder.com</p>
            </div>
          </div>
        );

      default:
        return <div>Select a template to preview</div>;
    }
  };

  return (
    <div className='min-h-screen bg-gray-100 py-8'>
      <div className='max-w-7xl mx-auto px-4'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-bold text-gray-900 mb-4'>📧 Email Templates Test Center</h1>
          <p className='text-lg text-gray-600'>
            Preview and test all CalcBuilder Pro email templates with different languages and
            parameters
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Template Selection */}
          <div className='lg:col-span-1'>
            <Card>
              <CardHeader>
                <CardTitle>🎯 Select Template</CardTitle>
                <CardDescription>Choose which email template to preview</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                {TEMPLATES.map(template => (
                  <div
                    key={template.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedTemplate === template.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <div className='flex items-center space-x-3'>
                      <div
                        className={`w-10 h-10 rounded-full ${template.color} flex items-center justify-center text-white text-lg`}
                      >
                        {template.icon}
                      </div>
                      <div>
                        <h3 className='font-semibold text-gray-900'>{template.name}</h3>
                        <p className='text-sm text-gray-600'>{template.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Language Selection */}
            <Card className='mt-6'>
              <CardHeader>
                <CardTitle>🌍 Language</CardTitle>
                <CardDescription>Choose the display language</CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={language} onValueChange={(value: Language) => setLanguage(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='fi'>🇫🇮 Finnish</SelectItem>
                    <SelectItem value='en'>🇬🇧 English</SelectItem>
                    <SelectItem value='sv'>🇸🇪 Swedish</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Parameters */}
            <Card className='mt-6'>
              <CardHeader>
                <CardTitle>⚙️ Parameters</CardTitle>
                <CardDescription>Customize template content</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <Label htmlFor='userName'>User Name</Label>
                  <Input
                    id='userName'
                    value={userName}
                    onChange={e => setUserName(e.target.value)}
                    placeholder='Enter user name'
                  />
                </div>

                <div>
                  <Label htmlFor='userEmail'>User Email</Label>
                  <Input
                    id='userEmail'
                    value={userEmail}
                    onChange={e => setUserEmail(e.target.value)}
                    placeholder='Enter user email'
                  />
                </div>

                {selectedTemplate === 'welcome' && (
                  <div>
                    <Label htmlFor='loginUrl'>Login URL</Label>
                    <Input
                      id='loginUrl'
                      value={loginUrl}
                      onChange={e => setLoginUrl(e.target.value)}
                      placeholder='Enter login URL'
                    />
                  </div>
                )}

                {selectedTemplate === 'verification' && (
                  <div>
                    <Label htmlFor='verificationUrl'>Verification URL</Label>
                    <Input
                      id='verificationUrl'
                      value={verificationUrl}
                      onChange={e => setVerificationUrl(e.target.value)}
                      placeholder='Enter verification URL'
                    />
                  </div>
                )}

                {selectedTemplate === 'password-reset' && (
                  <div>
                    <Label htmlFor='resetUrl'>Reset URL</Label>
                    <Input
                      id='resetUrl'
                      value={resetUrl}
                      onChange={e => setResetUrl(e.target.value)}
                      placeholder='Enter reset URL'
                    />
                  </div>
                )}

                {(selectedTemplate === 'verification' || selectedTemplate === 'password-reset') && (
                  <div>
                    <Label htmlFor='expiresIn'>Expiration Time</Label>
                    <Input
                      id='expiresIn'
                      value={expiresIn}
                      onChange={e => setExpiresIn(e.target.value)}
                      placeholder='e.g., 24 hours, 1 hour'
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Template Preview */}
          <div className='lg:col-span-2'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center space-x-2'>
                  <span>📱 Template Preview</span>
                  <Badge variant='secondary'>
                    {TEMPLATES.find(t => t.id === selectedTemplate)?.name}
                  </Badge>
                  <Badge variant='outline'>
                    {language === 'fi'
                      ? '🇫🇮 Finnish'
                      : language === 'en'
                        ? '🇬🇧 English'
                        : '🇸🇪 Swedish'}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Live preview of how the email will look in email clients
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='bg-gray-50 p-6 rounded-lg'>{renderTemplatePreview()}</div>
              </CardContent>
            </Card>

            {/* Template Info */}
            <Card className='mt-6'>
              <CardHeader>
                <CardTitle>ℹ️ Template Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <h4 className='font-semibold mb-2'>Features</h4>
                    <ul className='text-sm text-gray-600 space-y-1'>
                      <li>✅ Multi-language support (FI/EN/SV)</li>
                      <li>✅ CalcBuilder Pro branding</li>
                      <li>✅ Email-safe styling</li>
                      <li>✅ Responsive design</li>
                      <li>✅ Professional typography</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className='font-semibold mb-2'>Status</h4>
                    <ul className='text-sm text-gray-600 space-y-1'>
                      <li>🎯 Welcome Email: Ready</li>
                      <li>✅ Email Verification: Ready</li>
                      <li>🔐 Password Reset: Ready</li>
                      <li>📧 All templates: Production ready</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
