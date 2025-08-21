'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Company } from '@/types';
import { AlertTriangle, CheckCircle, Clock, Globe, RefreshCw, XCircle, Info, ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';

interface DomainVerification {
  id: string;
  domain: string;
  status: 'pending' | 'verified' | 'failed' | 'expired';
  verification_type: 'dns' | 'file' | 'meta';
  verified_at?: string;
  error_message?: string;
  expires_at?: string;
  dns_records?: Array<{
    type: string;
    name: string;
    value: string;
    status: 'found' | 'missing' | 'incorrect';
  }>;
}

interface DomainForm {
  domain: string;
  verification_type: 'dns' | 'file' | 'meta';
  custom_domain_enabled: boolean;
  subdomain_enabled: boolean;
  white_label_enabled: boolean;
}

const defaultDomainForm: DomainForm = {
  domain: '',
  verification_type: 'dns',
  custom_domain_enabled: false,
  subdomain_enabled: false,
  white_label_enabled: false,
};

export default function CompanyDomainsPage() {
  const [company, setCompany] = useState<Company | null>(null);
  const [form, setForm] = useState<DomainForm>(defaultDomainForm);
  const [verification, setVerification] = useState<DomainVerification | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadCompanyDomains();
  }, []);

  const loadCompanyDomains = async () => {
    try {
      const response = await fetch('/api/companies');
      const data = await response.json();

      if (data.success && data.data && data.data.length > 0) {
        const demoCompany = data.data[0];
        setCompany(demoCompany);

        if (demoCompany.id) {
          const domainResponse = await fetch(`/api/companies/${demoCompany.id}/domains`);
          const domainData = await domainResponse.json();

          if (domainData.success) {
            setForm({
              domain: domainData.data.company.domain || '',
              verification_type: 'dns',
              custom_domain_enabled: domainData.data.company.custom_domain_enabled || false,
              subdomain_enabled: domainData.data.company.subdomain_enabled || false,
              white_label_enabled: domainData.data.company.white_label_enabled || false,
            });

            if (domainData.data.verification) {
              setVerification(domainData.data.verification);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error loading company domains:', error);
      setMessage({ type: 'error', text: 'Failed to load company domain information' });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      if (!company) {
        throw new Error('No company data available');
      }

      const response = await fetch(`/api/companies/${company.id}/domains`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Domain verification request created successfully!' });
        setVerification({
          id: data.data.verification.id,
          domain: form.domain,
          status: 'pending',
          verification_type: form.verification_type,
          expires_at: data.data.verification.expires_at,
          dns_records: data.data.verification.dns_records,
        });

        await loadCompanyDomains();
      } else {
        setMessage({
          type: 'error',
          text: data.error || 'Failed to create domain verification request',
        });
      }
    } catch (error) {
      console.error('Error creating domain verification:', error);
      setMessage({ type: 'error', text: 'Error creating domain verification request' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyDomain = async () => {
    if (!company || !verification) return;

    setIsVerifying(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/companies/${company.id}/domains/verify`, {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        setVerification(data.data.verification);
        
        if (data.data.verification.status === 'verified') {
          setMessage({ type: 'success', text: 'Domain verification successful!' });
        } else {
          setMessage({
            type: 'error',
            text: 'Domain verification failed. Please check your DNS records.',
          });
        }

        // Reload company data to get updated verification status
        await loadCompanyDomains();
      } else {
        setMessage({
          type: 'error',
          text: data.error || 'Failed to verify domain',
        });
      }
    } catch (error) {
      console.error('Error verifying domain:', error);
      setMessage({ type: 'error', text: 'Error verifying domain' });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleUpdateDomain = async () => {
    if (!company || !form.domain) return;

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/companies/${company.id}/domains`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Domain settings updated successfully!' });
        await loadCompanyDomains();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update domain settings' });
      }
    } catch (error) {
      console.error('Error updating domain settings:', error);
      setMessage({ type: 'error', text: 'Error updating domain settings' });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className='h-5 w-5 text-green-500' />;
      case 'failed':
        return <XCircle className='h-5 w-5 text-red-500' />;
      case 'expired':
        return <XCircle className='h-5 w-5 text-red-500' />;
      case 'pending':
        return <Clock className='h-5 w-5 text-yellow-500' />;
      default:
        return <AlertTriangle className='h-5 w-5 text-gray-500' />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <Badge variant='default' className='bg-green-100 text-green-800'>
            Verified
          </Badge>
        );
      case 'failed':
        return <Badge variant='destructive'>Failed</Badge>;
      case 'expired':
        return <Badge variant='destructive'>Expired</Badge>;
      case 'pending':
        return <Badge variant='secondary'>Pending</Badge>;
      default:
        return <Badge variant='outline'>Unknown</Badge>;
    }
  };

  const isVerificationExpired = () => {
    if (!verification?.expires_at) return false;
    return new Date(verification.expires_at) < new Date();
  };

  if (!company) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='flex items-center justify-center'>
          <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900'></div>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-8'>
        <h1 className='text-4xl font-bold text-foreground mb-4'>Domain Management</h1>
        <p className='text-xl text-muted-foreground'>
          Manage your company&apos;s domain settings and white-labeling configuration
        </p>
      </div>

      {message && (
        <Alert
          className={`mb-6 ${message.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}
        >
          <AlertDescription
            className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}
          >
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <div className='grid gap-6 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Globe className='h-5 w-5' />
              Domain Configuration
            </CardTitle>
            <CardDescription>
              Configure your custom domain and white-labeling settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <Label htmlFor='domain'>Domain</Label>
                <Input
                  id='domain'
                  type='text'
                  placeholder='example.com'
                  value={form.domain}
                  onChange={e => setForm({ ...form, domain: e.target.value })}
                  required
                />
                <p className='text-sm text-muted-foreground mt-1'>
                  Enter your domain without http:// or www
                </p>
              </div>

              <div>
                <Label htmlFor='verification_type'>Verification Type</Label>
                <select
                  id='verification_type'
                  value={form.verification_type}
                  onChange={e => setForm({ ...form, verification_type: e.target.value as any })}
                  className='w-full p-2 border border-input rounded-md bg-background'
                >
                  <option value='dns'>DNS Verification</option>
                  <option value='file'>File Verification</option>
                  <option value='meta'>Meta Tag Verification</option>
                </select>
              </div>

              <div className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <Label htmlFor='custom_domain'>Custom Domain</Label>
                  <Switch
                    id='custom_domain'
                    checked={form.custom_domain_enabled}
                    onCheckedChange={checked =>
                      setForm({ ...form, custom_domain_enabled: checked })
                    }
                  />
                </div>

                <div className='flex items-center justify-between'>
                  <Label htmlFor='subdomain'>Subdomain Support</Label>
                  <Switch
                    id='subdomain'
                    checked={form.subdomain_enabled}
                    onCheckedChange={checked => setForm({ ...form, subdomain_enabled: checked })}
                  />
                </div>

                <div className='flex items-center justify-between'>
                  <Label htmlFor='white_label'>White-Labeling</Label>
                  <Switch
                    id='white_label'
                    checked={form.white_label_enabled}
                    onCheckedChange={checked => setForm({ ...form, white_label_enabled: checked })}
                  />
                </div>
              </div>

              <div className='flex gap-2'>
                <Button type='submit' disabled={isLoading} className='flex-1'>
                  {isLoading ? 'Creating...' : 'Create Verification Request'}
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  onClick={handleUpdateDomain}
                  disabled={isLoading}
                >
                  Update Settings
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <CheckCircle className='h-5 w-5' />
              Verification Status
            </CardTitle>
            <CardDescription>Current domain verification status and DNS records</CardDescription>
          </CardHeader>
          <CardContent>
            {verification ? (
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <span className='font-medium'>Domain:</span>
                  <span className='font-mono'>{verification.domain}</span>
                </div>

                <div className='flex items-center justify-between'>
                  <span className='font-medium'>Status:</span>
                  <div className='flex items-center gap-2'>
                    {getStatusIcon(verification.status)}
                    {getStatusBadge(verification.status)}
                  </div>
                </div>

                {verification.expires_at && (
                  <div className='flex items-center justify-between'>
                    <span className='font-medium'>Expires:</span>
                    <span className={`text-sm ${isVerificationExpired() ? 'text-red-600' : 'text-muted-foreground'}`}>
                      {new Date(verification.expires_at).toLocaleDateString()}
                      {isVerificationExpired() && ' (Expired)'}
                    </span>
                  </div>
                )}

                {verification.verified_at && (
                  <div className='flex items-center justify-between'>
                    <span className='font-medium'>Verified At:</span>
                    <span className='text-sm text-muted-foreground'>
                      {new Date(verification.verified_at).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {verification.dns_records && verification.dns_records.length > 0 && (
                  <div>
                    <Label className='font-medium'>DNS Records:</Label>
                    <div className='mt-2 space-y-2'>
                      {verification.dns_records.map((record, index) => (
                        <div key={index} className='p-3 bg-muted rounded-md'>
                          <div className='flex items-center justify-between mb-1'>
                            <span className='font-mono text-sm'>{record.type}</span>
                            <Badge
                              variant={record.status === 'found' ? 'default' : 'destructive'}
                              className='text-xs'
                            >
                              {record.status}
                            </Badge>
                          </div>
                          <div className='text-sm'>
                            <div>
                              <span className='font-medium'>Name:</span> {record.name}
                            </div>
                            <div>
                              <span className='font-medium'>Value:</span> {record.value}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {verification.status === 'pending' && !isVerificationExpired() && (
                  <Button
                    onClick={handleVerifyDomain}
                    disabled={isVerifying}
                    className='w-full'
                    variant='outline'
                  >
                    {isVerifying ? (
                      <>
                        <RefreshCw className='h-4 w-4 mr-2 animate-spin' />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <RefreshCw className='h-4 w-4 mr-2' />
                        Verify Domain
                      </>
                    )}
                  </Button>
                )}

                {isVerificationExpired() && (
                  <div className='p-3 bg-red-50 border border-red-200 rounded-md'>
                    <p className='text-sm text-red-800'>
                      <Info className='h-4 w-4 inline mr-1' />
                      This verification has expired. Please create a new verification request.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className='text-center py-8 text-muted-foreground'>
                <Globe className='h-12 w-12 mx-auto mb-4 opacity-50' />
                <p>No domain verification request found.</p>
                <p className='text-sm'>Create a verification request to get started.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {verification && verification.dns_records && (
        <Card className='mt-6'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Info className='h-5 w-5' />
              DNS Configuration Instructions
            </CardTitle>
            <CardDescription>Follow these steps to verify your domain ownership</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='bg-muted p-4 rounded-md font-mono text-sm space-y-2'>
              <p>Add the following DNS records to your domain provider:</p>
              <br />
              {verification.dns_records.map((record, index) => (
                <div key={index}>
                  <p>
                    <span className='text-blue-600'>Type:</span> {record.type}
                  </p>
                  <p>
                    <span className='text-blue-600'>Name:</span> {record.name}
                  </p>
                  <p>
                    <span className='text-blue-600'>Value:</span> {record.value}
                  </p>
                  <br />
                </div>
              ))}
              <p className='text-muted-foreground'>
                After adding these records, wait a few minutes for DNS propagation and then click
                &ldquo;Verify Domain&rdquo;.
              </p>
              {verification.expires_at && (
                <p className='text-amber-600 font-medium'>
                  ⚠️ Verification expires on {new Date(verification.expires_at).toLocaleDateString()}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {verification?.status === 'verified' && (
        <Card className='mt-6 border-green-200 bg-green-50'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-green-800'>
              <CheckCircle className='h-5 w-5' />
              Domain Successfully Verified!
            </CardTitle>
            <CardDescription className='text-green-700'>
              Your domain is now ready for white-labeling
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              <p className='text-green-800'>
                Congratulations! Your domain <strong>{verification.domain}</strong> has been successfully verified.
              </p>
              <div className='flex gap-2'>
                <Button variant='outline' className='text-green-700 border-green-300'>
                  <ExternalLink className='h-4 w-4 mr-2' />
                  Test Domain
                </Button>
                <Button variant='outline' className='text-green-700 border-green-300'>
                  <Globe className='h-4 w-4 mr-2' />
                  Configure White-Labeling
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
