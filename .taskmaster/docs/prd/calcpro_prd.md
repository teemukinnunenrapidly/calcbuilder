# Product Requirements Document (PRD)
## CalcBuilder Pro - No-Code Interactive Calculator Platform

### 1. Project Overview

**Product Name:** CalcBuilder Pro - No-Code Interactive Calculator Builder  
**Version:** 1.0  
**Date:** 19.8.2025  
**Product Type:** SaaS Platform for Creating Custom Calculators  
**Target Market:** Businesses needing lead generation calculators without coding

**Example Use Case:** Energiayykkonen uses CalcBuilder Pro to create a heat pump savings calculator that generates qualified leads and automates quote calculations.

### 2. Business Objectives

- **Democratize calculator creation:** Enable non-technical users to build complex calculators
- **Lead generation platform:** Help businesses capture qualified leads through interactive calculators
- **White-label solution:** Fully brandable for each client
- **Multi-industry support:** Adaptable for real estate, energy, finance, insurance, automotive, etc.
- **Rapid deployment:** New calculator live in under 30 minutes

### 3. User Personas

#### 3.1 **Platform Administrator** (CalcBuilder Pro Team)
- Manages platform infrastructure
- Onboards new clients
- Provides templates and support

#### 3.2 **Client Administrator** (e.g., Energiayykkonen Marketing Manager)
- Creates and manages calculators
- Configures formulas and logic
- Reviews leads and analytics
- No coding experience required

#### 3.3 **End User** (e.g., Homeowner)
- Uses the calculator on client's website
- Receives personalized calculations
- Submits contact information for quotes

### 4. Core Features

#### 4.1 Visual Form Builder (No-Code)

**Drag-and-drop interface for creating multi-step forms:**
- **Field Types:**
  - Number inputs (with min/max validation)
  - Dropdowns/Select boxes
  - Radio buttons
  - Checkboxes
  - Sliders
  - Date pickers
  - Text inputs
  - Buttons (for triggering modals/actions)

- **Field Configuration:**
  - Labels and placeholders
  - Validation rules
  - Conditional visibility
  - Help text/tooltips
  - Required/optional settings

**Example Configuration (Heat Pump Calculator):**
```yaml
Section 1: House Information
  Fields:
    - square_meters: 
        type: number
        label: "Heated square meters"
        min: 10
        max: 1000
        required: true
    - height:
        type: dropdown
        options: [2.5m, 3.0m, 3.5m]
        label: "Ceiling height"
    - build_year:
        type: dropdown
        options: ["<1970", "1970-1990", "1991-2010", ">2010"]
        label: "Construction year"
```

#### 4.2 Formula Builder (Shortcode System)

**Visual formula editor with no coding required:**
- Drag-and-drop formula components
- Pre-built mathematical functions
- IF/THEN logic builder
- Variable picker from form fields
- Real-time preview with test values

**Example Shortcode:**
```
Name: {energy_need}
Formula: ({square_meters} × {height} × 17 × 3.2) + ({residents} × 1500)
Unit: kWh
Format: Number with thousand separator
```

**Available Functions:**
- Basic math: +, -, ×, ÷, ^
- Conditionals: IF, THEN, ELSE
- Comparisons: >, <, =, ≥, ≤
- Rounding: ROUND, CEIL, FLOOR
- Financial: PMT, PV, FV, RATE
- Statistical: AVG, MIN, MAX, SUM

#### 4.3 Visual Elements Management

**Types of visual elements:**
- **Static images:** Single image per section
- **Image carousel:** Multiple images with captions
- **Dynamic images:** Change based on input values
- **Infographics:** Charts, gauges, progress bars
- **Videos:** Embedded explanatory videos

**Display modes:**
- **Sidebar:** Shows alongside form (desktop only)
- **Modal:** Opens as popup overlay
- **Inline:** Embedded within form sections

**Example Visual Trigger:**
```yaml
Trigger: When square_meters < 100
Action: Show image "apartment.jpg"
Text overlay: "Compact living solution"

Trigger: When square_meters > 150
Action: Show image "house.jpg"
Text overlay: "Perfect for family homes"
```

#### 4.4 Email Template Builder

**WYSIWYG email editor with shortcode support:**
- Drag-and-drop email components
- Insert any calculated shortcode
- Conditional content blocks
- Multiple templates per calculator
- Preview in different email clients

**Example Email with Shortcodes:**
```html
Dear {{name}},

Your calculated energy need: {energy_need}
Current heating cost: {current_cost}
Heat pump savings: {yearly_savings}
5-year savings: {savings_5y}
10-year savings: {savings_10y}
```

#### 4.5 Multi-Language Support

**Platform-level internationalization:**
- Admin panel available in multiple languages
- Calculator content in any language
- Automatic number/date formatting per locale
- Language switcher for end users

**Supported languages for admin panel:**
- English (default)
- Finnish
- Swedish
- German
- French
- Spanish

### 5. Technical Architecture

#### 5.1 Frontend Stack
- **Framework:** React.js + TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui (Radix UI + Tailwind)
- **Form Handling:** React Hook Form
- **Validation:** Zod
- **Drag & Drop:** @dnd-kit
- **Data Visualization:** Tremor
- **Internationalization:** react-i18next
- **Analytics:** Plausible (privacy-friendly)

