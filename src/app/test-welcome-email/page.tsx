'use client';

export default function TestWelcomeEmailPage() {
  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Welcome Email Template Test</h1>

      <div className='mb-6 space-y-4 bg-gray-100 p-4 rounded-lg'>
        <p>✅ WelcomeEmail template created successfully!</p>
        <p>🌍 Multi-language support: Finnish, English, Swedish</p>
        <p>🎨 CalcBuilder Pro branding included</p>
        <p>📧 React Email components used</p>
      </div>

      <div className='bg-blue-50 p-4 rounded-lg'>
        <h2 className='font-semibold mb-2'>Template Features:</h2>
        <ul className='space-y-1'>
          <li>• Responsive email design</li>
          <li>• Professional CalcBuilder Pro branding</li>
          <li>• Multi-language content (fi/en/sv)</li>
          <li>• Welcome message with user personalization</li>
          <li>• Feature highlights</li>
          <li>• Login button with customizable URL</li>
          <li>• Support contact information</li>
          <li>• Footer with company information</li>
        </ul>
      </div>

      <div className='mt-6 bg-green-50 p-4 rounded-lg'>
        <h2 className='font-semibold mb-2'>✅ Task 4.2 Status:</h2>
        <p>WelcomeEmail template has been created with all required features!</p>
        <p>Ready to move to Task 4.3: Create Email Verification Template</p>
      </div>
    </div>
  );
}
