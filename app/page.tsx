import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CalcBuilder Pro - Advanced Calculator Builder Platform',
  description: 'Professional calculator builder platform for businesses and developers',
};

export default function HomePage() {
  return (
    <main className='min-h-screen bg-gradient-to-br from-background via-background to-muted/20'>
      {/* Hero Section */}
      <section className='container mx-auto px-4 py-20 text-center'>
        <div className='max-w-4xl mx-auto'>
          <h1 className='text-4xl md:text-6xl font-bold text-foreground mb-6 animate-fade-in'>
            Welcome to{' '}
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-primary/60'>
              CalcBuilder Pro
            </span>
          </h1>

          <p className='text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed animate-fade-in'>
            Professional calculator builder platform for businesses and developers. Create powerful,
            customizable calculators with drag-and-drop ease.
          </p>

          <div className='flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in'>
            <button className='px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors duration-200 shadow-medium'>
              Get Started
            </button>
            <button className='px-8 py-4 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:bg-secondary/80 transition-colors duration-200 border border-border'>
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className='container mx-auto px-4 py-16'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {/* Feature 1 */}
          <div className='p-6 bg-card rounded-xl border border-border shadow-soft hover:shadow-medium transition-shadow duration-200'>
            <div className='w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4'>
              <svg
                className='w-6 h-6 text-primary'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
                />
              </svg>
            </div>
            <h3 className='text-xl font-semibold text-foreground mb-2'>Drag & Drop Builder</h3>
            <p className='text-muted-foreground'>
              Create calculators with our intuitive drag-and-drop interface. No coding required.
            </p>
          </div>

          {/* Feature 2 */}
          <div className='p-6 bg-card rounded-xl border border-border shadow-soft hover:shadow-medium transition-shadow duration-200'>
            <div className='w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4'>
              <svg
                className='w-6 h-6 text-secondary'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M13 10V3L4 14h7v7l9-11h-7z'
                />
              </svg>
            </div>
            <h3 className='text-xl font-semibold text-foreground mb-2'>Advanced Formulas</h3>
            <p className='text-muted-foreground'>
              Powerful formula editor with shortcode system for complex calculations.
            </p>
          </div>

          {/* Feature 3 */}
          <div className='p-6 bg-card rounded-xl border border-border shadow-soft hover:shadow-medium transition-shadow duration-200'>
            <div className='w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4'>
              <svg
                className='w-6 h-6 text-accent'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                />
              </svg>
            </div>
            <h3 className='text-xl font-semibold text-foreground mb-2'>Analytics & Insights</h3>
            <p className='text-muted-foreground'>
              Track calculator performance and generate detailed reports for your business.
            </p>
          </div>
        </div>
      </section>

      {/* Status Section */}
      <section className='container mx-auto px-4 py-16 text-center'>
        <div className='max-w-2xl mx-auto'>
          <h2 className='text-3xl md:text-4xl font-bold text-foreground mb-6'>Project Status</h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='p-4 bg-success/10 rounded-lg border border-success/20'>
              <div className='text-2xl font-bold text-success'>✅</div>
              <div className='text-sm text-success'>Database Setup</div>
            </div>
            <div className='p-4 bg-primary/10 rounded-lg border border-primary/20'>
              <div className='text-2xl font-bold text-primary'>🔄</div>
              <div className='text-sm text-primary'>React Setup</div>
            </div>
            <div className='p-4 bg-muted/10 rounded-lg border border-muted/20'>
              <div className='text-2xl font-bold text-muted-foreground'>⏳</div>
              <div className='text-sm text-muted-foreground'>Docker Setup</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