#### 5.2 Backend Stack
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Realtime:** Supabase Realtime subscriptions
- **Storage:** Supabase Storage (images, documents)
- **API:** Supabase auto-generated REST API + Edge Functions
- **Email Service:** Resend
- **Error Tracking:** Sentry

#### 5.3 Hosting & Infrastructure
- **Hosting:** Hetzner Cloud
- **Server Type:** CX21 (2 vCPU, 4GB RAM) - production
- **Location:** Helsinki, Finland (HEL1-DC2)
- **OS:** Ubuntu 22.04 LTS
- **Containerization:** Docker + Docker Compose
- **Reverse Proxy:** Nginx
- **SSL Certificates:** Let's Encrypt (automatic renewal)
- **CDN:** Cloudflare (static assets)

#### 5.4 Database Schema

```sql
-- Companies/Clients
CREATE TABLE companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  domain VARCHAR(255),
  logo_url TEXT,
  primary_color VARCHAR(7),
  secondary_color VARCHAR(7),
  language VARCHAR(5) DEFAULT 'en',
  timezone VARCHAR(50) DEFAULT 'UTC',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Calculators
CREATE TABLE calculators (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  settings JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(company_id, slug)
);

-- Form Sections
CREATE TABLE form_sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  calculator_id UUID REFERENCES calculators(id) ON DELETE CASCADE,
  title VARCHAR(200),
  description TEXT,
  visual_element_id UUID REFERENCES visual_elements(id),
  hide_visual_on_mobile BOOLEAN DEFAULT false,
  order_index INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Form Fields
CREATE TABLE form_fields (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_id UUID REFERENCES form_sections(id) ON DELETE CASCADE,
  field_type VARCHAR(50), -- text, number, select, checkbox, button, etc.
  name VARCHAR(100) NOT NULL,
  label JSONB, -- {"en": "Square meters", "fi": "Neliöt"}
  placeholder JSONB,
  required BOOLEAN DEFAULT false,
  validation_rules JSONB,
  options JSONB, -- for select/radio fields
  shortcode_triggers TEXT[], -- array of shortcode IDs
  visual_element_id UUID REFERENCES visual_elements(id),
  hide_visual_on_mobile BOOLEAN DEFAULT false,
  order_index INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shortcodes (Formulas)
CREATE TABLE shortcodes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  calculator_id UUID REFERENCES calculators(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  formula TEXT NOT NULL,
  variables JSONB,
  formatting JSONB,
  conditions JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(calculator_id, name)
);

-- Visual Elements
CREATE TABLE visual_elements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id),
  element_id VARCHAR(50), -- User-friendly ID: VIS001
  name VARCHAR(200),
  display_type VARCHAR(20), -- 'sidebar' or 'modal'
  content_type VARCHAR(50), -- image, carousel, infographic, video
  config JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leads
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  calculator_id UUID REFERENCES calculators(id),
  form_data JSONB, -- All form inputs
  calculated_values JSONB, -- All shortcode results
  contact_info JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email Templates
CREATE TABLE email_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  calculator_id UUID REFERENCES calculators(id),
  name VARCHAR(255),
  subject JSONB, -- {"en": "Your calculation", "fi": "Laskelmasi"}
  body_html TEXT,
  body_text TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 6. Admin Panel Features

#### 6.1 Dashboard
- Total calculators created
- Total leads generated
- Conversion rates
- Most popular calculators
- Recent activity feed

#### 6.2 Calculator Builder (No-Code Interface)

**Step-by-step wizard:**
1. **Basic Info:** Name, description, URL slug
2. **Form Builder:** Drag-and-drop fields and sections
3. **Formula Setup:** Create calculations with visual editor
4. **Visual Design:** Add images and styling
5. **Email Configuration:** Set up automated emails
6. **Embed/Publish:** Generate embed code or standalone URL

#### 6.3 Shortcode Manager

**Visual formula editor interface:**
```
┌────────────────────────────────────────────────────┐
│  Create New Shortcode                              │
├────────────────────────────────────────────────────┤
│  Name: [energy_need_______________]                │
│                                                    │
│  Formula Builder:                                  │
│  ┌──────────────────────────────────────────────┐ │
│  │  [square_meters] × [height] × [17] × [3.2]   │ │
│  │              +                                │ │
│  │  [residents] × [1500]                        │ │
│  └──────────────────────────────────────────────┘ │
│                                                    │
│  Available Variables:                              │
│  [square_meters] [height] [residents] [build_year] │
│                                                    │
│  Functions: [+] [-] [×] [÷] [IF] [ROUND]          │
│                                                    │
│  Test Values:                                      │
│  square_meters: [150] height: [2.5] residents: [4] │
│                                                    │
│  Result Preview: 26,400 kWh                        │
│                                                    │
│  [Save Shortcode] [Test] [Cancel]                  │
└────────────────────────────────────────────────────┘
```

#### 6.4 Lead Management
- View all leads in searchable table
- Export to CSV/Excel
- Filter by date, calculator, values
- Email leads directly from panel
- Integration with CRM systems

#### 6.5 Template Library

**Pre-built calculator templates:**
- **Energy:** Solar panels, heat pumps, insulation
- **Real Estate:** Mortgage, rent vs buy, affordability
- **Automotive:** Loan, lease vs buy, fuel savings
- **Insurance:** Life, health, property coverage
- **Finance:** Investment returns, retirement, savings
- **E-commerce:** Shipping, bulk discounts, ROI

### 7. WordPress Integration

#### 7.1 Embedding Options

**Method 1: Dedicated Page**
```php
// WordPress page template
<div id="calculator-root" 
     data-calculator="heat-pump-savings"
     data-company="energiayykkonen">
