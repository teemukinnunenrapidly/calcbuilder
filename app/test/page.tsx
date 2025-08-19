import { SampleDependencies } from '@/components/sample-dependencies';
import { DesignSystemShowcase } from '@/components/ui/design-system-showcase';
import { ShadcnShowcase } from '@/components/ui/shadcn-showcase';

export default function TestPage() {
  return (
    <div className='min-h-screen bg-background p-8'>
      <div className='container mx-auto space-y-12'>
        <div className='text-center'>
          <h1 className='text-4xl font-bold text-foreground mb-4'>CalcBuilder Pro - Test Page</h1>
          <p className='text-xl text-muted-foreground'>Testing all components and dependencies</p>
        </div>

        {/* Dependencies Test */}
        <section>
          <h2 className='text-2xl font-semibold text-foreground mb-6'>Dependencies Test</h2>
          <SampleDependencies />
        </section>

        {/* Design System Showcase */}
        <section>
          <h2 className='text-2xl font-semibold text-foreground mb-6'>Design System Showcase</h2>
          <DesignSystemShowcase />
        </section>

        {/* shadcn/ui Showcase */}
        <section>
          <h2 className='text-2xl font-semibold text-foreground mb-6'>shadcn/ui Components</h2>
          <ShadcnShowcase />
        </section>
      </div>
    </div>
  );
}
