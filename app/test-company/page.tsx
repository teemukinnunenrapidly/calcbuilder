'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ApiResponse, Company } from '@/types';
import { Edit, Eye, Plus, RefreshCw, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function TestCompanyPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    domain: '',
    logo_url: '',
  });

  // Fetch companies on component mount
  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/companies');
      const data: ApiResponse<Company[]> = await response.json();

      if (data.success && data.data) {
        setCompanies(data.data);
      } else {
        console.error('Failed to fetch companies:', data.error);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchCompanies = async () => {
    if (!searchQuery.trim()) {
      fetchCompanies();
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/companies/search?q=${encodeURIComponent(searchQuery)}`);
      const data: ApiResponse<Company[]> = await response.json();

      if (data.success && data.data) {
        setCompanies(data.data);
      } else {
        console.error('Failed to search companies:', data.error);
      }
    } catch (error) {
      console.error('Error searching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const createCompany = async () => {
    if (!formData.name || !formData.slug) {
      alert('Name and slug are required');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          brand_colors: {},
          settings: {},
        }),
      });

      const data: ApiResponse<Company> = await response.json();

      if (data.success && data.data) {
        setCompanies([data.data, ...companies]);
        setShowCreateForm(false);
        setFormData({ name: '', slug: '', domain: '', logo_url: '' });
        alert('Company created successfully!');
      } else {
        alert(`Failed to create company: ${data.error}`);
      }
    } catch (error) {
      console.error('Error creating company:', error);
      alert('Error creating company');
    } finally {
      setLoading(false);
    }
  };

  const updateCompany = async () => {
    if (!selectedCompany) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/companies/${selectedCompany.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data: ApiResponse<Company> = await response.json();

      if (data.success && data.data) {
        setCompanies(companies.map(c => (c.id === selectedCompany.id ? data.data! : c)));
        setShowEditForm(false);
        setSelectedCompany(null);
        setFormData({ name: '', slug: '', domain: '', logo_url: '' });
        alert('Company updated successfully!');
      } else {
        alert(`Failed to update company: ${data.error}`);
      }
    } catch (error) {
      console.error('Error updating company:', error);
      alert('Error updating company');
    } finally {
      setLoading(false);
    }
  };

  const deleteCompany = async (id: string) => {
    if (!confirm('Are you sure you want to delete this company? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/companies/${id}`, {
        method: 'DELETE',
      });

      const data: ApiResponse<null> = await response.json();

      if (data.success) {
        setCompanies(companies.filter(c => c.id !== id));
        alert('Company deleted successfully!');
      } else {
        alert(`Failed to delete company: ${data.error}`);
      }
    } catch (error) {
      console.error('Error deleting company:', error);
      alert('Error deleting company');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (company: Company) => {
    setSelectedCompany(company);
    setFormData({
      name: company.name,
      slug: company.slug,
      domain: company.domain || '',
      logo_url: company.logo_url || '',
    });
    setShowEditForm(true);
  };

  const handleView = async (id: string) => {
    try {
      const response = await fetch(`/api/companies/${id}`);
      const data: ApiResponse<Company> = await response.json();

      if (data.success && data.data) {
        setSelectedCompany(data.data);
        setShowEditForm(false);
      } else {
        alert(`Failed to fetch company: ${data.error}`);
      }
    } catch (error) {
      console.error('Error fetching company:', error);
      alert('Error fetching company');
    }
  };

  return (
    <div className='min-h-screen bg-background p-8'>
      <div className='container mx-auto space-y-8'>
        {/* Header */}
        <div className='text-center'>
          <h1 className='text-4xl font-bold text-foreground mb-4'>Company CRUD Test Page</h1>
          <p className='text-xl text-muted-foreground'>Test company management operations</p>
          <div className="mt-4 space-x-4">
            <a
              href="/company/profile"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Go to Company Profile
            </a>
            <a
              href="/company/domains"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Domain Management
            </a>
            <a
              href="/company/settings"
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Company Settings
            </a>
            <a
              href="/company/team"
              className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
            >
              Team Management
            </a>
          </div>
        </div>

        {/* Search and Actions */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center justify-between'>
              <span>Company Management</span>
              <Button onClick={() => setShowCreateForm(true)} className='flex items-center gap-2'>
                <Plus className='h-4 w-4' />
                Add Company
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            {/* Search Bar */}
            <div className='flex gap-2'>
              <Input
                placeholder='Search companies...'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && searchCompanies()}
              />
              <Button onClick={searchCompanies} disabled={loading}>
                <Search className='h-4 w-4' />
              </Button>
              <Button variant='outline' onClick={fetchCompanies} disabled={loading}>
                <RefreshCw className='h-4 w-4' />
              </Button>
            </div>

            {/* Company List */}
            <div className='space-y-2'>
              {loading ? (
                <div className='text-center py-8'>
                  <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto'></div>
                  <p className='mt-2 text-muted-foreground'>Loading...</p>
                </div>
              ) : companies.length === 0 ? (
                <div className='text-center py-8 text-muted-foreground'>No companies found</div>
              ) : (
                companies.map(company => (
                  <div
                    key={company.id}
                    className='flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50'
                  >
                    <div className='flex-1'>
                      <h3 className='font-semibold'>{company.name}</h3>
                      <p className='text-sm text-muted-foreground'>
                        Slug: {company.slug}
                        {company.domain && ` • Domain: ${company.domain}`}
                      </p>
                      <div className='flex gap-2 mt-2'>
                        <Badge variant='outline'>{company.subscription_tier}</Badge>
                        <Badge
                          variant={
                            company.subscription_status === 'active' ? 'default' : 'secondary'
                          }
                        >
                          {company.subscription_status}
                        </Badge>
                      </div>
                    </div>
                    <div className='flex gap-2'>
                      <Button variant='outline' size='sm' onClick={() => handleView(company.id)}>
                        <Eye className='h-4 w-4' />
                      </Button>
                      <Button variant='outline' size='sm' onClick={() => handleEdit(company)}>
                        <Edit className='h-4 w-4' />
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => deleteCompany(company.id)}
                        className='text-destructive hover:text-destructive'
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Create Company Form */}
        {showCreateForm && (
          <Card>
            <CardHeader>
              <CardTitle>Create New Company</CardTitle>
              <CardDescription>Add a new company to the system</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='name'>Company Name *</Label>
                  <Input
                    id='name'
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder='Enter company name'
                  />
                </div>
                <div>
                  <Label htmlFor='slug'>Slug *</Label>
                  <Input
                    id='slug'
                    value={formData.slug}
                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                    placeholder='company-slug'
                  />
                </div>
                <div>
                  <Label htmlFor='domain'>Domain</Label>
                  <Input
                    id='domain'
                    value={formData.domain}
                    onChange={e => setFormData({ ...formData, domain: e.target.value })}
                    placeholder='https://example.com'
                  />
                </div>
                <div>
                  <Label htmlFor='logo_url'>Logo URL</Label>
                  <Input
                    id='logo_url'
                    value={formData.logo_url}
                    onChange={e => setFormData({ ...formData, logo_url: e.target.value })}
                    placeholder='https://example.com/logo.png'
                  />
                </div>
              </div>
              <div className='flex gap-2'>
                <Button onClick={createCompany} disabled={loading}>
                  Create Company
                </Button>
                <Button variant='outline' onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Edit Company Form */}
        {showEditForm && selectedCompany && (
          <Card>
            <CardHeader>
              <CardTitle>Edit Company: {selectedCompany.name}</CardTitle>
              <CardDescription>Update company information</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='edit-name'>Company Name *</Label>
                  <Input
                    id='edit-name'
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder='Enter company name'
                  />
                </div>
                <div>
                  <Label htmlFor='edit-slug'>Slug *</Label>
                  <Input
                    id='edit-slug'
                    value={formData.slug}
                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                    placeholder='company-slug'
                  />
                </div>
                <div>
                  <Label htmlFor='edit-domain'>Domain</Label>
                  <Input
                    id='edit-domain'
                    value={formData.domain}
                    onChange={e => setFormData({ ...formData, domain: e.target.value })}
                    placeholder='https://example.com'
                  />
                </div>
                <div>
                  <Label htmlFor='edit-logo_url'>Logo URL</Label>
                  <Input
                    id='edit-logo_url'
                    value={formData.logo_url}
                    onChange={e => setFormData({ ...formData, logo_url: e.target.value })}
                    placeholder='https://example.com/logo.png'
                  />
                </div>
              </div>
              <div className='flex gap-2'>
                <Button onClick={updateCompany} disabled={loading}>
                  Update Company
                </Button>
                <Button variant='outline' onClick={() => setShowEditForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Company Details View */}
        {selectedCompany && !showEditForm && (
          <Card>
            <CardHeader>
              <CardTitle>Company Details: {selectedCompany.name}</CardTitle>
              <CardDescription>View company information</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label>Company ID</Label>
                  <p className='text-sm font-mono bg-muted p-2 rounded'>{selectedCompany.id}</p>
                </div>
                <div>
                  <Label>Slug</Label>
                  <p className='text-sm font-mono bg-muted p-2 rounded'>{selectedCompany.slug}</p>
                </div>
                <div>
                  <Label>Domain</Label>
                  <p className='text-sm bg-muted p-2 rounded'>
                    {selectedCompany.domain || 'Not set'}
                  </p>
                </div>
                <div>
                  <Label>Logo URL</Label>
                  <p className='text-sm bg-muted p-2 rounded'>
                    {selectedCompany.logo_url || 'Not set'}
                  </p>
                </div>
                <div>
                  <Label>Subscription Tier</Label>
                  <Badge>{selectedCompany.subscription_tier}</Badge>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge
                    variant={
                      selectedCompany.subscription_status === 'active' ? 'default' : 'secondary'
                    }
                  >
                    {selectedCompany.subscription_status}
                  </Badge>
                </div>
                <div>
                  <Label>Created At</Label>
                  <p className='text-sm bg-muted p-2 rounded'>
                    {new Date(selectedCompany.created_at).toLocaleString()}
                  </p>
                </div>
                <div>
                  <Label>Updated At</Label>
                  <p className='text-sm bg-muted p-2 rounded'>
                    {new Date(selectedCompany.updated_at).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className='flex gap-2'>
                <Button variant='outline' onClick={() => setSelectedCompany(null)}>
                  Close
                </Button>
                <Button onClick={() => handleEdit(selectedCompany)}>Edit Company</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