</div>
<script src="https://app.calcbuilder.pro/embed.js"></script>
```

**Method 2: Shortcode**
```php
[calcbuilder id="heat-pump-savings"]
```

**Method 3: WordPress Plugin**
- One-click installation
- Automatic calculator sync
- Gutenberg block support

#### 7.2 Display Modes
- **Full Page:** Calculator takes entire content area
- **Inline:** Embedded within content
- **Modal:** Opens in popup
- **Sidebar Widget:** Compact version

### 8. Security & Compliance

#### 8.1 GDPR Compliance

**Privacy features:**
- Cookie consent management
- Right to access data
- Right to deletion
- Data portability
- Automatic anonymization after retention period

**Cookie Banner Implementation:**
```typescript
interface CookieConsent {
  necessary: boolean; // Always true
  analytics: boolean;
  marketing: boolean;
  timestamp: Date;
  ip_anonymized: boolean;
}
```

#### 8.2 Input Validation & XSS Protection

**Multi-layer validation:**
```typescript
// Frontend validation with Zod
const fieldSchema = z.object({
  square_meters: z.number()
    .min(10, 'Minimum 10 m²')
    .max(1000, 'Maximum 1000 m²'),
  email: z.string().email('Invalid email'),
  name: z.string()
    .min(2, 'Too short')
    .regex(/^[a-zA-Z\s\-']+$/, 'Invalid characters')
});

// Sanitization with DOMPurify
const sanitized = DOMPurify.sanitize(userInput);

// SQL injection prevention via parameterized queries
const { data } = await supabase
  .from('leads')
  .insert({ 
    form_data: sanitized,
    calculator_id: uuid 
  });
```

#### 8.3 Rate Limiting

**API protection:**
```typescript
const rateLimits = {
  calculations: { max: 100, window: '1h' },
  lead_submission: { max: 10, window: '1h' },
  api_general: { max: 1000, window: '1h' }
};
```

### 9. Testing Strategy

#### 9.1 E2E Testing (Playwright)

**Test scenarios:**
```typescript
test.describe('Calculator Creation Flow', () => {
  test('Create calculator without coding', async ({ page }) => {
    // Login as admin
    await page.goto('/admin');
    await login(page, 'admin@example.com', 'password');
    
    // Create new calculator
    await page.click('[data-testid="new-calculator"]');
    
    // Drag and drop fields
    await page.dragAndDrop(
      '[data-testid="field-number"]',
      '[data-testid="form-canvas"]'
    );
    
    // Configure field
    await page.fill('[name="field.label"]', 'Square Meters');
    await page.fill('[name="field.name"]', 'square_meters');
    
    // Create formula
    await page.click('[data-testid="add-shortcode"]');
    await page.fill('[name="shortcode.name"]', 'energy_need');
    
    // Test calculator
    await page.click('[data-testid="preview"]');
    await page.fill('[name="square_meters"]', '150');
    
    // Verify calculation
    await expect(page.locator('[data-testid="result"]'))
      .toContainText('22,000');
  });
});
```

#### 9.2 Performance Testing

**Performance budgets:**
```javascript
{
  bundles: {
    main: { maxSize: '150KB' },
    vendor: { maxSize: '200KB' },
    admin: { maxSize: '300KB' }
  },
  metrics: {
    FCP: 1500,  // First Contentful Paint
    LCP: 2500,  // Largest Contentful Paint
    TTI: 3500,  // Time to Interactive
    CLS: 0.1,   // Cumulative Layout Shift
  }
}
```

### 10. Localization

#### 10.1 System Languages

**Admin panel languages:**
```json
{
  "languages": ["en", "fi", "sv", "de", "fr", "es"],
  "default": "en",
  "fallback": "en"
}
```

**Calculator content:**
- Can be created in any language
- Multi-language support per calculator
- Automatic number/date formatting

#### 10.2 Translation Management

```typescript
// i18n configuration
{
  "calculator": {
    "title": {
      "en": "Savings Calculator",
      "fi": "Säästölaskuri",
      "sv": "Sparekalkylator"
    },
    "buttons": {
      "next": {
        "en": "Next",
        "fi": "Seuraava",
        "sv": "Nästa"
      }
    }
  }
}
```

### 11. Pricing & Deployment Models

#### 11.1 SaaS Pricing Tiers

**Starter:** €49/month
- 1 calculator
- 500 leads/month
- Basic templates
- Email support

**Professional:** €149/month
- 5 calculators
- 5,000 leads/month
- All templates
- Custom branding
- Priority support

**Enterprise:** €499/month
- Unlimited calculators
- Unlimited leads
- White label
- API access
- Dedicated support

#### 11.2 Deployment Options

**Option 1: Fully Hosted (SaaS)**
- calculator.company.calcbuilder.pro
- Zero setup required
- Automatic updates

**Option 2: Custom Domain**
- calculator.company.com
- Full branding control
- SSL included

**Option 3: Self-Hosted (Enterprise)**
- On-premise deployment
- Full source code access
- Installation support

### 12. Success Metrics

#### 12.1 Platform KPIs
- Number of active calculators
- Total leads generated
- Average conversion rate
- Customer retention rate
- Time to first calculator (onboarding)

#### 12.2 Calculator Performance Metrics
- Completion rate
- Drop-off points
- Average time to complete
- Device breakdown (mobile/desktop)
- Most used features

### 13. Roadmap

#### Phase 1: MVP (Month 1-2)
- ✅ Basic form builder
- ✅ Simple formula editor
- ✅ Lead capture
- ✅ Email notifications
- ✅ WordPress embed

#### Phase 2: Advanced Features (Month 3-4)
- ✅ Visual elements system
- ✅ Advanced formulas
- ✅ Multi-language support
- ✅ Template library
- ✅ Analytics dashboard

#### Phase 3: Enterprise Features (Month 5-6)
- API access
- Webhook integrations
- Advanced permissions
- Custom functions
- A/B testing

#### Phase 4: AI Enhancement (Month 7+)
- AI-powered formula suggestions
- Automatic optimization
- Predictive analytics
- Smart templates

### 14. Example Use Case: Heat Pump Calculator

**Company:** Energiayykkonen  
**Industry:** Energy/HVAC  
**Goal:** Generate qualified leads for heat pump sales

**Calculator Configuration:**
1. **Form Sections:**
   - House information (size, age, current heating)
   - Energy consumption
   - Government subsidies
   - Contact information

2. **Formulas Created:**
   - `{energy_need}`: Annual energy requirement
   - `{current_cost}`: Current heating cost
   - `{heat_pump_cost}`: Heat pump operating cost
   - `{yearly_savings}`: Annual savings
   - `{payback_time}`: ROI period

3. **Visual Elements:**
   - House type images based on size
   - Savings comparison chart
   - CO2 reduction infographic

4. **Email Template:**
   - Personalized savings report
   - All calculations included
   - Call-to-action for consultation

**Results:**
- 150+ qualified leads/month
- 23% conversion rate
- €2,100 average savings shown
- 45% email open rate

### 15. Technical Specifications

#### 15.1 Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS 14+, Android 10+)

#### 15.2 Performance Requirements
- Page load: <2 seconds
- Calculation response: <100ms
- API response: <200ms
- 99.9% uptime SLA

#### 15.3 Scalability
- Support 10,000+ concurrent users
- 1M+ calculations per month
- 100GB+ storage per client
- Auto-scaling infrastructure

### 16. Support & Documentation

#### 16.1 Documentation
- Getting started guide
- Video tutorials
- API documentation
- Template library docs
- Best practices guide

#### 16.2 Support Channels
- In-app chat support
- Email support
- Knowledge base
- Community forum
- Monthly webinars

### 17. UI/UX Design Specifications

#### 17.1 Design Principles & Strategy

##### Visual Identity & Core Values

**Brand Positioning:** Professional, accessible, and empowering no-code platform

**Core Values:**
- **Simplicity:** Complex functionality made intuitive
- **Accessibility:** Usable by non-technical marketing professionals
- **Trust:** Enterprise-grade reliability with friendly approachability
- **Efficiency:** Rapid calculator creation and deployment

**Design Philosophy:**
- **Progressive Disclosure:** Show complexity only when needed
- **Visual Hierarchy:** Clear information prioritization
- **Consistency:** Predictable patterns across all interfaces
- **Feedback-Rich:** Immediate visual confirmation of all actions

##### User-Centered Approach

**Primary Design Methodology:** Jobs-to-be-Done (JTBD) Framework
- **Functional Job:** Create professional calculators without coding
- **Emotional Job:** Feel confident and empowered in technical tasks
- **Social Job:** Deliver impressive results to stakeholders

#### 17.2 User Research & Personas

##### Primary Personas

**Persona 1: Sarah Chen - Marketing Manager**
- **Demographics:** 32, Marketing Manager at mid-size company
- **Technical Proficiency:** Medium (comfortable with Canva, HubSpot, basic HTML)
- **Goals:** Create professional calculators, avoid dev dependency, deliver quickly
- **Pain Points:** Intimidated by technical interfaces, needs confidence
- **Motivations:** Career advancement, time efficiency, professional credibility

**Persona 2: Mike Rodriguez - Agency Owner**
- **Demographics:** 45, Digital Agency Owner serving multiple clients
- **Technical Proficiency:** High (familiar with multiple platforms, some coding)
- **Goals:** Efficiently create calculators for multiple clients, white-label solutions
- **Pain Points:** Context switching, managing versions, training team
- **Motivations:** Business growth, client satisfaction, operational efficiency

**Persona 3: Lisa Korhonen - Energy Consultant (End User Context)**
- **Demographics:** 28, Works at Energiayykkonen
- **Technical Proficiency:** Low-Medium (uses basic business software)
- **Goals:** Quickly assess calculator results for client consultations
- **Pain Points:** Complex interfaces, uncertainty about accuracy
- **Usage Context:** Often during client meetings, needs quick results, mobile usage

#### 17.3 Information Architecture

##### Client Admin Panel Structure

```
├─ Sidebar Navigation (Left, 240px)
│  ├── 📊 Dashboard
│  ├── 🧮 Calculators
│  │   ├── All Calculators
│  │   ├── Templates
│  │   └── Archived
│  ├── 📐 Shortcodes
│  │   ├── All Formulas
│  │   ├── Functions Library
│  │   └── Test Environment
│  ├── 🎨 Visual Elements
│  │   ├── Image Gallery
│  │   ├── Infographics
│  │   └── Videos
│  ├── 📧 Email Templates
│  ├── 📈 Leads & Analytics
│  │   ├── All Leads
│  │   ├── Analytics
│  │   └── Export Data
│  ├── ⚙️ Settings
│  │   ├── Company Profile
│  │   ├── Branding
│  │   ├── Integrations
│  │   └── Team Management
│  └── 💬 Help & Support
└─ Main Content Area (Responsive)
```

##### Content Hierarchy Principles

- **Level 1:** Primary navigation (Dashboard, Calculators, etc.)
- **Level 2:** Section-specific tools and filters
- **Level 3:** Individual items and detailed views
- **Level 4:** Properties and configuration options

##### Search & Filtering Strategy

**Global Search:** Top navigation bar with intelligent suggestions
- Searches across calculators, formulas, leads, and documentation
- Recent items and quick actions
- Keyboard shortcuts (Cmd/Ctrl + K)

**Contextual Filters:**
- Calculator status (Active, Draft, Archived)
- Date ranges with smart presets
- Lead source and conversion status
- Template categories and industries

#### 17.4 User Flows & Journeys

##### Core User Flow 1: Creating First Calculator (New User)

```
Onboarding → Template Selection → Basic Setup → Form Builder → 
Formula Creation → Preview & Test → Publish → Success State
```

**Key UX Considerations:**
- Progressive onboarding with contextual tooltips
- Template preview with live examples
- Undo/redo functionality throughout
- Auto-save with visual indicators
- Clear escape routes at each step

##### Core User Flow 2: Form Builder Experience

```
Field Selection → Drag & Drop → Configuration Panel → 
Validation Setup → Preview → Section Navigation
```

**Interaction Details:**
- Visual field library with descriptions
- Ghost preview during drag operations
- Side panel configuration with real-time preview
- One-click field duplication
- Keyboard shortcuts for power users

##### Core User Flow 3: Formula Creation (Non-Technical User)

```
Formula Intent → Variable Selection → Visual Builder → 
Test with Sample Data → Formatting Options → Save & Apply
```

**UX Innovations:**
- Natural language formula descriptions
- Visual formula builder with drag-and-drop
- Instant calculation preview with test values
- Error prevention with smart suggestions
- Formula templates for common calculations

##### Error Handling & Recovery Flows

**Validation Errors:**
- Inline validation with helpful suggestions
- Error summary at form level
- Clear recovery steps with examples

**System Errors:**
- Graceful degradation with offline capability
- Auto-recovery with progress preservation
- Clear escalation paths to support

#### 17.5 Visual Design System

##### Color Palette

```css
/* CalcBuilder Pro Brand Colors */
--primary-blue: #2563eb;        /* Professional, trustworthy */
--primary-blue-light: #3b82f6;
--primary-blue-dark: #1d4ed8;

/* Secondary Colors */
--emerald: #10b981;             /* Success, positive actions */
--emerald-light: #34d399;
--emerald-dark: #059669;

/* Accent Colors */
--amber: #f59e0b;               /* Warnings, highlights */
--rose: #f43f5e;                /* Errors, destructive actions */

/* Neutral Palette */
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-400: #9ca3af;
--gray-500: #6b7280;
--gray-600: #4b5563;
--gray-700: #374151;
--gray-800: #1f2937;
--gray-900: #111827;

/* Client Example: Energiayykkonen */
--client-primary: #22c55e;      /* Energy green */
--client-secondary: #1f2937;    /* Professional dark */
--client-accent: #fbbf24;       /* Energy yellow */
```

##### Typography System

```css
/* Font Stack */
--font-primary: 'Inter', system-ui, -apple-system, sans-serif;
--font-mono: 'JetBrains Mono', 'Monaco', 'Courier New', monospace;

/* Type Scale */
--text-4xl: 2.25rem;   /* H1 */
--text-3xl: 1.875rem;  /* H2 */
--text-2xl: 1.5rem;    /* H3 */
--text-xl: 1.25rem;    /* H4 */
--text-lg: 1.125rem;   /* H5 */
--text-base: 1rem;     /* Body */
--text-sm: 0.875rem;   /* Small */
--text-xs: 0.75rem;    /* Caption */
```

##### Spacing & Layout Grid

```css
/* 8pt Grid System */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */

/* Layout Containers */
--container-sm: 640px;    /* Forms, settings */
--container-md: 768px;    /* Content pages */
--container-lg: 1024px;   /* Dashboards */
--container-xl: 1280px;   /* Wide layouts */
--container-2xl: 1536px;  /* Max application width */
```

##### Iconography Strategy

- **Icon Library:** Lucide React (consistent with tech stack)
- **Icon Sizes:** 16px (inline), 20px (UI), 24px (prominent), 32px (large)
- **Style Guidelines:** 2px stroke width, rounded line caps, functional over decorative

#### 17.6 Responsive Design Strategy

##### Breakpoint Strategy (Mobile-First)

```css
/* Base styles: 320px+ */

@media (min-width: 640px) {   /* sm: Tablet portrait */
  /* Enhanced layout, larger touch targets */
}

@media (min-width: 768px) {   /* md: Tablet landscape */
  /* Sidebar introduction, multi-column layouts */
}

@media (min-width: 1024px) {  /* lg: Desktop */
  /* Full sidebar, advanced features visible */
}

@media (min-width: 1280px) {  /* xl: Large desktop */
  /* Optimal layout with side panels */
}
```

##### Layout Patterns

**Mobile Layout (< 768px)**
- Bottom navigation for main sections
- Collapsible sidebar (overlay)
- Stack-based form builder
- Touch-optimized interactions

**Tablet Layout (768px - 1024px)**
- Side navigation drawer
- Two-column form builder
- Larger touch targets
- Contextual panels

**Desktop Layout (1024px+)**
- Persistent sidebar navigation
- Three-column layouts where appropriate
- Hover states and tooltips
- Keyboard shortcuts

##### Touch vs. Mouse Interactions

**Touch-First Design:**
- Minimum 44px touch targets
- Gesture support for drag-and-drop
- Swipe navigation where appropriate
- Large, clear buttons

**Mouse Enhancement:**
- Hover states for feedback
- Context menus for power users
- Precise drag-and-drop interactions
- Keyboard shortcuts overlay

#### 17.7 Accessibility Requirements

##### WCAG 2.1 AA Compliance

**Color & Contrast:**
- Normal text: 4.5:1 contrast ratio minimum
- Large text: 3:1 contrast ratio minimum
- UI components: 3:1 contrast ratio for borders/states
- Color independence: No information conveyed through color alone

**Typography & Readability:**
- Minimum font size: 16px for body text
- Line height: 1.5x minimum for body text
- Text scaling: Zoom up to 200% without horizontal scrolling

##### Keyboard Navigation

```typescript
const keyboardShortcuts = {
  'Cmd/Ctrl + K': 'Global search',
  'Cmd/Ctrl + N': 'New calculator',
  'Cmd/Ctrl + S': 'Save current work',
  'Cmd/Ctrl + Z': 'Undo',
  'Cmd/Ctrl + Y': 'Redo',
  'Tab': 'Next focusable element',
  'Shift + Tab': 'Previous focusable element',
  'Enter': 'Activate button/link',
  'Space': 'Toggle checkbox/select',
  'Escape': 'Close modal/cancel action',
  'Arrow keys': 'Navigate lists/menus'
};
```

##### Screen Reader Support

```html
<!-- Semantic HTML Structure Example -->
<section aria-labelledby="house-info-heading">
  <h2 id="house-info-heading">House Information</h2>
  
  <fieldset>
    <legend>Basic Details</legend>
    
    <label for="square-meters">
      Heated square meters
      <span aria-describedby="square-meters-help">(Required)</span>
    </label>
    <input 
      id="square-meters" 
      type="number" 
      min="10" 
      max="1000"
      aria-describedby="square-meters-help square-meters-error"
      aria-invalid="false"
    />
    <div id="square-meters-help" class="help-text">
      Enter the total heated area of your home
    </div>
    <div id="square-meters-error" class="error-text" aria-live="polite">
      <!-- Error messages inserted here -->
    </div>
  </fieldset>
</section>
```

##### Focus Management

```css
/* Focus Indicators */
:focus-visible {
  outline: 2px solid var(--primary-blue);
  outline-offset: 2px;
  border-radius: 4px;
}
```

- **Focus Trapping:** Modal dialogs and dropdowns maintain focus within bounds
- **Focus Restoration:** Return focus to triggering element after modal close

#### 17.8 Interactive Components

##### Form Elements & Validation

```css
/* Input States */
.input {
  @apply border border-gray-300 rounded-lg px-3 py-2 
         focus:ring-2 focus:ring-primary-blue focus:border-primary-blue
         transition-colors duration-200;
}

.input--error {
  @apply border-rose-500 focus:ring-rose-500;
}

.input--success {
  @apply border-emerald-500 focus:ring-emerald-500;
}
```

**Validation Strategy:**
- Real-time validation (debounced)
- Inline messages adjacent to form fields
- Summary validation at form level
- Progressive enhancement (works without JavaScript)

##### Navigation Patterns

```typescript
interface NavigationItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
  badge?: number;
  children?: NavigationItem[];
  isActive?: boolean;
  isCollapsed?: boolean;
}
```

**Interaction Behaviors:**
- Hover states: Subtle background color change
- Active states: Left border indicator + bold text
- Badge notifications: Unread count for leads/notifications
- Collapsible sections: Smooth accordion animation

##### Feedback Mechanisms

**Loading States:**
```typescript
<Button loading={isSubmitting} disabled={isSubmitting}>
  {isSubmitting ? 'Saving...' : 'Save Calculator'}
</Button>
```

**Success States:**
- Toast notifications: Non-blocking success messages
- Inline confirmations: Green checkmark with message
- Page-level success: Full-page success state for major actions

**Error Handling:**
```typescript
interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
  errorCode?: string;
  retryAction?: () => void;
}
```

##### Micro-Interactions

**Drag & Drop Feedback:**
```css
.draggable {
  cursor: grab;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.draggable:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.draggable--dragging {
  transform: rotate(5deg);
  opacity: 0.8;
  cursor: grabbing;
}

.drop-zone--active {
  border-color: var(--primary-blue);
  background-color: rgba(37, 99, 235, 0.05);
}
```

**Button Interactions:**
```css
.button:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.button:active {
  transform: translateY(0);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}
```

#### 17.9 Performance & Technical Considerations

##### Core Web Vitals Targets

```javascript
const performanceTargets = {
  FCP: { good: 1800, needsWork: 3000 },      // First Contentful Paint
  LCP: { good: 2500, needsWork: 4000 },      // Largest Contentful Paint
  FID: { good: 100, needsWork: 300 },        // First Input Delay
  CLS: { good: 0.1, needsWork: 0.25 },       // Cumulative Layout Shift
  TTI: { good: 3500, needsWork: 5000 }       // Time to Interactive
};
```

##### Image Optimization Strategy

```html
<!-- Responsive Images -->
<picture>
  <source 
    media="(min-width: 768px)" 
    srcset="hero-desktop.webp 1x, hero-desktop@2x.webp 2x"
    type="image/webp"
  />
  <img 
    src="hero-mobile.jpg" 
    srcset="hero-mobile.webp 1x, hero-mobile@2x.webp 2x"
    alt="Heat pump installation"
    loading="lazy"
    width="400" 
    height="300"
  />
</picture>
```

##### Component Lazy Loading

```typescript
// React.lazy for non-critical components
const FormulaBuilder = lazy(() => import('./components/FormulaBuilder'));
const AnalyticsDashboard = lazy(() => import('./components/Analytics'));
```

#### 17.10 shadcn/ui Component Implementation Requirements

##### Documentation Verification Protocol

**MANDATORY:** Before implementing any shadcn/ui component, developers must:

1. **Execute demo_tool call** with shadcn MCP server to verify:
   - Current component API and props
   - Official implementation patterns
   - Accessibility features and requirements
   - Recent updates or breaking changes

2. **Documentation Check Examples:**
   ```bash
   # Required demo_tool calls before implementation
   demo_tool shadcn/ui Button component documentation
   demo_tool shadcn/ui Form component implementation guide
   demo_tool shadcn/ui Dialog accessibility requirements
   demo_tool shadcn/ui Select component API reference
   ```

##### Component Implementation Standards

```typescript
// REQUIRED: Check documentation first with demo_tool
// demo_tool shadcn/ui [ComponentName] documentation

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Follow official patterns from documentation
const CalculatorButton = ({ 
  variant = "default",
  size = "default", 
  className,
  children,
  ...props 
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn("calculator-button", className)}
      {...props}
    >
      {children}
    </Button>
  )
}
```

##### Pre-Implementation Checklist

- [ ] **demo_tool call completed** for component documentation
- [ ] **Official props verified** against current documentation
- [ ] **Accessibility features confirmed** per shadcn/ui standards
- [ ] **Component composition patterns** understood from docs
- [ ] **Styling approach validated** (CSS variables, className patterns)
- [ ] **Form integration patterns** checked if applicable

##### Priority Components for Documentation Verification

**Form Components (Critical):**
- Input, Button, Select, Checkbox, RadioGroup, Label, Form

**Layout Components:**
- Sheet, Dialog, Card, Tabs, Accordion

**Feedback Components:**
- Alert, Toast, Badge, Progress, Skeleton

**Navigation Components:**
- NavigationMenu, Breadcrumb, Command

##### Quality Assurance for shadcn/ui Implementation

**Code Review Checklist:**
- [ ] Documentation verified with demo_tool call evidence
- [ ] Props match official API from current documentation
- [ ] Accessibility attributes implemented per shadcn/ui standards
- [ ] Styling follows official patterns (CSS variables, utility classes)
- [ ] TypeScript interfaces match shadcn/ui component types
- [ ] Event handling follows official component patterns

### 18. Testing & Validation Strategy

#### 18.1 Usability Testing Plan

##### Testing Phases

**Phase 1: Concept Testing (Pre-Development)**
- **Method:** Interactive prototypes with 8-10 target users
- **Focus:** Information architecture, core workflows
- **Success Metrics:** Task completion rate >80%, satisfaction score >4/5

**Phase 2: Alpha Testing (MVP Features)**
- **Method:** Moderated remote testing with 15 users
- **Focus:** Form builder usability, formula creation
- **Success Metrics:** Time to create first calculator <30 minutes

**Phase 3: Beta Testing (Full Feature Set)**
- **Method:** Unmoderated testing with 50+ real users
- **Focus:** End-to-end workflows, advanced features
- **Success Metrics:** Feature adoption rates, support ticket volume

##### Testing Scenarios

```typescript
interface TestingScenario {
  id: string;
  title: string;
  description: string;
  userType: 'novice' | 'intermediate' | 'expert';
  estimatedTime: number;
  successCriteria: string[];
}

