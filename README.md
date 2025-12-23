# Next.js OSS Template

A production-ready Next.js starter template with authentication, database integration, and modern tooling built in. Start building features immediately without spending days on boilerplate setup.

## Features

- **Next.js 15** with App Router and Turbopack
- **Better Auth** - Modern authentication with email/password
- **Database** - Drizzle ORM + Neon Postgres (serverless)
- **UI Components** - shadcn/ui with Radix UI primitives
- **Styling** - Tailwind CSS v4 with OKLCH color system
- **Theme Support** - Light/dark mode with next-themes
- **Type Safety** - End-to-end TypeScript with Zod validation
- **Forms** - React Hook Form with schema validation
- **Charts** - Beautiful data visualization with Recharts
- **Developer Experience** - Prettier, git hooks, type checking
- **Auth Guards** - Protected routes with callback URL redirects

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) (recommended) or Node.js 18+
- PostgreSQL database (recommended: [Neon](https://neon.tech))

### Installation

1. **Clone and install dependencies:**

```bash
git clone <your-repo-url>
cd nextjs-oss-template
bun install
```

2. **Set up environment variables:**

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Required variables:

- `DATABASE_URL` - Neon pooled connection string
- `BETTER_AUTH_SECRET` - Generate with `openssl rand -base64 32`
- `BETTER_AUTH_URL` - Your app URL (http://localhost:3000 for dev)

3. **Initialize the database:**

```bash
bun run db:push
```

4. **Start the development server:**

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

## Available Scripts

```bash
bun run dev              # Start dev server with Turbopack
bun run dev-no-turbo     # Start dev server without Turbopack (fallback)
bun run build            # Build for production
bun run start            # Start production server
bun run type-check       # Run TypeScript type checking
bun run format           # Format code with Prettier
bun run format:check     # Check code formatting
bun run db:generate      # Generate database migrations
bun run db:migrate       # Run database migrations
bun run db:push          # Push schema changes to database
bun run db:studio        # Open Drizzle Studio (database GUI)
```

I highly recommend beekeeper studio as a free database admin GUI https://www.beekeeperstudio.io/.

## Project Structure

```
app/
├── (auth)/              # Auth routes (login, signup)
├── dashboard/           # Protected dashboard
├── settings/            # Protected settings page
├── api/auth/[...all]/   # Better Auth API handler
├── layout.tsx           # Root layout with theme provider
└── page.tsx             # Landing page

lib/
├── auth.ts              # Better Auth configuration
├── auth-client.ts       # Client-side auth helpers
├── db.ts                # Database connection
├── env.ts               # Environment variable validation
├── whitelist.ts         # Signup whitelist logic
└── db/
    └── schema.ts        # Database schema

components/
├── ui/                  # shadcn/ui components
├── theme-provider.tsx   # Theme context provider
└── mode-toggle.tsx      # Theme switcher component

middleware.ts            # Sets x-pathname header for auth redirects
```

## Authentication

### Email/Password Auth

Built with Better Auth for secure session management:

- Sign up at `/signup`
- Sign in at `/login`
- Sessions managed via HTTP-only cookies
- Protected routes redirect to login with callback URL

### Auth Guards

Protected pages use the `getCurrentUser()` server action:

```typescript
import { getCurrentUser } from "@/app/dashboard/actions";

export default async function ProtectedPage() {
  const user = await getCurrentUser();
  // Page automatically redirects to login if not authenticated
  // After login, redirects back to original page
}
```

### Signup Whitelist

Control who can create accounts using environment variables:

```bash
# Enable whitelist (default: false)
ENABLE_SIGNUP_WHITELIST="true"

# Comma-separated list of allowed emails or domains
# Individual emails: "user@example.com,admin@example.com"
# Entire domains: "@company.com,@partner.com"
# Mixed: "ceo@startup.com,@company.com"
SIGNUP_WHITELIST="@yourcompany.com,founder@example.com"
```

When enabled:

- Only whitelisted emails/domains can sign up
- Domain wildcards use `@domain.com` syntax
- Existing users can still log in
- Great for private betas or internal tools

## Database

### Schema Management

Uses Drizzle ORM with Neon Postgres:

1. **Modify schema** in `lib/db/schema.ts`
2. **Push changes**: `bun run db:push` (dev) or `bun run db:generate && bun run db:migrate` (production)
3. **View data**: `bun run db:studio`

### Better Auth Tables

The database includes Better Auth's required tables (user, session, account, verification). These are automatically managed by Better Auth.

## UI Components

Built with shadcn/ui - copy/paste components you own:

```bash
# Add new components
bunx shadcn@latest add button
bunx shadcn@latest add card
```

### Theme System

- Uses Tailwind CSS v4 with OKLCH colors
- Light/dark mode via next-themes
- CSS variables defined in `app/globals.css`
- Access theme: `import { useTheme } from "next-themes"`

## Development Workflow

### Pre-commit Hooks

Automatically runs type checking and format checking before commits:

```bash
# Configured in package.json
"pre-commit": "bun run type-check && bun run format:check"
```

### Code Style

- **Prettier** for formatting (includes Tailwind plugin)
- **TypeScript** strict mode enabled
- **ESLint** with Next.js recommended config

## Deployment

### Environment Variables

Set these in your deployment platform:

```bash
DATABASE_URL=           # Neon pooled connection string
BETTER_AUTH_SECRET=     # Generate new for production
BETTER_AUTH_URL=        # Your production URL
NEON_API_KEY=          # From Neon console
NEON_PROJECT_ID=       # From Neon console
```

Optional:

```bash
ENABLE_SIGNUP_WHITELIST="true"
SIGNUP_WHITELIST="@yourcompany.com"
```

### Build

```bash
bun run build
bun run start
```

### Recommended Platforms

- **Vercel** - Zero-config deployment for Next.js
- **Railway** - Simple deployment with Postgres
- **Fly.io** - Deploy anywhere

## Learn More

### Technologies

- [Next.js Documentation](https://nextjs.org/docs)
- [Better Auth](https://www.better-auth.com)
- [Drizzle ORM](https://orm.drizzle.team)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Neon Postgres](https://neon.tech)

### Key Patterns

- **Server Actions** for mutations (not API routes)
- **Server Components** by default
- **Client Components** only when needed (`"use client"`)
- **Feature-based organization** (`app/[feature]/`)
- **Colocation** (components near their usage)

## License

MIT
