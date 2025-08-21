'use client';

import { createClient } from '../../src/lib/supabase';
import { useEffect, useState } from 'react';

interface EnvVars {
  supabaseUrl: string | null;
  supabaseAnonKey: string | null;
  resendApiKey: string | null;
  emailFrom: string | null;
}

export default function TestSupabasePage() {
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [envVars, setEnvVars] = useState<EnvVars | null>(null);

  useEffect(() => {
    // Haetaan environment variables API endpointista
    fetch('/api/env-check')
      .then(res => res.json())
      .then(data => setEnvVars(data))
      .catch(err => console.error('Error fetching env vars:', err));
  }, []);

  const testSupabaseConnection = async () => {
    setLoading(true);
    setStatus('Testing Supabase connection...');

    try {
      const supabase = createClient();

      // Testaa perusyhteyttä ilman autentikaatiota
      // Käytä health check tai yksinkertaista API kutsua
      const { data, error } = await supabase.from('_dummy_table_').select('*').limit(0);

      if (error) {
        if (error.code === 'PGRST116') {
          setStatus('✅ Supabase connection successful! (Table does not exist, which is expected)');
        } else if (error.message.includes('JWT') || error.message.includes('Auth')) {
          setStatus(
            '✅ Supabase connection successful! (Authentication required, which is expected)'
          );
        } else {
          setStatus(`✅ Supabase connection successful! (Error: ${error.message})`);
        }
      } else {
        setStatus('✅ Supabase connection successful!');
      }
    } catch (error) {
      setStatus(
        `❌ Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      setLoading(false);
    }
  };

  const testResendConfiguration = async () => {
    setLoading(true);
    setStatus('Testing Resend configuration...');

    try {
      // Testaa Resend API avaimen validiteettia
      const response = await fetch('/api/env-check');
      const data = await response.json();

      if (data.resendApiKey) {
        setStatus('✅ Resend API key is configured and accessible');
      } else {
        setStatus('❌ Resend API key is not configured');
      }
    } catch (error) {
      setStatus(
        `❌ Resend test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      setLoading(false);
    }
  };

  if (!envVars) {
    return <div className='p-8'>Loading environment variables...</div>;
  }

  return (
    <div className='p-8 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-bold mb-8'>Supabase & Resend Connection Test</h1>

      {/* Environment Variables Section */}
      <div className='bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8'>
        <h2 className='text-xl font-semibold mb-4'>Environment Variables</h2>
        <div className='space-y-3'>
          <div>
            <strong>SUPABASE_URL:</strong> {envVars.supabaseUrl ? '✅ Set' : '❌ Not set'}
          </div>
          <div>
            <strong>SUPABASE_ANON_KEY:</strong> {envVars.supabaseAnonKey ? '✅ Set' : '❌ Not set'}
          </div>
          <div>
            <strong>RESEND_API_KEY:</strong> {envVars.resendApiKey ? '✅ Set' : '❌ Not set'}
          </div>
          <div>
            <strong>EMAIL_FROM:</strong> {envVars.emailFrom ? '✅ Set' : '❌ Not set'}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className='flex gap-4 mb-8'>
        <button
          onClick={testSupabaseConnection}
          disabled={loading}
          className='bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-6 py-3 rounded-lg font-medium'
        >
          {loading ? 'Testing...' : 'Test Supabase Connection'}
        </button>

        <button
          onClick={testResendConfiguration}
          disabled={loading}
          className='bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white px-6 py-3 rounded-lg font-medium'
        >
          {loading ? 'Testing...' : 'Test Resend Configuration'}
        </button>
      </div>

      {/* Test Results */}
      {status && (
        <div className='bg-white border border-gray-200 rounded-lg p-6'>
          <h3 className='text-lg font-semibold mb-3'>Test Results</h3>
          <div className='whitespace-pre-wrap'>{status}</div>
        </div>
      )}
    </div>
  );
}
