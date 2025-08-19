# CalcBuilder Pro

Advanced Calculator Builder Platform for creating, managing, and deploying interactive calculators
and forms.

## 🚀 Features

- **Interactive Calculator Builder** - Drag & drop interface for creating calculators
- **Advanced Form Management** - Complex form handling with validation
- **Real-time Analytics** - Track calculator usage and conversions
- **Multi-tenant Architecture** - Support for multiple clients/companies
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **TypeScript** - Full type safety and modern development experience

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Forms**: React Hook Form, Zod validation
- **Drag & Drop**: @dnd-kit
- **Charts**: Tremor
- **Internationalization**: react-i18next
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Docker, Docker Compose

## 📋 Prerequisites

- Node.js 18+
- npm 9+ or yarn
- Git
- Docker & Docker Compose (for development)

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone <repository-url>
cd calcbuilder-pro
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Database
DATABASE_URL=your_database_url

# Authentication
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Email
RESEND_API_KEY=your_resend_api_key
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password

# Analytics
PLAUSIBLE_DOMAIN=your_domain
```

### 4. Start development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Start with Docker (Alternative)

```bash
docker-compose up -d
```

## 📁 Project Structure

```
src/
├── app/                 # Next.js 14 app directory
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── forms/          # Form components
│   ├── charts/         # Chart components
│   └── layout/         # Layout components
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
├── services/           # API services
├── store/              # State management
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── styles/             # Global styles and design system
```

## 🧪 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript type checking
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## 🔧 Development

### Code Quality

The project uses ESLint and Prettier for code quality:

- **ESLint**: Code linting and error detection
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks
- **lint-staged**: Staged files linting

### VS Code Setup

Install recommended extensions:

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Importer

### Git Hooks

Pre-commit hooks automatically:

- Run ESLint on staged files
- Format code with Prettier
- Prevent commits with linting errors

## 🐳 Docker Development

### Start all services

```bash
docker-compose up -d
```

### View logs

```bash
docker-compose logs -f
```

### Stop services

```bash
docker-compose down
```

### Reset database

```bash
docker-compose down -v
docker-compose up -d
```

## 📊 Database

### Supabase Setup

1. Create a new Supabase project
2. Get your project URL and API keys
3. Set up environment variables
4. Run database migrations

### Local Development

```bash
# Start Supabase locally
supabase start

# Apply migrations
npm run db:migrate

# Reset database
npm run db:reset

# Seed with sample data
npm run db:seed
```

## 🌐 Internationalization

The project supports multiple languages using react-i18next:

- English (en) - Default
- Finnish (fi) - Primary target language
- Easy to add more languages

## 🎨 Design System

Built with Tailwind CSS and shadcn/ui:

- **Colors**: Custom CalcBuilder Pro color palette
- **Typography**: Display and body font families
- **Spacing**: Consistent spacing scale
- **Components**: Accessible, customizable UI components
- **Animations**: Smooth transitions and micro-interactions

## 🚀 Deployment

### Production Build

```bash
npm run build
npm run start
```

### Docker Production

```bash
docker build -t calcbuilder-pro .
docker run -p 3000:3000 calcbuilder-pro
```

### Environment Variables

Ensure all required environment variables are set in production.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📝 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Changelog

### v0.1.0

- Initial project setup
- React + TypeScript + Tailwind CSS
- shadcn/ui component library
- Basic project structure
- Code quality tools (ESLint, Prettier, Husky)
- Docker development environment
