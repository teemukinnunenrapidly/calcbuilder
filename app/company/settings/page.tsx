'use client';

import { Button } from '../../../src/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../src/components/ui/card';
import { Input } from '../../../src/components/ui/input';
import { Label } from '../../../src/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../src/components/ui/select';
import { Switch } from '../../../src/components/ui/switch';
import { CompanySettings } from '../../../src/types';
import { Save, RefreshCw, Settings, Globe, Bell, Zap, Building, CreditCard } from 'lucide-react';
import { useEffect, useState } from 'react';

const defaultSettings: CompanySettings = {
  timezone: 'UTC',
  locale: 'en',
  currency: 'USD',
  date_format: 'MM/DD/YYYY',
  number_format: '1,234.56',
  features: {
    advanced_analytics: false,
    white_labeling: false,
    api_access: false,
    custom_integrations: false,
    multi_language: false,
    custom_branding: false,
  },
  notification_settings: {
    email_notifications: true,
    push_notifications: false,
    marketing_emails: false,
    security_alerts: true,
    weekly_reports: false,
    monthly_summaries: true,
  },
  business_settings: {
    company_size: '1-10',
    industry: '',
    tax_id: '',
    billing_address: {
      street: '',
      city: '',
      state: '',
      postal_code: '',
      country: '',
    },
  },
};

const timezoneOptions = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'Europe/Helsinki', label: 'Europe/Helsinki (EET/EEST)' },
  { value: 'Europe/Stockholm', label: 'Europe/Stockholm (CET/CEST)' },
  { value: 'Europe/London', label: 'Europe/London (GMT/BST)' },
  { value: 'America/New_York', label: 'America/New_York (EST/EDT)' },
  { value: 'America/Los_Angeles', label: 'America/Los_Angeles (PST/PDT)' },
  { value: 'Asia/Tokyo', label: 'Asia/Tokyo (JST)' },
  { value: 'Australia/Sydney', label: 'Australia/Sydney (AEST/AEDT)' },
];

const localeOptions = [
  { value: 'en', label: 'English' },
  { value: 'fi', label: 'Suomi' },
  { value: 'sv', label: 'Svenska' },
  { value: 'de', label: 'Deutsch' },
  { value: 'fr', label: 'Français' },
  { value: 'es', label: 'Español' },
];

const currencyOptions = [
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - British Pound' },
  { value: 'SEK', label: 'SEK - Swedish Krona' },
  { value: 'NOK', label: 'NOK - Norwegian Krone' },
  { value: 'DKK', label: 'DKK - Danish Krone' },
];

const dateFormatOptions = [
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (US format)' },
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (European format)' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (ISO format)' },
  { value: 'DD.MM.YYYY', label: 'DD.MM.YYYY (German format)' },
];

const numberFormatOptions = [
  { value: '1,234.56', label: '1,234.56 (US format)' },
  { value: '1 234,56', label: '1 234,56 (European format)' },
  { value: '1.234,56', label: '1.234,56 (German format)' },
];

const companySizeOptions = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '201-1000', label: '201-1000 employees' },
  { value: '1000+', label: '1000+ employees' },
];