const coreScenarios: TestingScenario[] = [
  {
    id: 'first-calculator',
    title: 'Create Your First Calculator',
    description: 'Use a template to create a simple savings calculator',
    userType: 'novice',
    estimatedTime: 20,
    successCriteria: [
      'Completes calculator creation without assistance',
      'Successfully tests calculator with sample data',
      'Understands how to embed calculator'
    ]
  }
];
```

#### 18.2 A/B Testing Opportunities

**High-Impact Test Areas:**
- Onboarding flow: Template selection vs. blank start
- Form builder: List view vs. canvas view for field selection
- Formula creation: Visual builder vs. text-based input
- Navigation: Sidebar vs. top navigation for main sections

**Testing Infrastructure:**
```typescript
const useABTest = (testId: string, variants: string[]) => {
  const [variant, setVariant] = useState<string>('');
  
  useEffect(() => {
    const assignedVariant = assignVariant(testId, variants);
    setVariant(assignedVariant);
    
    analytics.track('ab_test_assigned', {
      testId,
      variant: assignedVariant,
      userId: user.id
    });
  }, [testId]);
  
  return variant;
};
```

#### 18.3 Performance Testing Criteria

```javascript
// Lighthouse CI configuration
const lighthouseConfig = {
  ci: {
    collect: {
      numberOfRuns: 3
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.8 }],
        'categories:seo': ['error', { minScore: 0.8 }]
      }
    }
  }
};
```

#### 18.4 Accessibility Testing Protocol

**Automated Testing Tools:**
- axe-core: Integrated into development workflow
- Lighthouse accessibility audit: CI/CD pipeline
- Color contrast analyzers: Design system validation

**Manual Testing Checklist:**
```typescript
const accessibilityChecklist = {
  keyboardNavigation: [
    'All interactive elements reachable via keyboard',
    'Focus indicators clearly visible',
    'Tab order logical and intuitive',
    'Modal focus trapping works correctly'
  ],
  screenReader: [
    'Content structure makes sense when read linearly',
    'Form labels and descriptions properly associated',
    'Dynamic content changes announced appropriately',
    'Error messages clearly communicated'
  ],
  visualDesign: [
    'Text meets contrast ratio requirements',
    'UI components have sufficient contrast',
    'Information not conveyed through color alone',
    'Text scales properly up to 200%'
  ]
};
```

### 19. Implementation Guidelines

#### 19.1 Development Handoff Process

1. **Design System First:** Establish component library before building features
2. **shadcn/ui Documentation Verification:** Mandatory demo_tool calls for all component implementations
3. **Progressive Implementation:** Start with core components, build complexity gradually
4. **Accessibility Integration:** Include accessibility requirements in all component definitions
5. **Performance Budgets:** Enforce performance metrics in CI/CD pipeline
6. **User Testing Integration:** Regular testing cycles throughout development

#### 19.2 Quality Assurance Checkpoints

- **Component Level:** shadcn/ui compliance verification, accessibility, performance, visual regression testing
- **Feature Level:** User flow testing, cross-browser compatibility
- **System Level:** Integration testing, performance monitoring
- **Release Level:** Full usability testing, stakeholder sign-off

### 20. Conclusion

CalcBuilder Pro democratizes the creation of interactive calculators, enabling businesses to generate qualified leads without any coding knowledge. With its intuitive drag-and-drop interface, powerful formula builder, and comprehensive feature set, it serves as a complete solution for businesses across all industries.

The platform's white-label capabilities, multi-language support, and enterprise-grade security make it suitable for businesses of all sizes, from startups to large corporations. The modular architecture ensures easy customization and scalability, while the no-code approach makes it accessible to marketing teams without technical dependencies.



## Implementation Order & Timeline

### Development Phases
**Week 1-2:** Part 1 (Core Infrastructure)
- Backend setup, database, Docker, CI/CD
- DevOps foundation and hosting

**Week 3-4:** Part 2 (Admin Panel) + Part 5 (Security - partial)
- User management, dashboard, basic security
- Authentication and authorization

**Week 5-6:** Part 3 (Calculator Builder)
- Core calculator engine, form builder
- Formula editor and visual elements

**Week 7-8:** Part 4 (WordPress Integration)
- Plugin development, embedding options
- Frontend components and UI

**Week 9-10:** Part 5 (Security - completion) + Integration Testing
- Security hardening, GDPR compliance
- End-to-end testing and deployment

### Task Generation Strategy
Each part is designed to generate 15-25 discrete tasks when processed by Task Master AI, with clear boundaries and minimal overlap between parts.

### Dependencies & Critical Path
- Part 1 must be completed before Part 2
- Part 2 must be completed before Part 3
- Part 3 must be completed before Part 4
- Part 5 (Security) runs parallel with other parts
- Integration testing requires all parts to be functional