'use client';

import { useState } from 'react';

export function DesignSystemShowcase() {
  const [activeTab, setActiveTab] = useState('colors');

  const tabs = [
    { id: 'colors', label: 'Colors', icon: '🎨' },
    { id: 'typography', label: 'Typography', icon: '🔤' },
    { id: 'spacing', label: 'Spacing', icon: '📏' },
    { id: 'animations', label: 'Animations', icon: '🎭' },
    { id: 'shadows', label: 'Shadows', icon: '🌗' },
  ];

  return (
    <div className='min-h-screen bg-background p-8'>
      <div className='container mx-auto max-w-7xl'>
        {/* Header */}
        <div className='mb-12 text-center'>
          <h1 className='text-display font-bold text-foreground mb-4'>
            CalcBuilder Pro Design System
          </h1>
          <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
            Comprehensive design tokens, components, and guidelines for building consistent and
            beautiful user interfaces.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className='flex flex-wrap justify-center gap-2 mb-12'>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground shadow-glow'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <span className='mr-2'>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Sections */}
        <div className='space-y-12'>
          {/* Colors Section */}
          {activeTab === 'colors' && (
            <div className='space-y-8'>
              <h2 className='text-3xl font-bold text-foreground'>Color Palette</h2>

              {/* Primary Colors */}
              <div>
                <h3 className='text-xl font-semibold text-foreground mb-4'>Primary Colors</h3>
                <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4'>
                  {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map(shade => (
                    <div key={shade} className='text-center'>
                      <div
                        className={`w-16 h-16 rounded-lg mb-2 mx-auto shadow-medium ${
                          shade === 500 ? 'ring-2 ring-primary ring-offset-2' : ''
                        }`}
                        style={{
                          backgroundColor: `var(--calcbuilder-${shade})`,
                        }}
                      />
                      <span className='text-sm font-mono text-muted-foreground'>{shade}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Semantic Colors */}
              <div>
                <h3 className='text-xl font-semibold text-foreground mb-4'>Semantic Colors</h3>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                  <div className='p-6 bg-success/10 rounded-xl border border-success/20'>
                    <div className='w-12 h-12 bg-success rounded-lg mb-3' />
                    <h4 className='font-semibold text-success mb-2'>Success</h4>
                    <p className='text-sm text-success/80'>Success messages and confirmations</p>
                  </div>
                  <div className='p-6 bg-warning/10 rounded-xl border border-warning/20'>
                    <div className='w-12 h-12 bg-warning rounded-lg mb-3' />
                    <h4 className='font-semibold text-warning mb-2'>Warning</h4>
                    <p className='text-sm text-warning/80'>Warning messages and alerts</p>
                  </div>
                  <div className='p-6 bg-error/10 rounded-xl border border-error/20'>
                    <div className='w-12 h-12 bg-error rounded-lg mb-3' />
                    <h4 className='font-semibold text-error mb-2'>Error</h4>
                    <p className='text-sm text-error/80'>Error messages and destructive actions</p>
                  </div>
                  <div className='p-6 bg-primary/10 rounded-xl border border-primary/20'>
                    <div className='w-12 h-12 bg-primary rounded-lg mb-3' />
                    <h4 className='font-semibold text-primary mb-2'>Info</h4>
                    <p className='text-sm text-primary/80'>Information messages and links</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Typography Section */}
          {activeTab === 'typography' && (
            <div className='space-y-8'>
              <h2 className='text-3xl font-bold text-foreground'>Typography</h2>

              {/* Font Sizes */}
              <div>
                <h3 className='text-xl font-semibold text-foreground mb-4'>Font Sizes</h3>
                <div className='space-y-4'>
                  <div className='text-display font-bold text-foreground'>
                    Display Text (4.5rem)
                  </div>
                  <div className='text-6xl font-bold text-foreground'>Heading 6xl (3.75rem)</div>
                  <div className='text-5xl font-bold text-foreground'>Heading 5xl (3rem)</div>
                  <div className='text-4xl font-bold text-foreground'>Heading 4xl (2.25rem)</div>
                  <div className='text-3xl font-bold text-foreground'>Heading 3xl (1.875rem)</div>
                  <div className='text-2xl font-bold text-foreground'>Heading 2xl (1.5rem)</div>
                  <div className='text-xl font-semibold text-foreground'>Heading xl (1.25rem)</div>
                  <div className='text-lg text-foreground'>Body lg (1.125rem)</div>
                  <div className='text-base text-foreground'>Body base (1rem)</div>
                  <div className='text-sm text-foreground'>Body sm (0.875rem)</div>
                  <div className='text-xs text-foreground'>Caption xs (0.75rem)</div>
                </div>
              </div>

              {/* Font Families */}
              <div>
                <h3 className='text-xl font-semibold text-foreground mb-4'>Font Families</h3>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                  <div className='p-6 bg-card rounded-xl border border-border shadow-soft'>
                    <h4 className='font-sans text-lg font-semibold text-foreground mb-2'>
                      Sans Serif
                    </h4>
                    <p className='font-sans text-muted-foreground'>
                      Inter font family for body text and headings
                    </p>
                  </div>
                  <div className='p-6 bg-card rounded-xl border border-border shadow-soft'>
                    <h4 className='font-mono text-lg font-semibold text-foreground mb-2'>
                      Monospace
                    </h4>
                    <p className='font-mono text-muted-foreground'>
                      JetBrains Mono for code and technical content
                    </p>
                  </div>
                  <div className='p-6 bg-card rounded-xl border border-border shadow-soft'>
                    <h4 className='font-display text-lg font-semibold text-foreground mb-2'>
                      Display
                    </h4>
                    <p className='font-display text-muted-foreground'>
                      Special display variant for hero text
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Spacing Section */}
          {activeTab === 'spacing' && (
            <div className='space-y-8'>
              <h2 className='text-3xl font-bold text-foreground'>Spacing Scale</h2>

              {/* Spacing Examples */}
              <div>
                <h3 className='text-xl font-semibold text-foreground mb-4'>Spacing Examples</h3>
                <div className='space-y-4'>
                  <div className='flex items-center space-x-4'>
                    <div className='w-4 h-4 bg-primary rounded' />
                    <span className='text-sm text-muted-foreground'>4px (w-1 h-1)</span>
                  </div>
                  <div className='flex items-center space-x-4'>
                    <div className='w-8 h-8 bg-primary rounded' />
                    <span className='text-sm text-muted-foreground'>8px (w-2 h-2)</span>
                  </div>
                  <div className='flex items-center space-x-4'>
                    <div className='w-12 h-12 bg-primary rounded' />
                    <span className='text-sm text-muted-foreground'>16px (w-3 h-3)</span>
                  </div>
                  <div className='flex items-center space-x-4'>
                    <div className='w-16 h-16 bg-primary rounded' />
                    <span className='text-sm text-muted-foreground'>24px (w-6 h-6)</span>
                  </div>
                  <div className='flex items-center space-x-4'>
                    <div className='w-20 h-20 bg-primary rounded' />
                    <span className='text-sm text-muted-foreground'>32px (w-8 h-8)</span>
                  </div>
                </div>
              </div>

              {/* Container Widths */}
              <div>
                <h3 className='text-xl font-semibold text-foreground mb-4'>Container Max Widths</h3>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                  {['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'].map(size => (
                    <div key={size} className='p-4 bg-muted rounded-lg text-center'>
                      <div className='text-sm font-semibold text-foreground'>
                        {size.toUpperCase()}
                      </div>
                      <div className='text-xs text-muted-foreground'>
                        {size === 'sm' && '640px'}
                        {size === 'md' && '768px'}
                        {size === 'lg' && '1024px'}
                        {size === 'xl' && '1280px'}
                        {size === '2xl' && '1400px'}
                        {size === '3xl' && '1600px'}
                        {size === '4xl' && '1800px'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Animations Section */}
          {activeTab === 'animations' && (
            <div className='space-y-8'>
              <h2 className='text-3xl font-bold text-foreground'>Animations</h2>

              {/* Animation Examples */}
              <div>
                <h3 className='text-xl font-semibold text-foreground mb-4'>Animation Examples</h3>
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                  <div className='p-6 bg-card rounded-xl border border-border shadow-soft text-center'>
                    <div className='w-16 h-16 bg-primary rounded-lg mx-auto mb-3 animate-bounce-in' />
                    <h4 className='font-semibold text-foreground'>Bounce In</h4>
                  </div>
                  <div className='p-6 bg-card rounded-xl border border-border shadow-soft text-center'>
                    <div className='w-16 h-16 bg-secondary rounded-lg mx-auto mb-3 animate-fade-in-up' />
                    <h4 className='font-semibold text-foreground'>Fade In Up</h4>
                  </div>
                  <div className='p-6 bg-card rounded-xl border border-border shadow-soft text-center'>
                    <div className='w-16 h-16 bg-accent rounded-lg mx-auto mb-3 animate-scale-in' />
                    <h4 className='font-semibold text-foreground'>Scale In</h4>
                  </div>
                  <div className='p-6 bg-card rounded-xl border border-border shadow-soft text-center'>
                    <div className='w-16 h-16 bg-success rounded-lg mx-auto mb-3 animate-rotate-in' />
                    <h4 className='font-semibold text-foreground'>Rotate In</h4>
                  </div>
                  <div className='p-6 bg-card rounded-xl border border-border shadow-soft text-center'>
                    <div className='w-16 h-16 bg-warning rounded-lg mx-auto mb-3 animate-flip-in-x' />
                    <h4 className='font-semibold text-foreground'>Flip In X</h4>
                  </div>
                  <div className='p-6 bg-card rounded-xl border border-border shadow-soft text-center'>
                    <div className='w-16 h-16 bg-error rounded-lg mx-auto mb-3 animate-zoom-in' />
                    <h4 className='font-semibold text-foreground'>Zoom In</h4>
                  </div>
                </div>
              </div>

              {/* Transition Durations */}
              <div>
                <h3 className='text-xl font-semibold text-foreground mb-4'>Transition Durations</h3>
                <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                  {[
                    { duration: '150ms', class: 'duration-150', label: 'Fast' },
                    { duration: '300ms', class: 'duration-300', label: 'Normal' },
                    { duration: '500ms', class: 'duration-500', label: 'Slow' },
                    { duration: '700ms', class: 'duration-700', label: 'Slower' },
                  ].map(item => (
                    <div key={item.duration} className='p-4 bg-muted rounded-lg text-center'>
                      <div className='text-sm font-semibold text-foreground'>{item.label}</div>
                      <div className='text-xs text-muted-foreground'>{item.duration}</div>
                      <div
                        className={`w-full h-2 bg-primary rounded mt-2 transition-all ${item.class} hover:bg-primary/60`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Shadows Section */}
          {activeTab === 'shadows' && (
            <div className='space-y-8'>
              <h2 className='text-3xl font-bold text-foreground'>Shadows</h2>

              {/* Shadow Examples */}
              <div>
                <h3 className='text-xl font-semibold text-foreground mb-4'>Shadow Examples</h3>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                  <div className='p-8 bg-card rounded-xl border border-border shadow-soft text-center'>
                    <h4 className='font-semibold text-foreground mb-2'>Soft Shadow</h4>
                    <p className='text-sm text-muted-foreground'>Subtle shadows for cards</p>
                  </div>
                  <div className='p-8 bg-card rounded-xl border border-border shadow-medium text-center'>
                    <h4 className='font-semibold text-foreground mb-2'>Medium Shadow</h4>
                    <p className='text-sm text-muted-foreground'>
                      Standard shadows for elevated elements
                    </p>
                  </div>
                  <div className='p-8 bg-card rounded-xl border border-border shadow-strong text-center'>
                    <h4 className='font-semibold text-foreground mb-2'>Strong Shadow</h4>
                    <p className='text-sm text-muted-foreground'>Prominent shadows for modals</p>
                  </div>
                  <div className='p-8 bg-card rounded-xl border border-border shadow-glow text-center'>
                    <h4 className='font-semibold text-foreground mb-2'>Glow Shadow</h4>
                    <p className='text-sm text-muted-foreground'>
                      Colored shadows for interactive elements
                    </p>
                  </div>
                  <div className='p-8 bg-card rounded-xl border border-border shadow-inner-soft text-center'>
                    <h4 className='font-semibold text-foreground mb-2'>Inner Soft</h4>
                    <p className='text-sm text-muted-foreground'>
                      Inset shadows for pressed states
                    </p>
                  </div>
                  <div className='p-8 bg-card rounded-xl border border-border shadow-inner-medium text-center'>
                    <h4 className='font-semibold text-foreground mb-2'>Inner Medium</h4>
                    <p className='text-sm text-muted-foreground'>Deeper inset shadows</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
