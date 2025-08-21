import { SampleDependencies } from '../../src/components/sample-dependencies';
import { ShadcnShowcase } from '../../src/components/ui/shadcn-showcase';
import CDNStatusCheck from '../../src/components/analytics/CDNStatusCheck';
import GDPRCompliance from '../../src/components/compliance/GDPRCompliance';
import RegionalPerformance from '../../src/components/compliance/RegionalPerformance';
import DeploymentStatus from '../../src/components/deployment/DeploymentStatus';

// Enable ISR for better performance - revalidate every 30 minutes
export const revalidate = 1800;

export default function TestPage() {
  return (
    <div className='min-h-screen bg-background p-8'>
      <div className='container mx-auto space-y-12'>
        {/* Preview Deployment Banner */}
        <div className='bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg shadow-lg'>
          <div className='flex items-center justify-between'>
            <div>
              <h2 className='text-xl font-semibold'>🚀 Preview Deployment Active</h2>
              <p className='text-blue-100'>Testing preview deployment functionality</p>
            </div>
            <div className='text-right'>
              <p className='text-sm text-blue-100'>Branch: test-preview-deployment</p>
              <p className='text-xs text-blue-200'>Environment: Preview</p>
            </div>
          </div>
        </div>

        <div className='text-center'>
          <h1 className='text-4xl font-bold text-foreground mb-4'>CalcBuilder Pro - Test Page</h1>
          <p className='text-xl text-muted-foreground'>Testing all components and dependencies</p>
        </div>

        {/* Dependencies Test */}
        <section>
          <h2 className='text-2xl font-semibold text-foreground mb-6'>Dependencies Test</h2>
          <SampleDependencies />
        </section>

        {/* shadcn/ui Showcase */}
        <section>
          <h2 className='text-2xl font-semibold text-foreground mb-6'>shadcn/ui Components</h2>
          <ShadcnShowcase />
        </section>

        {/* Infrastructure Status */}
        <section>
          <h2 className='text-2xl font-semibold text-foreground mb-6'>Infrastructure Status</h2>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            <div className='space-y-6'>
              <CDNStatusCheck />
              <GDPRCompliance />
            </div>
            <div className='space-y-6'>
              <RegionalPerformance />
              <DeploymentStatus />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
