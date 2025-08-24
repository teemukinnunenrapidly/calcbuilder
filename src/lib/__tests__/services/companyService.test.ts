import { CompanyService } from '../../services/companyService';
import { CreateCompanyInput, UpdateCompanyInput } from '../../validations/company';

// Mock the Supabase client
jest.mock('../../supabase', () => ({
  createClient: jest.fn(),
  createServiceRoleClient: jest.fn(),
}));

describe('CompanyService', () => {
  const mockSupabaseClient = {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      range: jest.fn().mockReturnThis(),
      single: jest.fn(),
    })),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCompanies', () => {
    it('should return companies with pagination', async () => {
      const mockCompanies = [
        { id: 1, name: 'Company 1', slug: 'company-1' },
        { id: 2, name: 'Company 2', slug: 'company-2' },
      ];

      mockSupabaseClient.from().single.mockResolvedValue({
        data: mockCompanies,
        error: null,
        count: 2,
      });

      const result = await CompanyService.getCompanies(1, 10);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockCompanies);
      expect(result.pagination).toBeDefined();
      expect(result.pagination?.page).toBe(1);
      expect(result.pagination?.total).toBe(2);
    });

    it('should handle database errors', async () => {
      mockSupabaseClient.from().single.mockResolvedValue({
        data: null,
        error: { message: 'Database error' },
        count: 0,
      });

      const result = await CompanyService.getCompanies();

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('createCompany', () => {
    it('should create a company successfully', async () => {
      const newCompany = {
        name: 'Test Company',
        slug: 'test-company',
        email: 'test@company.com',
      } as CreateCompanyInput;

      const createdCompany = { id: 1, ...newCompany };

      mockSupabaseClient.from().single.mockResolvedValue({
        data: createdCompany,
        error: null,
      });

      const result = await CompanyService.createCompany(newCompany);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(createdCompany);
    });

    it('should handle validation errors', async () => {
      const invalidCompany = {
        // Missing required fields
      } as CreateCompanyInput;

      const result = await CompanyService.createCompany(invalidCompany);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('updateCompany', () => {
    it('should update a company successfully', async () => {
      const companyId = 1;
      const updateData = {
        name: 'Updated Company Name',
      } as UpdateCompanyInput;

      const updatedCompany = { id: companyId, ...updateData };

      mockSupabaseClient.from().single.mockResolvedValue({
        data: updatedCompany,
        error: null,
      });

      const result = await CompanyService.updateCompany(companyId, updateData);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(updatedCompany);
    });
  });

  describe('deleteCompany', () => {
    it('should delete a company successfully', async () => {
      const companyId = 1;

      mockSupabaseClient.from().single.mockResolvedValue({
        data: null,
        error: null,
      });

      const result = await CompanyService.deleteCompany(companyId);

      expect(result.success).toBe(true);
    });

    it('should handle delete errors', async () => {
      const companyId = 999; // Non-existent company

      mockSupabaseClient.from().single.mockResolvedValue({
        data: null,
        error: { message: 'Company not found' },
      });

      const result = await CompanyService.deleteCompany(companyId);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});