import { z } from 'zod';

// Company creation schema
export const createCompanySchema = z.object({
  name: z.string().min(1, 'Company name is required').max(255, 'Company name must be less than 255 characters'),
  slug: z.string().min(1, 'Slug is required').max(100, 'Slug must be less than 100 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  domain: z.string().url('Invalid domain URL').optional().or(z.literal('')),
  logo_url: z.string().url('Invalid logo URL').optional().or(z.literal('')),
  brand_colors: z.object({
    primary: z.string().regex(/^#[0-9A-F]{6}$/i, 'Primary color must be a valid hex color').optional(),
    secondary: z.string().regex(/^#[0-9A-F]{6}$/i, 'Secondary color must be a valid hex color').optional(),
    accent: z.string().regex(/^#[0-9A-F]{6}$/i, 'Accent color must be a valid hex color').optional(),
    background: z.string().regex(/^#[0-9A-F]{6}$/i, 'Background color must be a valid hex color').optional(),
    foreground: z.string().regex(/^#[0-9A-F]{6}$/i, 'Foreground color must be a valid hex color').optional(),
    muted: z.string().regex(/^#[0-9A-F]{6}$/i, 'Muted color must be a valid hex color').optional(),
    border: z.string().regex(/^#[0-9A-F]{6}$/i, 'Border color must be a valid hex color').optional(),
  }).optional(),
  settings: z.object({
    timezone: z.string().default('UTC'),
    locale: z.string().default('en'),
    currency: z.string().default('USD'),
    date_format: z.string().default('YYYY-MM-DD'),
    number_format: z.string().default('en-US'),
    features: z.record(z.boolean()).default({}),
  }).optional(),
});

// Company update schema (all fields optional)
export const updateCompanySchema = createCompanySchema.partial();

// Company search schema
export const companySearchSchema = z.object({
  q: z.string().optional(),
  status: z.enum(['active', 'inactive', 'suspended', 'cancelled']).optional(),
  tier: z.enum(['free', 'starter', 'professional', 'enterprise']).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
});

// Company ID schema
export const companyIdSchema = z.object({
  id: z.string().uuid('Invalid company ID'),
});

// Export types
export type CreateCompanyInput = z.infer<typeof createCompanySchema>;
export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>;
export type CompanySearchInput = z.infer<typeof companySearchSchema>;
export type CompanyIdInput = z.infer<typeof companyIdSchema>;
