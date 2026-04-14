# UMSP Malaria Surveillance Dashboard

A comprehensive malaria surveillance dashboard for monitoring and analyzing health facility data across regions in Uganda. This application provides real-time insights into malaria surveillance metrics through interactive maps, time-series analysis, and detailed data exploration tools.

## Features

- **Interactive Map Visualization** — Geographic mapping with cluster, heatmap, and trend overlays for spatial analysis of malaria surveillance data
- **Time-Series Analysis** — Seasonal trends and time-series charts to identify patterns in surveillance metrics
- **Data Explorer** — Tabular data interface with advanced filtering and column selection
- **KPI Dashboard** — High-level overview with regional summaries and data quality metrics
- **Automated Reporting** — PDF report generation with aggregated statistics
- **Data Management** — Admin CSV upload interface for seamless data ingestion
- **Role-Based Access Control** — Authenticated user access with admin-level permissions for data management

## Technology Stack

- **Frontend** — [Next.js 14](https://nextjs.org) (App Router), [React](https://react.dev), [Tailwind CSS](https://tailwindcss.com)
- **Backend** — Next.js API routes, [Supabase](https://supabase.com) (PostgreSQL)
- **Mapping** — [react-leaflet](https://react-leaflet.js.org)
- **Data Visualization** — [Plotly](https://plotly.com/javascript/)
- **Reporting** — [@react-pdf/renderer](https://react-pdf.org)
- **UI Components** — [shadcn/ui](https://ui.shadcn.com)
- **Authentication** — [Supabase Auth](https://supabase.com/docs/guides/auth)
- **Deployment** — [Vercel](https://vercel.com)

## Prerequisites

- **Node.js** 16.x or higher
- **npm** or yarn package manager
- Supabase account with credentials (see [Environment Variables](#environment-variables))

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd umsp-dashboard
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Start the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Available Scripts

- `npm run dev` — Start development server with hot-reloading
- `npm run build` — Create an optimized production build
- `npm run lint` — Run ESLint to check code quality (run before committing)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/             # React components organized by feature
├── lib/                    # Utilities, hooks, and queries
│   ├── hooks/             # Custom React hooks
│   ├── queries/           # Supabase query functions
│   ├── supabase/          # Supabase client setup
│   └── utils/             # Shared utilities
├── middleware.ts          # Authentication and authorization middleware
└── types/                 # TypeScript type definitions
supabase/                  # Database schema, migrations, and RLS policies
```

## Database

The application uses Supabase PostgreSQL with three main tables:

- **`umsp_monthly_data`** — Monthly surveillance records per health facility
- **`health_facility_coordinates`** — Geographic coordinates for 42 health facilities
- **`active_sites`** — List of currently active surveillance sites

Row-Level Security (RLS) policies enforce access control at the database level.

## Authentication & Authorization

- `/dashboard/*` routes require authenticated user access
- `/admin/*` routes require admin role (set via Supabase user metadata)
- API endpoints (`/api/*`) are protected server-side via middleware

Admin users can be configured in Supabase using:
```sql
UPDATE auth.users SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}' WHERE email = 'user@example.com';
```

## Deployment

The application is deployed on [Vercel](https://vercel.com) with automatic deployments on every push to the main branch.

To deploy your own instance:

1. Push code to your GitHub repository
2. Create a new project on Vercel and connect your repository
3. Configure environment variables in Vercel project settings
4. Vercel will automatically build and deploy

For more information, see [Vercel's Next.js deployment guide](https://vercel.com/docs/frameworks/nextjs).

## Support

For questions or issues, please refer to the project maintainer or create an issue in the repository.
