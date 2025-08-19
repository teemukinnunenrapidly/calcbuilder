'use client';

import { useState } from 'react';
import { Button } from './button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';
import { Input } from './input';
import { Label } from './label';
import { Badge } from './badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Textarea } from './textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu';

export function ShadcnShowcase() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');

  return (
    <div className='min-h-screen bg-background p-8'>
      <div className='container mx-auto max-w-7xl'>
        {/* Header */}
        <div className='mb-12 text-center'>
          <h1 className='text-display font-bold text-foreground mb-4'>
            shadcn/ui Components Showcase
          </h1>
          <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
            Professional UI components built with Radix UI and Tailwind CSS, customized for
            CalcBuilder Pro.
          </p>
        </div>

        {/* Components Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {/* Button Variants */}
          <Card className='shadow-soft'>
            <CardHeader>
              <CardTitle>Button Variants</CardTitle>
              <CardDescription>Different button styles and states</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex flex-wrap gap-2'>
                <Button variant='default'>Default</Button>
                <Button variant='secondary'>Secondary</Button>
                <Button variant='destructive'>Destructive</Button>
                <Button variant='outline'>Outline</Button>
                <Button variant='ghost'>Ghost</Button>
                <Button variant='link'>Link</Button>
              </div>
              <div className='flex flex-wrap gap-2'>
                <Button size='sm'>Small</Button>
                <Button size='default'>Default</Button>
                <Button size='lg'>Large</Button>
              </div>
              <div className='flex flex-wrap gap-2'>
                <Button disabled>Disabled</Button>
                <Button className='shadow-glow'>Glow Effect</Button>
              </div>
            </CardContent>
          </Card>

          {/* Form Elements */}
          <Card className='shadow-soft'>
            <CardHeader>
              <CardTitle>Form Elements</CardTitle>
              <CardDescription>Input fields and form controls</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='email'>Email</Label>
                <Input id='email' type='email' placeholder='Enter your email' />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='message'>Message</Label>
                <Textarea id='message' placeholder='Enter your message' />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='category'>Category</Label>
                <Select value={selectedValue} onValueChange={setSelectedValue}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a category' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='feature'>Feature Request</SelectItem>
                    <SelectItem value='bug'>Bug Report</SelectItem>
                    <SelectItem value='question'>Question</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Cards and Layout */}
          <Card className='shadow-soft'>
            <CardHeader>
              <CardTitle>Card Components</CardTitle>
              <CardDescription>Different card styles and layouts</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <Card className='border-primary/20 bg-primary/5'>
                <CardHeader className='pb-2'>
                  <CardTitle className='text-lg'>Featured Card</CardTitle>
                  <CardDescription>Special styling for important content</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className='text-sm text-muted-foreground'>
                    This card has custom styling with primary color accents.
                  </p>
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          {/* Badges and Status */}
          <Card className='shadow-soft'>
            <CardHeader>
              <CardTitle>Badges & Status</CardTitle>
              <CardDescription>Status indicators and labels</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex flex-wrap gap-2'>
                <Badge variant='default'>Default</Badge>
                <Badge variant='secondary'>Secondary</Badge>
                <Badge variant='destructive'>Destructive</Badge>
                <Badge variant='outline'>Outline</Badge>
              </div>
              <div className='flex flex-wrap gap-2'>
                <Badge className='bg-success text-success-foreground'>Success</Badge>
                <Badge className='bg-warning text-warning-foreground'>Warning</Badge>
                <Badge className='bg-error text-error-foreground'>Error</Badge>
                <Badge className='bg-primary text-primary-foreground'>Info</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Interactive Elements */}
          <Card className='shadow-soft'>
            <CardHeader>
              <CardTitle>Interactive Elements</CardTitle>
              <CardDescription>Dropdowns and dialogs</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='outline'>Open Menu</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Billing</DropdownMenuItem>
                  <DropdownMenuItem>Team</DropdownMenuItem>
                  <DropdownMenuItem>Subscription</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button>Open Dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you sure?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete your account and
                      remove your data from our servers.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant='outline' onClick={() => setDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant='destructive' onClick={() => setDialogOpen(false)}>
                      Delete Account
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Design System Integration */}
          <Card className='shadow-soft'>
            <CardHeader>
              <CardTitle>Design System</CardTitle>
              <CardDescription>Custom CalcBuilder Pro styling</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='p-4 bg-calcbuilder-50 border border-calcbuilder-200 rounded-lg'>
                <h4 className='font-semibold text-calcbuilder-900 mb-2'>CalcBuilder Brand</h4>
                <p className='text-sm text-calcbuilder-700'>Custom color palette integration</p>
              </div>
              <div className='p-4 bg-gradient-to-r from-primary to-primary/80 rounded-lg text-primary-foreground'>
                <h4 className='font-semibold mb-2'>Gradient Primary</h4>
                <p className='text-sm opacity-90'>Custom gradient backgrounds</p>
              </div>
              <div className='p-4 bg-card border border-border rounded-lg shadow-soft hover:shadow-medium transition-shadow duration-200'>
                <h4 className='font-semibold text-foreground mb-2'>Custom Shadows</h4>
                <p className='text-sm text-muted-foreground'>Soft to strong shadow system</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className='mt-16 text-center'>
          <p className='text-muted-foreground'>
            All components are built with accessibility in mind and follow modern design principles.
          </p>
        </div>
      </div>
    </div>
  );
}
