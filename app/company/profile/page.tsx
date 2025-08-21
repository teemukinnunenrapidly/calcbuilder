'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BrandColors, Company } from '@/types';
import { Palette, Plus, RefreshCw, Save, Trash2, Upload, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CompanyProfileForm {
  name: string;
  slug: string;
  domain?: string;
  logo_url?: string;
  brand_colors: BrandColors;
}

const defaultBrandColors: BrandColors = {
  primary: '#2563eb',
  secondary: '#64748b',
  accent: '#f59e0b',
  background: '#ffffff',
  foreground: '#0f172a',
  muted: '#f1f5f9',
  border: '#e2e8f0',
};

export default function CompanyProfilePage() {
  const [company, setCompany] = useState<Company | null>(null);
  const [form, setForm] = useState<CompanyProfileForm>({
    name: '',
    slug: '',
    domain: '',
    logo_url: '',
    brand_colors: defaultBrandColors,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    loadCompanyProfile();
  }, []);

  const loadCompanyProfile = async () => {
    setIsLoading(true);
    try {
      // For now, we'll use the demo company from our API
      const response = await fetch('/api/companies');
      const data = await response.json();

      if (data.success && data.data && data.data.length > 0) {
        const companyData = data.data[0];
        setCompany(companyData);
        setForm({
          name: companyData.name,
          slug: companyData.slug,
          domain: companyData.domain || '',
          logo_url: companyData.logo_url || '',
          brand_colors: companyData.brand_colors || defaultBrandColors,
        });
        if (companyData.logo_url) {
          setPreviewUrl(companyData.logo_url);
        }
      }
    } catch (error) {
      console.error('Error loading company profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleLogoUpload = async () => {
    if (!logoFile || !company) return;

    setIsUploadingLogo(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('logo', logoFile);

      const response = await fetch(`/api/companies/${company.id}/logo`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to upload logo');
      }

      // Update form with new logo URL
      setForm(prev => ({
        ...prev,
        logo_url: data.data.logo_url,
      }));

      // Clear the file input
      setLogoFile(null);

      // Reload company data to get updated information
      await loadCompanyProfile();

      alert('Logo uploaded successfully!');
    } catch (error) {
      console.error('Error uploading logo:', error);
      alert(`Error uploading logo: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploadingLogo(false);
      setUploadProgress(0);
    }
  };

  const handleLogoDelete = async () => {
    if (!company || !form.logo_url) return;

    if (!confirm('Are you sure you want to delete the current logo?')) {
      return;
    }

    try {
      const response = await fetch(`/api/companies/${company.id}/logo`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to delete logo');
      }

      // Clear logo from form and preview
      setForm(prev => ({
        ...prev,
        logo_url: '',
      }));
      setPreviewUrl('');
      setLogoFile(null);

      // Reload company data
      await loadCompanyProfile();

      alert('Logo deleted successfully!');
    } catch (error) {
      console.error('Error deleting logo:', error);
      alert(`Error deleting logo: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleColorChange = (colorKey: keyof BrandColors, value: string) => {
    setForm(prev => ({
      ...prev,
      brand_colors: {
        ...prev.brand_colors,
        [colorKey]: value,
      },
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      if (!company) {
        throw new Error('No company data available');
      }

      // If there's a new logo file, upload it first
      if (logoFile) {
        await handleLogoUpload();
      }

      // Prepare branding update data
      const updateData: any = {};

      if (form.brand_colors) {
        updateData.brand_colors = form.brand_colors;
      }

      // Update company branding via API
      const response = await fetch(`/api/companies/${company.id}/branding`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to update company branding');
      }

      // Reload company data to get updated information
      await loadCompanyProfile();

      alert('Company profile updated successfully!');
    } catch (error) {
      console.error('Error saving company profile:', error);
      alert(
        `Error saving company profile: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <RefreshCw className='h-8 w-8 animate-spin' />
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto space-y-8'>
      {/* Header */}
      <div className='text-center'>
        <h1 className='text-3xl font-bold'>Company Profile</h1>
        <p className='text-muted-foreground mt-2'>
          Manage your company branding and profile settings
        </p>
      </div>

      <form onSubmit={handleSubmit} className='space-y-8'>
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Plus className='h-5 w-5' />
              Basic Information
            </CardTitle>
            <CardDescription>Update your company&apos;s basic information and branding</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='name'>Company Name</Label>
                <Input
                  id='name'
                  value={form.name}
                  onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder='Enter company name'
                  required
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='slug'>Company Slug</Label>
                <Input
                  id='slug'
                  value={form.slug}
                  onChange={e => setForm(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder='company-slug'
                  required
                />
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='domain'>Domain</Label>
              <Input
                id='domain'
                value={form.domain}
                onChange={e => setForm(prev => ({ ...prev, domain: e.target.value }))}
                placeholder='https://yourcompany.com'
                type='url'
              />
            </div>
          </CardContent>
        </Card>

        {/* Logo Upload */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Upload className='h-5 w-5' />
              Company Logo
            </CardTitle>
            <CardDescription>
              Upload your company logo. Recommended size: 200x200px, PNG or JPG format. Max size:
              5MB.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='logo'>Logo File</Label>
                <Input
                  id='logo'
                  type='file'
                  accept='image/*'
                  onChange={handleLogoChange}
                  className='cursor-pointer'
                  disabled={isUploadingLogo}
                />
              </div>
              {previewUrl && (
                <div className='flex-shrink-0 relative'>
                  <img
                    src={previewUrl}
                    alt='Logo preview'
                    className='w-20 h-20 object-contain border rounded-lg'
                  />
                  {form.logo_url && (
                    <button
                      type='button'
                      onClick={handleLogoDelete}
                      className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors'
                      title='Delete current logo'
                    >
                      <X className='h-3 w-3' />
                    </button>
                  )}
                </div>
              )}
            </div>

            {logoFile && (
              <div className='flex items-center gap-2'>
                <Badge variant='secondary'>New Logo Selected</Badge>
                <span className='text-sm text-muted-foreground'>{logoFile.name}</span>
                <Button
                  type='button'
                  onClick={handleLogoUpload}
                  disabled={isUploadingLogo}
                  size='sm'
                  className='ml-auto'
                >
                  {isUploadingLogo ? (
                    <>
                      <RefreshCw className='h-4 w-4 animate-spin mr-2' />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className='h-4 w-4 mr-2' />
                      Upload Logo
                    </>
                  )}
                </Button>
              </div>
            )}

            {form.logo_url && !logoFile && (
              <div className='flex items-center gap-2'>
                <Badge variant='secondary'>Current Logo</Badge>
                <span className='text-sm text-muted-foreground'>{form.logo_url}</span>
                <Button
                  type='button'
                  onClick={handleLogoDelete}
                  variant='outline'
                  size='sm'
                  className='ml-auto'
                >
                  <Trash2 className='h-4 w-4 mr-2' />
                  Delete Logo
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Brand Colors */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Palette className='h-5 w-5' />
              Brand Colors
            </CardTitle>
            <CardDescription>Customize your brand color scheme</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {Object.entries(form.brand_colors).map(([key, value]) => (
                <div key={key} className='space-y-2'>
                  <Label htmlFor={key} className='capitalize'>
                    {key.replace('_', ' ')}
                  </Label>
                  <div className='flex gap-2'>
                    <Input
                      id={key}
                      value={value}
                      onChange={e => handleColorChange(key as keyof BrandColors, e.target.value)}
                      placeholder='#000000'
                      className='flex-1'
                    />
                    <div className='w-10 h-10 rounded border' style={{ backgroundColor: value }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className='flex justify-end'>
          <Button type='submit' disabled={isSaving || isUploadingLogo} className='min-w-32'>
            {isSaving ? (
              <>
                <RefreshCw className='h-4 w-4 animate-spin mr-2' />
                Saving...
              </>
            ) : (
              <>
                <Save className='h-4 w-4 mr-2' />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
