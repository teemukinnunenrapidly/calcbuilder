# CalcBuilder Pro

A comprehensive calculator builder platform that allows users to create, customize, and embed interactive calculators in WordPress sites.

## 🚀 Project Overview

CalcBuilder Pro is a multi-tenant SaaS platform that enables businesses to create custom calculators for their websites. The platform provides a drag-and-drop interface for building calculators, advanced formula parsing, and seamless WordPress integration.

## 🏗️ Architecture

- **Frontend**: React.js with TypeScript, Tailwind CSS, and shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Realtime, Storage, Edge Functions)
- **Infrastructure**: Hetzner Cloud with Docker, Nginx, and Cloudflare CDN
- **WordPress Integration**: Shortcodes and embed scripts for easy integration

## 📋 Project Status

- **Total Tasks**: 108
- **Current Status**: All tasks in "pending" status
- **Project Phase**: Planning and setup phase
- **Task Management**: Using Task Master AI for project management

## 🎯 Key Features

### Core Infrastructure
- Multi-tenant architecture with company isolation
- Role-based access control (RBAC)
- Real-time subscriptions and WebSocket support
- Comprehensive API with Edge Functions

### Admin Panel
- Drag-and-drop calculator builder
- User and company management
- Lead tracking and analytics
- Responsive design with mobile optimization

### Calculator Builder
- Visual formula editor with mathematical expression parsing
- Conditional logic and validation rules
- Template system and presets
- Accessibility compliance (WCAG 2.1 AA)

### WordPress Integration
- Shortcode system for easy embedding
- Responsive calculator interface
- Multi-language support (i18n)
- Progressive enhancement strategy

### Security & Compliance
- GDPR compliance framework
- Security headers and XSS protection
- Rate limiting and SQL injection prevention
- Comprehensive security testing

## 🛠️ Technology Stack

### Frontend
- **React.js** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - Component library
- **Radix UI** - Accessible components
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **@dnd-kit** - Drag and drop
- **Tremor** - Analytics components

### Backend & Infrastructure
- **Supabase** - Database, Auth, Realtime, Storage
- **Hetzner Cloud** - Hosting infrastructure
- **Docker** - Containerization
- **Nginx** - Web server
- **Cloudflare** - CDN and security

### Development & Testing
- **ESLint & Prettier** - Code quality
- **Jest** - Unit testing
- **Playwright** - E2E testing
- **K6** - Load testing
- **GitHub Actions** - CI/CD

## 📁 Project Structure

```
E1saasto/
├── .taskmaster/           # Task Master AI project files
│   ├── docs/             # Project documentation and PRDs
│   ├── tasks/            # Generated task files
│   ├── config.json       # Task Master configuration
│   └── templates/        # Task Master templates
├── .cursor/              # Cursor IDE configuration
├── README.md             # This file
├── .gitignore            # Git ignore rules
└── [Future project files]
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git
- Docker (for local development)
- Supabase account
- Hetzner Cloud account

### Development Setup
1. Clone the repository
2. Install dependencies (when available)
3. Configure environment variables
4. Set up Supabase project
5. Configure Task Master AI

## 📊 Task Management

This project uses Task Master AI for comprehensive task management. All 108 tasks are organized into logical sections:

1. **Core Infrastructure** (Tasks 1-20)
2. **Admin Panel** (Tasks 21-38)
3. **Calculator Builder** (Tasks 39-63)
4. **WordPress Integration** (Tasks 64-83)
5. **Deployment & Security** (Tasks 84-98)
6. **Constraints & Dependencies** (Tasks 99-108)

### Current Status
- **Ready to start**: 16 tasks (15%)
- **Dependencies required**: 92 tasks (85%)
- **High complexity**: 5 tasks (5%)
- **Medium complexity**: 103 tasks (95%)

## 🔗 Documentation

- **Official Docs**: [`.taskmaster/docs/official-docs.md`](.taskmaster/docs/official-docs.md)
- **Task Overview**: [`.taskmaster/docs/task-overview-with-dependencies.txt`](.taskmaster/docs/task-overview-with-dependencies.txt)
- **Master PRD**: [`.taskmaster/docs/calcpro_prd.md`](.taskmaster/docs/calcpro_prd.md)

## 📈 Development Roadmap

### Phase 1: Foundation
- Core infrastructure setup
- Basic project configuration
- Development environment

### Phase 2: Core Development
- Admin panel implementation
- Calculator builder core
- WordPress integration foundation

### Phase 3: Integration & Testing
- End-to-end testing
- Security validation
- Performance optimization

## 🤝 Contributing

This is a private project. For internal development, please follow the established patterns and use Task Master AI for task management.

## 📄 License

Private project - All rights reserved.

## 📞 Support

For project-related questions, refer to the Task Master AI system and project documentation.

---

*Last updated: 2025-08-19*
*Generated by Task Master AI*