export default function CompanySettingsPage() {
  const [settings, setSettings] = useState<CompanySettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchCompanySettings();
  }, []);

  const fetchCompanySettings = async () => {
    try {
      // For now, we'll use the demo company from our API
      const response = await fetch('/api/companies');
      const data = await response.json();

      if (data.success && data.data && data.data.length > 0) {
        const demoCompany = data.data[0];

        // Fetch current settings
        const settingsResponse = await fetch(`/api/companies/${demoCompany.id}/settings`);
        const settingsData = await settingsResponse.json();

        if (settingsData.success) {
          setSettings({ ...defaultSettings, ...settingsData.data.settings });
        } else {
          setSettings(defaultSettings);
        }
      } else {
        setSettings(defaultSettings);
      }
    } catch (err) {
      console.error('Error fetching company settings:', err);
      setMessage({ type: 'error', text: 'Failed to load company settings.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingChange = (key: keyof CompanySettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleFeatureToggle = (feature: string, enabled: boolean) => {
    setSettings(prev => ({
      ...prev,
      features: { ...prev.features, [feature]: enabled },
    }));
  };

  const handleNotificationChange = (key: string, enabled: boolean) => {
    setSettings(prev => ({
      ...prev,
      notification_settings: { ...prev.notification_settings, [key]: enabled },
    }));
  };

  const handleBusinessSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      business_settings: { ...prev.business_settings, [key]: value },
    }));
  };

  const handleBillingAddressChange = (key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      business_settings: {
        ...prev.business_settings,
        billing_address: {
          ...prev.business_settings.billing_address,
          [key]: value,
        },
      },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);

    try {
      // Get demo company ID
      const response = await fetch('/api/companies');
      const data = await response.json();

      if (data.success && data.data && data.data.length > 0) {
        const demoCompany = data.data[0];

        const settingsResponse = await fetch(`/api/companies/${demoCompany.id}/settings`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(settings),
        });

        const settingsData = await settingsResponse.json();

        if (!settingsResponse.ok) {
          throw new Error(settingsData.error || 'Failed to save settings');
        }

        setMessage({ type: 'success', text: 'Settings saved successfully!' });
      } else {
        throw new Error('No companies found');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: `Error saving settings: ${(error as Error).message}` });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center gap-3">
          <Settings className="h-10 w-10" />
          Company Settings
        </h1>
        <p className="text-xl text-muted-foreground">
          Configure company preferences, platform features, and business settings.
        </p>
      </div>

      {message && (
        <div
          className={`mt-6 p-4 rounded-md ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Basic Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Basic Settings
            </CardTitle>
            <CardDescription>Basic company configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={settings.timezone || ''}
                onValueChange={value => handleSettingChange('timezone', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {timezoneOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="locale">Language</Label>
              <Select
                value={settings.locale || ''}
                onValueChange={value => handleSettingChange('locale', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {localeOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={settings.currency || ''}
                onValueChange={value => handleSettingChange('currency', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencyOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="date_format">Date Format</Label>
              <Select
                value={settings.date_format || ''}
                onValueChange={value => handleSettingChange('date_format', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select date format" />
                </SelectTrigger>
                <SelectContent>
                  {dateFormatOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="number_format">Number Format</Label>
              <Select
                value={settings.number_format || ''}
                onValueChange={value => handleSettingChange('number_format', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select number format" />
                </SelectTrigger>
                <SelectContent>
                  {numberFormatOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Platform Features
            </CardTitle>
            <CardDescription>Enable or disable platform features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(settings.features || {}).map(([feature, enabled]) => (
              <div key={feature} className="flex items-center justify-between">
                <Label htmlFor={feature} className="capitalize">
                  {feature.replace(/_/g, ' ')}
                </Label>
                <Switch
                  id={feature}
                  checked={enabled}
                  onCheckedChange={checked => handleFeatureToggle(feature, checked)}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>Configure notification settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(settings.notification_settings || {}).map(([key, enabled]) => (
              <div key={key} className="flex items-center justify-between">
                <Label htmlFor={key} className="capitalize">
                  {key.replace(/_/g, ' ')}
                </Label>
                <Switch
                  id={key}
                  checked={enabled}
                  onCheckedChange={checked => handleNotificationChange(key, checked)}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Business Settings */}
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Business Information
            </CardTitle>
            <CardDescription>Company business details and billing information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="company_size">Company Size</Label>
                <Select
                  value={settings.business_settings?.company_size || ''}
                  onValueChange={value => handleBusinessSettingChange('company_size', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent>
                    {companySizeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  placeholder="e.g., Technology, Healthcare, Finance"
                  value={settings.business_settings?.industry || ''}
                  onChange={e => handleBusinessSettingChange('industry', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="tax_id">Tax ID</Label>
                <Input
                  id="tax_id"
                  placeholder="Tax identification number"
                  value={settings.business_settings?.tax_id || ''}
                  onChange={e => handleBusinessSettingChange('tax_id', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label className="flex items-center gap-2 mb-3">
                <CreditCard className="h-4 w-4" />
                Billing Address
              </Label>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="street">Street Address</Label>
                  <Input
                    id="street"
                    placeholder="Street address"
                    value={settings.business_settings?.billing_address?.street || ''}
                    onChange={e => handleBillingAddressChange('street', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="City"
                    value={settings.business_settings?.billing_address?.city || ''}
                    onChange={e => handleBillingAddressChange('city', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    placeholder="State or province"
                    value={settings.business_settings?.billing_address?.state || ''}
                    onChange={e => handleBillingAddressChange('state', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="postal_code">Postal Code</Label>
                  <Input
                    id="postal_code"
                    placeholder="Postal code"
                    value={settings.business_settings?.billing_address?.postal_code || ''}
                    onChange={e => handleBillingAddressChange('postal_code', e.target.value)}
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    placeholder="Country"
                    value={settings.business_settings?.billing_address?.country || ''}
                    onChange={e => handleBillingAddressChange('country', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 flex justify-center">
        <Button onClick={handleSave} disabled={isSaving} size="lg">
          {isSaving ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
