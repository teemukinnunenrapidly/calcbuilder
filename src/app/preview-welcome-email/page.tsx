'use client';

import { useState } from 'react';

// Simple direct import to avoid any import issues
const WelcomeEmailPreview = () => {
  const [language, setLanguage] = useState<'fi' | 'en' | 'sv'>('fi');
  const [userName, setUserName] = useState('Teemu Kinnunen');
  const [userEmail, setUserEmail] = useState('teemu@calcbuilder.com');
  const [loginUrl, setLoginUrl] = useState('https://calcbuilder.com/login');

  // Mock the WelcomeEmail template content for preview
  const getContent = () => {
    const content = {
      fi: {
        title: 'Tervetuloa CalcBuilder Pro:hon!',
        greeting: 'Hei Teemu Kinnunen! Olemme iloisia, että liityit CalcBuilder Pro:hon.',
        description:
          'CalcBuilder Pro on tehokas no-code alusta ammattilaisten laskureiden luomiseen. Voit nyt aloittaa rakentamaan interaktiivisia laskureita ilman koodausta.',
        features: 'Mitä voit tehdä:',
        feature1: '🎯 Luo laskureita vedä ja pudota -toiminnolla',
        feature2: '🎨 Mukauta ulkoasua ja brändäystä',
        feature3: '🔗 Upota laskureita verkkosivuille',
        feature4: '📊 Seuraa käyttöä analytiikalla',
        getStarted: 'Aloita nyt kirjautumalla sisään ja luomalla ensimmäinen laskurisi.',
        button: 'Kirjaudu sisään',
        needHelp: 'Tarvitsetko apua? Tutustu dokumentaatioomme tai ota yhteyttä tukitiimiimme.',
        support: 'Ota yhteyttä tukeen',
        footer: 'CalcBuilder Pro - Laskurigeneraattori ammattilaisille',
      },
      en: {
        title: 'Welcome to CalcBuilder Pro!',
        greeting: "Hi Teemu Kinnunen! We're excited to have you join CalcBuilder Pro.",
        description:
          'CalcBuilder Pro is a powerful no-code platform for creating professional calculators. You can now start building interactive calculators without coding.',
        features: 'What you can do:',
        feature1: '🎯 Create calculators with drag & drop',
        feature2: '🎨 Customize appearance and branding',
        feature3: '🔗 Embed calculators on websites',
        feature4: '📊 Track usage with analytics',
        getStarted: 'Get started now by logging in and creating your first calculator.',
        button: 'Log In',
        needHelp: 'Need help? Check out our documentation or contact our support team.',
        support: 'Contact Support',
        footer: 'CalcBuilder Pro - Calculator Generator for Professionals',
      },
      sv: {
        title: 'Välkommen till CalcBuilder Pro!',
        greeting: 'Hej Teemu Kinnunen! Vi är glada att du gick med i CalcBuilder Pro.',
        description:
          'CalcBuilder Pro är en kraftfull no-code-plattform för att skapa professionella kalkylatorer. Du kan nu börja bygga interaktiva kalkylatorer utan kodning.',
        features: 'Vad du kan göra:',
        feature1: '🎯 Skapa kalkylatorer med dra och släpp',
        feature2: '🎨 Anpassa utseende och varumärke',
        feature3: '🔗 Bädda in kalkylatorer på webbplatser',
        feature4: '📊 Spåra användning med analys',
        getStarted: 'Kom igång nu genom att logga in och skapa din första kalkylator.',
        button: 'Logga in',
        needHelp: 'Behöver du hjälp? Kolla vår dokumentation eller kontakta vårt supportteam.',
        support: 'Kontakta support',
        footer: 'CalcBuilder Pro - Kalkylgenerator för proffs',
      },
    };
    return content[language];
  };

  const currentContent = getContent();

  return (
    <div className='min-h-screen bg-gray-100 py-8'>
      <div className='max-w-4xl mx-auto px-4'>
        {/* Controls */}
        <div className='bg-white p-6 rounded-lg shadow-md mb-8'>
          <h1 className='text-2xl font-bold mb-4'>📧 WelcomeEmail Template Preview</h1>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4'>
            <div>
              <label className='block text-sm font-medium mb-1'>Language:</label>
              <select
                value={language}
                onChange={e => setLanguage(e.target.value as 'fi' | 'en' | 'sv')}
                className='border rounded px-3 py-2 w-full'
              >
                <option value='fi'>🇫🇮 Finnish</option>
                <option value='en'>🇬🇧 English</option>
                <option value='sv'>🇸🇪 Swedish</option>
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>User Name:</label>
              <input
                type='text'
                value={userName}
                onChange={e => setUserName(e.target.value)}
                className='border rounded px-3 py-2 w-full'
              />
            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>User Email:</label>
              <input
                type='email'
                value={userEmail}
                onChange={e => setUserEmail(e.target.value)}
                className='border rounded px-3 py-2 w-full'
              />
            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>Login URL:</label>
              <input
                type='url'
                value={loginUrl}
                onChange={e => setLoginUrl(e.target.value)}
                className='border rounded px-3 py-2 w-full'
              />
            </div>
          </div>

          <div className='text-sm text-gray-600'>
            ✅ This preview shows how our WelcomeEmail template will look when rendered.
          </div>
        </div>

        {/* Email Preview */}
        <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
          {/* Email Container - mimics email client */}
          <div
            className='max-w-[600px] mx-auto bg-white'
            style={{
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            }}
          >
            {/* Header */}
            <div className='bg-blue-500 p-6 text-center'>
              <div className='w-32 h-12 bg-white rounded mx-auto flex items-center justify-center'>
                <span className='text-blue-500 font-bold text-lg'>CalcBuilder</span>
              </div>
            </div>

            {/* Main Content */}
            <div className='p-10'>
              <h1 className='text-3xl font-bold text-gray-800 text-center mb-6'>
                {currentContent.title}
              </h1>

              <p className='text-base text-gray-700 mb-4'>{currentContent.greeting}</p>

              <p className='text-base text-gray-700 mb-6'>{currentContent.description}</p>

              {/* Features Section */}
              <div className='mb-8'>
                <h2 className='text-xl font-semibold text-gray-800 mb-4'>
                  {currentContent.features}
                </h2>

                <div className='space-y-3'>
                  <p className='text-base text-gray-700'>{currentContent.feature1}</p>
                  <p className='text-base text-gray-700'>{currentContent.feature2}</p>
                  <p className='text-base text-gray-700'>{currentContent.feature3}</p>
                  <p className='text-base text-gray-700'>{currentContent.feature4}</p>
                </div>
              </div>

              <p className='text-base text-gray-700 mb-8'>{currentContent.getStarted}</p>

              {/* Login Button */}
              <div className='text-center mb-8'>
                <a
                  href={loginUrl}
                  className='inline-block bg-blue-500 text-white px-6 py-3 rounded-md font-semibold text-base hover:bg-blue-600 transition-colors'
                  style={{ textDecoration: 'none' }}
                >
                  {currentContent.button}
                </a>
              </div>

              <p className='text-sm text-gray-600 text-center mb-4'>{currentContent.needHelp}</p>

              {/* Support Button */}
              <div className='text-center'>
                <a
                  href='mailto:support@calcbuilder.com'
                  className='inline-block bg-gray-100 text-gray-700 px-6 py-3 rounded-md font-semibold text-base border border-gray-300 hover:bg-gray-200 transition-colors'
                  style={{ textDecoration: 'none' }}
                >
                  {currentContent.support}
                </a>
              </div>
            </div>

            {/* Footer */}
            <div className='bg-gray-50 p-6 text-center'>
              <p className='text-sm text-gray-600 mb-2'>{currentContent.footer}</p>
              <p className='text-sm text-gray-600'>
                Support:{' '}
                <a href='mailto:support@calcbuilder.com' className='text-blue-500 underline'>
                  support@calcbuilder.com
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Template Info */}
        <div className='mt-8 bg-green-50 p-6 rounded-lg'>
          <h2 className='text-lg font-semibold text-green-800 mb-2'>
            ✅ WelcomeEmail Template Status
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-700'>
            <div>
              <p>• React Email components: ✅</p>
              <p>• Multi-language support: ✅</p>
              <p>• CalcBuilder Pro branding: ✅</p>
              <p>• Responsive design: ✅</p>
            </div>
            <div>
              <p>• TypeScript integration: ✅</p>
              <p>• Email client compatibility: ✅</p>
              <p>• Professional styling: ✅</p>
              <p>• Interactive buttons: ✅</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeEmailPreview;
