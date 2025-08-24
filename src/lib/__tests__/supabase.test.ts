import { createClient, createServerSupabaseClient, createServiceRoleClient } from '../supabase';

// Mock environment variables
const mockEnv = {
  NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key',
  SUPABASE_SERVICE_ROLE_KEY: 'test-service-role-key',
};

describe('Supabase Client', () => {
  beforeEach(() => {
    // Set up environment variables
    Object.entries(mockEnv).forEach(([key, value]) => {
      process.env[key] = value;
    });
  });

  afterEach(() => {
    // Clean up environment variables
    Object.keys(mockEnv).forEach((key) => {
      delete process.env[key];
    });
  });

  describe('createClient', () => {
    it('should create a browser client successfully', () => {
      const client = createClient();
      expect(client).toBeDefined();
      expect(client.auth).toBeDefined();
      expect(client.from).toBeDefined();
    });

    it('should throw error when SUPABASE_URL is missing', () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      
      expect(() => createClient()).toThrow('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
    });

    it('should throw error when SUPABASE_ANON_KEY is missing', () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      expect(() => createClient()).toThrow('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
    });
  });

  describe('createServiceRoleClient', () => {
    it('should create a service role client successfully', () => {
      const client = createServiceRoleClient();
      expect(client).toBeDefined();
      expect(client.auth).toBeDefined();
      expect(client.from).toBeDefined();
    });

    it('should throw error when SERVICE_ROLE_KEY is missing', () => {
      delete process.env.SUPABASE_SERVICE_ROLE_KEY;
      
      expect(() => createServiceRoleClient()).toThrow('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
    });
  });
});