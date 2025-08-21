// =============================================
// CORE TYPES
// =============================================

export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

// =============================================
// COMPANY & USER TYPES
// =============================================

export interface Company extends BaseEntity {
  name: string;
  slug: string;
  domain?: string;
  logo_url?: string;
  brand_colors: BrandColors;
  settings: CompanySettings;
  subscription_tier: SubscriptionTier;
  subscription_status: SubscriptionStatus;
  domain_verification_status?: 'none' | 'pending' | 'verified' | 'failed' | 'expired';
  domain_verification_id?: string;
  domain_verified_at?: string;
  custom_domain_enabled?: boolean;
  subdomain_enabled?: boolean;
  white_label_enabled?: boolean;
}

export interface BrandColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  border: string;
}

export interface CompanySettings {
  timezone?: string;
  locale?: string;
  currency?: string;
  date_format?: string;
  number_format?: string;
  features?: Record<string, boolean>;
  notification_settings?: {
    email_notifications?: boolean;
    push_notifications?: boolean;
    marketing_emails?: boolean;
    security_alerts?: boolean;
    weekly_reports?: boolean;
    monthly_summaries?: boolean;
  };
  business_hours?: {
    monday?: BusinessDay;
    tuesday?: BusinessDay;
    wednesday?: BusinessDay;
    thursday?: BusinessDay;
    friday?: BusinessDay;
    saturday?: BusinessDay;
    sunday?: BusinessDay;
  };
}

export interface BusinessDay {
  enabled: boolean;
  start?: string;
  end?: string;
}

export type SubscriptionTier = 'free' | 'starter' | 'professional' | 'enterprise';
export type SubscriptionStatus = 'active' | 'inactive' | 'suspended' | 'cancelled';

// Team Management Types
export interface TeamRole extends BaseEntity {
  company_id: string;
  name: string;
  description?: string;
  permissions: string[];
  is_system_role: boolean;
}

export interface TeamMember extends BaseEntity {
  company_id: string;
  user_id: string;
  role_id: string;
  status: TeamMemberStatus;
  permissions: string[];
  invited_by: string;
  invited_at: string;
  joined_at?: string;
  last_active_at?: string;
  // Extended fields for UI
  user?: User;
  role?: TeamRole;
  invited_by_user?: User;
}

export interface TeamInvitation extends BaseEntity {
  company_id: string;
  email: string;
  role_id: string;
  invited_by: string;
  status: InvitationStatus;
  invitation_token: string;
  expires_at: string;
  accepted_at?: string;
  // Extended fields for UI
  role?: TeamRole;
  invited_by_user?: User;
}

export interface TeamPermission extends BaseEntity {
  name: string;
  description?: string;
  category: PermissionCategory;
  resource: string;
  action: PermissionAction;
}

export type TeamMemberStatus = 'active' | 'inactive' | 'pending' | 'suspended';
export type InvitationStatus = 'pending' | 'accepted' | 'expired' | 'cancelled';
export type PermissionCategory = 'company' | 'calculators' | 'leads' | 'analytics' | 'billing' | 'team';
export type PermissionAction = 'create' | 'read' | 'update' | 'delete' | 'manage';

export interface User extends BaseEntity {
  company_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: UserRole;
  avatar_url?: string;
  is_active: boolean;
  last_login_at?: string;
}

export type UserRole = 'admin' | 'member' | 'viewer';

// =============================================
// CALCULATOR TYPES
// =============================================

export interface Calculator extends BaseEntity {
  company_id: string;
  name: string;
  slug: string;
  description?: string;
  status: CalculatorStatus;
  settings: CalculatorSettings;
  theme: CalculatorTheme;
  created_by?: string;
}

export type CalculatorStatus = 'draft' | 'published' | 'archived';

export interface CalculatorSettings {
  allow_anonymous: boolean;
  require_email: boolean;
  require_name: boolean;
  show_progress_bar: boolean;
  enable_save_results: boolean;
  max_submissions_per_day?: number;
  redirect_url?: string;
  success_message?: string;
}

export interface CalculatorTheme {
  primary_color: string;
  secondary_color: string;
  background_color: string;
  text_color: string;
  border_color: string;
  button_style: 'filled' | 'outlined' | 'ghost';
  border_radius: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  font_family: string;
}

// =============================================
// FORM TYPES
// =============================================

export interface FormSection extends BaseEntity {
  calculator_id: string;
  name: string;
  title?: string;
  description?: string;
  order_index: number;
  is_active: boolean;
  conditions: FormConditions;
}

export interface FormField extends BaseEntity {
  section_id: string;
  calculator_id: string;
  field_type: FieldType;
  name: string;
  label: string;
  placeholder?: string;
  help_text?: string;
  is_required: boolean;
  order_index: number;
  validation_rules: ValidationRules;
  options: FieldOptions;
  default_value?: string;
  conditions: FormConditions;
}

