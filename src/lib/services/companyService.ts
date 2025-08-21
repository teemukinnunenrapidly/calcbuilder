import { createClient } from '@supabase/supabase-js';
import { Company, ApiResponse } from '@/types';
import { CreateCompanyInput, UpdateCompanyInput, CompanySearchInput } from '@/lib/validations/company';

// Initialize Supabase client
const supabaseUrl = process.env['NEXT_PUBLIC_SUPABASE_URL']!;
const supabaseServiceKey = process.env['SUPABASE_SERVICE_ROLE_KEY']!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export class CompanyService {
  /**
   * Get all companies with pagination
   */
  static async getCompanies(page: number = 1, limit: number = 10): Promise<ApiResponse<Company[]>> {
    try {
      const offset = (page - 1) * limit;

      const { data: companies, error, count } = await supabase
        .from('companies')
        .select('*', { count: 'exact' })
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching companies:', error);
        throw new Error('Failed to fetch companies');
      }

      const totalPages = Math.ceil((count || 0) / limit);

      return {
        success: true,
        data: companies || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          total_pages: totalPages,
          has_next: page < totalPages,
          has_prev: page > 1,
        },
      };
    } catch (error) {
      console.error('CompanyService.getCompanies error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get company by ID
   */
  static async getCompanyById(id: string): Promise<ApiResponse<Company>> {
    try {
      const { data: company, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return {
            success: false,
            error: 'Company not found',
          };
        }
        console.error('Error fetching company:', error);
        throw new Error('Failed to fetch company');
      }

      return {
        success: true,
        data: company,
      };
    } catch (error) {
      console.error('CompanyService.getCompanyById error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Create a new company
   */
  static async createCompany(companyData: CreateCompanyInput): Promise<ApiResponse<Company>> {
    try {
      // Check if slug already exists
      const { data: existingCompany } = await supabase
        .from('companies')
        .select('id')
        .eq('slug', companyData.slug)
        .single();

      if (existingCompany) {
        return {
          success: false,
          error: 'Company with this slug already exists',
        };
      }

      // Create company
      const { data: company, error } = await supabase
        .from('companies')
        .insert({
          ...companyData,
          subscription_tier: 'free',
          subscription_status: 'active',
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating company:', error);
        throw new Error('Failed to create company');
      }

      return {
        success: true,
        data: company,
        message: 'Company created successfully',
      };
    } catch (error) {
      console.error('CompanyService.createCompany error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Update an existing company
   */
  static async updateCompany(id: string, companyData: UpdateCompanyInput): Promise<ApiResponse<Company>> {
    try {
      // Check if company exists
      const { data: existingCompany } = await supabase
        .from('companies')
        .select('id')
        .eq('id', id)
        .single();

      if (!existingCompany) {
        return {
          success: false,
          error: 'Company not found',
        };
      }

      // If slug is being updated, check for uniqueness
      if (companyData.slug) {
        const { data: slugConflict } = await supabase
          .from('companies')
          .select('id')
          .eq('slug', companyData.slug)
          .neq('id', id)
          .single();

        if (slugConflict) {
          return {
            success: false,
            error: 'Company with this slug already exists',
          };
        }
      }

      // Update company
      const { data: company, error } = await supabase
        .from('companies')
        .update({
          ...companyData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating company:', error);
        throw new Error('Failed to update company');
      }

      return {
        success: true,
        data: company,
        message: 'Company updated successfully',
      };
    } catch (error) {
      console.error('CompanyService.updateCompany error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Delete a company
   */
  static async deleteCompany(id: string): Promise<ApiResponse<null>> {
    try {
      // Check if company exists
      const { data: existingCompany } = await supabase
        .from('companies')
        .select('id')
        .eq('id', id)
        .single();

      if (!existingCompany) {
        return {
          success: false,
          error: 'Company not found',
        };
      }

      // Delete company
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting company:', error);
        throw new Error('Failed to delete company');
      }

      return {
        success: true,
        data: null,
        message: 'Company deleted successfully',
      };
    } catch (error) {
      console.error('CompanyService.deleteCompany error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Search companies with filters
   */
  static async searchCompanies(searchParams: CompanySearchInput): Promise<ApiResponse<Company[]>> {
    try {
      const { q, status, tier, page, limit } = searchParams;
      const offset = (page - 1) * limit;

      // Build the query
      let supabaseQuery = supabase
        .from('companies')
        .select('*', { count: 'exact' });

      // Add search filter
      if (q) {
        supabaseQuery = supabaseQuery.or(
          `name.ilike.%${q}%,slug.ilike.%${q}%,domain.ilike.%${q}%`
        );
      }

      // Add status filter
      if (status) {
        supabaseQuery = supabaseQuery.eq('subscription_status', status);
      }

      // Add tier filter
      if (tier) {
        supabaseQuery = supabaseQuery.eq('subscription_tier', tier);
      }

      // Add pagination and ordering
      const { data: companies, error, count } = await supabaseQuery
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error searching companies:', error);
        throw new Error('Failed to search companies');
      }

      const totalPages = Math.ceil((count || 0) / limit);

      return {
        success: true,
        data: companies || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          total_pages: totalPages,
          has_next: page < totalPages,
          has_prev: page > 1,
        },
      };
    } catch (error) {
      console.error('CompanyService.searchCompanies error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get company statistics
   */
  static async getCompanyStats(): Promise<ApiResponse<{
    total: number;
    active: number;
    inactive: number;
    suspended: number;
    byTier: Record<string, number>;
  }>> {
    try {
      // Get total count
      const { count: total } = await supabase
        .from('companies')
        .select('*', { count: 'exact', head: true });

      // Get counts by status
      const { data: statusCounts } = await supabase
        .from('companies')
        .select('subscription_status')
        .in('subscription_status', ['active', 'inactive', 'suspended']);

      // Get counts by tier
      const { data: tierCounts } = await supabase
        .from('companies')
        .select('subscription_tier')
        .in('subscription_tier', ['free', 'starter', 'professional', 'enterprise']);

      // Process status counts
      const statusStats = statusCounts?.reduce((acc, company) => {
        acc[company.subscription_status] = (acc[company.subscription_status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      // Process tier counts
      const tierStats = tierCounts?.reduce((acc, company) => {
        acc[company.subscription_tier] = (acc[company.subscription_tier] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      return {
        success: true,
        data: {
          total: total || 0,
          active: statusStats['active'] || 0,
          inactive: statusStats['inactive'] || 0,
          suspended: statusStats['suspended'] || 0,
          byTier: tierStats,
        },
      };
    } catch (error) {
      console.error('CompanyService.getCompanyStats error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
}
