# Claude Instructions

## General Principles

1. **Shadcn Defaults**: Always use shadcn component defaults unless technically impossible
2. **Composability > Reusability**: Favor composing small components over creating reusable abstractions too early
3. **Explicit over Implicit**: Prefer explicit code that's easy to follow over clever abstractions

## Tech Stack Conventions

### Tables

- Always use TanStack Table + shadcn table components
- Example pattern: `components/ui/data-table.tsx` for base, `app/[feature]/components/[feature]-table.tsx` for feature-specific

### Forms

- Use React Hook Form + shadcn form components + Zod validation
- Pattern: Co-locate form schemas with form components
- Always use `useForm` with TypeScript inference from Zod schema

### Charts

- Use shadcn chart components (built on Recharts)
- Prefer composition of chart primitives over all-in-one components

### Database

- Use Drizzle ORM for all database operations
- Never write raw SQL unless absolutely necessary
- Always use prepared statements via Drizzle's query builder

### Authentication

- Better Auth handles all session management
- Use `useSession` hook in client components
- Use `auth.api.getSession()` in server components/actions

## Code Style

- Use server actions for mutations, not API routes (unless building public API)
- Keep server components default, use "use client" only when needed
- Organize by feature: `app/[feature]/components/`, `app/[feature]/actions.ts`
- No `src/` directory - everything in `app/` or root `lib/`, `components/`

## What NOT to do

- Don't create `utils/helpers.ts` dumping grounds
- Don't add prop drilling more than 2 levels (use composition instead)
- Don't create HOCs or render props (use hooks)
- Don't add comments explaining what code does (code should be self-documenting)
- Don't create generic "wrapper" components without clear use case