export type FieldType =
  | 'text'
  | 'email'
  | 'number'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'textarea'
  | 'date'
  | 'phone'
  | 'slider'
  | 'currency'
  | 'percentage';

export interface ValidationRules {
  min?: number;
  max?: number;
  min_length?: number;
  max_length?: number;
  pattern?: string;
  custom_validation?: string;
}

export interface FieldOptions {
  choices?: Array<{ value: string; label: string }>;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  help_text?: string;
}

export interface FormConditions {
  show_if?: ConditionRule[];
  hide_if?: ConditionRule[];
  required_if?: ConditionRule[];
}

export interface ConditionRule {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
  value: string | number | boolean;
}

// =============================================
// SHORTCODE & FORMULA TYPES
// =============================================

export interface Shortcode extends BaseEntity {
  calculator_id: string;
  name: string;
  code: string;
  formula: string;
  description?: string;
  return_type: 'number' | 'text' | 'boolean' | 'date';
  is_active: boolean;
}

export interface Formula {
  id: string;
  name: string;
  expression: string;
  variables: string[];
  description?: string;
  examples?: string[];
}

// =============================================
// VISUAL ELEMENTS TYPES
// =============================================

export interface VisualElement extends BaseEntity {
  calculator_id: string;
  element_type: ElementType;
  name: string;
  content: ElementContent;
  trigger_conditions: FormConditions;
  position_config: PositionConfig;
  is_active: boolean;
  order_index: number;
}

export type ElementType =
  | 'image'
  | 'modal'
  | 'tooltip'
  | 'info_box'
  | 'progress_bar'
  | 'divider'
  | 'spacer';

export interface ElementContent {
  title?: string;
  text?: string;
  image_url?: string;
  icon?: string;
  style?: Record<string, any>;
  actions?: ElementAction[];
}

export interface ElementAction {
  type: 'button' | 'link' | 'modal';
  label: string;
  action: string;
  style?: Record<string, any>;
}

export interface PositionConfig {
  placement: 'before' | 'after' | 'inside';
  target_field?: string;
  alignment: 'left' | 'center' | 'right';
  margin?: { top: number; right: number; bottom: number; left: number };
}

// =============================================
// EMAIL TEMPLATE TYPES
// =============================================

export interface EmailTemplate extends BaseEntity {
  calculator_id: string;
  template_type: EmailTemplateType;
  name: string;
  subject: string;
  html_content: string;
  text_content?: string;
  variables: string[];
  is_active: boolean;
}

export type EmailTemplateType =
  | 'lead_notification'
  | 'user_results'
  | 'welcome_email'
  | 'reminder_email'
  | 'custom';

// =============================================
// LEAD TYPES
// =============================================

export interface Lead extends BaseEntity {
  calculator_id: string;
  company_id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  form_data: Record<string, any>;
  calculated_results: Record<string, any>;
  source_url?: string;
  user_agent?: string;
  ip_address?: string;
  status: LeadStatus;
  notes?: string;
}

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';

// =============================================
// API RESPONSE TYPES
// =============================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

// =============================================
// FORM SUBMISSION TYPES
// =============================================

export interface FormSubmission {
  calculator_id: string;
  form_data: Record<string, any>;
  metadata: SubmissionMetadata;
}

export interface SubmissionMetadata {
  user_agent: string;
  ip_address: string;
  referrer?: string;
  timestamp: string;
  session_id?: string;
}

export interface CalculationResult {
  shortcode: string;
  value: number | string | boolean;
  unit?: string;
  formatted_value: string;
  calculation_time: number;
}

// =============================================
// AUTHENTICATION TYPES
// =============================================

export interface AuthUser {
  id: string;
  email: string;
  company_id: string;
  role: UserRole;
  permissions: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
  refresh_token: string;
  expires_at: string;
}

// =============================================
// UTILITY TYPES
// =============================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type NonNullableFields<T, K extends keyof T> = T & {
  [P in K]: NonNullable<T[P]>;
};

// =============================================
// EVENT TYPES
// =============================================

export interface AppEvent {
  type: string;
  payload: any;
  timestamp: string;
  user_id?: string;
  session_id?: string;
}

export interface AnalyticsEvent extends AppEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
}

// =============================================
// CONFIGURATION TYPES
// =============================================

export interface AppConfig {
  environment: 'development' | 'staging' | 'production';
  api_url: string;
  app_url: string;
  features: Record<string, boolean>;
  limits: Record<string, number>;
}

export interface FeatureFlags {
  enable_analytics: boolean;
  enable_multi_language: boolean;
  enable_advanced_calculations: boolean;
  enable_lead_scoring: boolean;
  enable_automation: boolean;
}
