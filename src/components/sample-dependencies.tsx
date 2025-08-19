'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type FormData = z.infer<typeof formSchema>;

// Sample data for drag and drop
const sampleItems = [
  { id: '1', text: 'Item 1' },
  { id: '2', text: 'Item 2' },
  { id: '3', text: 'Item 3' },
];

export function SampleDependencies() {
  const { t } = useTranslation();
  const [items, setItems] = useState(sampleItems);
  const [isFormValid, setIsFormValid] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormData) => {
    console.log('Form data:', data);
    setIsFormValid(true);
    reset();
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems(items => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);

        if (oldIndex === -1 || newIndex === -1) return items;

        const newItems = [...items];
        const [removed] = newItems.splice(oldIndex, 1);

        if (removed) {
          newItems.splice(newIndex, 0, removed);
        }

        return newItems;
      });
    }
  };

  return (
    <div className='space-y-6 p-6'>
      <Card>
        <CardHeader>
          <CardTitle>Dependencies Test Component</CardTitle>
          <CardDescription>This component tests all installed dependencies</CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          {/* React Hook Form + Zod Test */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Form Validation Test</h3>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
              <div>
                <Label htmlFor='name'>Name</Label>
                <Input id='name' {...register('name')} placeholder='Enter your name' />
                {errors.name && <p className='text-sm text-red-500 mt-1'>{errors.name.message}</p>}
              </div>

              <div>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  type='email'
                  {...register('email')}
                  placeholder='Enter your email'
                />
                {errors.email && (
                  <p className='text-sm text-red-500 mt-1'>{errors.email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor='message'>Message</Label>
                <Input id='message' {...register('message')} placeholder='Enter your message' />
                {errors.message && (
                  <p className='text-sm text-red-500 mt-1'>{errors.message.message}</p>
                )}
              </div>

              <Button type='submit'>Submit Form</Button>
            </form>

            {isFormValid && (
              <Badge variant='default' className='bg-green-500'>
                Form submitted successfully!
              </Badge>
            )}
          </div>

          {/* Drag and Drop Test */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Drag and Drop Test</h3>
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={items} strategy={verticalListSortingStrategy}>
                <div className='space-y-2'>
                  {items.map(item => (
                    <div
                      key={item.id}
                      className='p-3 bg-gray-100 rounded border cursor-move hover:bg-gray-200'
                    >
                      {item.text}
                    </div>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>

          {/* Internationalization Test */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>i18n Test</h3>
            <p>
              Current language: <Badge variant='outline'>{t('language', 'en')}</Badge>
            </p>
            <p>Welcome message: {t('welcome', 'Welcome to CalcBuilder Pro!')}</p>
          </div>

          {/* Component Library Test */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>UI Components Test</h3>
            <div className='flex flex-wrap gap-2'>
              <Badge variant='default'>Default Badge</Badge>
              <Badge variant='secondary'>Secondary Badge</Badge>
              <Badge variant='destructive'>Destructive Badge</Badge>
              <Badge variant='outline'>Outline Badge</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
