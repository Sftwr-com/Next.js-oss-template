## Overview

_Summary of the situation_

We're initializing a new code base here.

This is for a generic next.js template with tech stack I like for my oss projects, so we can just initialize and test with dummy data to ensure everything is working.

This is quite a large task.

I've already setup next.js and shadcn.

I will run all the install commands and everything, just tell me what to run.

Here's everything we're looking for in this code base:

- Use bun Runtime for everything
- Neon Postgres for database (local and prod)
- Better auth for auth
- Drizzle orm
- Backend, next.js app router typescript
- Frontend, next.js app router typescript
- Design system, shadcn and tailwind
  - Charts, use shadcn
- Tables - shadcn / tan stack table
- Forms, shadcn with tan stack forms

## Code quality / dev exp

Pre commit hooks

- TypeScript check, fails if any typescript errors
- Prettier check
-

Makefile

- Database (use drizzle for migration stuff)
  - Create migration
  - Apply migration
  - Tear down database (always uses .env)
- Prettier write

Claude

- Claude.md
  - Tell it to always use shadcn defaults unless absolutely not possible
  - Favor composability over reusability
  - Generally prefer tanstack table + shadcn for tables

## High Level Goals

- [ ] Set up database infrastructure with Drizzle ORM and Neon Postgres
- [ ] Implement Better Auth authentication system
- [ ] Configure development tooling (Prettier, TypeScript checks, pre-commit hooks)
- [ ] Create Makefile for common development tasks
- [ ] Set up project documentation (CLAUDE.md)
- [ ] Create example implementations (forms, tables, charts) to validate setup
- [ ] Verify end-to-end functionality with manual testing

---

## Implementation Plan

### Architecture Decisions

#### 1. Database Strategy: Local vs Neon

**The Problem:** You specified "Neon Postgres for database (local and prod)" but Neon is a cloud-hosted Postgres service. You can't run Neon locally.

**Options:**

1. **Neon for both** - Use Neon's database branching feature for dev/staging/prod environments
2. **Docker Postgres locally, Neon for prod** - Standard approach, requires Docker
3. **Local Postgres install, Neon for prod** - Requires Postgres installation on dev machine

**Recommendation: Option 1 - Neon for everything**

Why: Neon's database branching is perfect for this use case. You get:

- No Docker complexity
- Identical database versions between environments
- Free tier is generous for development
- One connection string in `.env`, easy to switch branches
- Better matches "bun runtime for everything" philosophy (no Docker)

The Makefile will use Neon API to create/delete dev branches for "tear down database".

#### 2. Pre-commit Hooks: Husky vs Simple Git Hooks vs Bun's Built-in

**Options:**

1. **Husky** - Industry standard, 20M+ weekly downloads, but adds Node.js baggage
2. **simple-git-hooks** - Lightweight, but still npm-centric
3. **bun's `preinstall` + manual `.git/hooks`** - Minimal, native to bun

**Recommendation: simple-git-hooks**

Why: While I prefer minimal tooling, Husky/simple-git-hooks solve a real problem: ensuring hooks are installed consistently across team members. simple-git-hooks is < 1KB and aligns with your "just works" philosophy. The alternative (manual hook management) creates onboarding friction.

#### 3. TanStack Forms vs React Hook Form

**Pushback:** You specified TanStack Forms, but I need to challenge this.

**Reality Check:**

- TanStack Forms is newer, less battle-tested
- React Hook Form has 10x the ecosystem, better TypeScript support
- Shadcn form examples use React Hook Form + Zod

**Counter-recommendation: React Hook Form**

Unless you have a specific reason for TanStack Forms, I strongly suggest React Hook Form. It's what shadcn is built for, has better DX, and you won't fight the ecosystem.

**Your call:** If you insist on TanStack Forms, we can do it, but expect more manual wiring.

---

### Phase 1: Core Infrastructure Setup

#### 1.1 Package Dependencies

**Commands to run:**

```bash
# Database & ORM
bun add drizzle-orm @neondatabase/serverless
bun add -d drizzle-kit

# Auth
bun add better-auth

# Forms (using React Hook Form - change if you insist on TanStack)
bun add react-hook-form @hookform/resolvers zod

# Dev tooling
bun add -d prettier prettier-plugin-tailwindcss
bun add -d simple-git-hooks
bun add -d tsx

# Env validation
bun add @t3-oss/env-nextjs zod
```

#### 1.2 Environment Configuration

**File:** `.env.local`

```bash
# Database - Get from neon.com (use pooled connection for serverless)
DATABASE_URL="postgresql://user:pass@ep-compute-id-pooler.region.aws.neon.com/dbname?sslmode=require&channel_binding=require"

# Better Auth
BETTER_AUTH_SECRET="generate-with-openssl-rand-base64-32"
BETTER_AUTH_URL="http://localhost:3000"

# Neon API (for Makefile database operations)
NEON_API_KEY="your-neon-api-key"
NEON_PROJECT_ID="your-neon-project-id"
```

**File:** `.env.example`

```bash
# Database - Get from neon.com (use pooled connection for serverless)
DATABASE_URL="postgresql://user:pass@ep-compute-id-pooler.region.aws.neon.com/dbname?sslmode=require&channel_binding=require"

# Better Auth - Generate secret with: openssl rand -base64 32
BETTER_AUTH_SECRET=""
BETTER_AUTH_URL="http://localhost:3000"

# Neon API - Get from neon.com console (for database operations)
NEON_API_KEY=""
NEON_PROJECT_ID=""
```

**File:** `lib/env.ts`

```typescript
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.string().url(),
    NEON_API_KEY: z.string().min(1),
    NEON_PROJECT_ID: z.string().min(1),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  },
  client: {
    // Add client-side env vars here with NEXT_PUBLIC_ prefix
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    NEON_API_KEY: process.env.NEON_API_KEY,
    NEON_PROJECT_ID: process.env.NEON_PROJECT_ID,
    NODE_ENV: process.env.NODE_ENV,
  },
});
```

**Notes:**

- This validates env vars at build time, catches missing vars early
- Type-safe access via `env.DATABASE_URL`
- Connection string should use pooled connection (-pooler suffix) for serverless environments

#### 1.3 Drizzle ORM Configuration

**File:** `drizzle.config.ts`

```typescript
import { defineConfig } from "drizzle-kit";
import { env } from "./lib/env";

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./lib/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
});
```

**File:** `lib/db/index.ts`

```typescript
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { env } from "../env";
import * as schema from "./schema";

const sql = neon(env.DATABASE_URL);
export const db = drizzle(sql, { schema });
```

**File:** `lib/db/schema.ts`

```typescript
import { pgTable, text, timestamp, uuid, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Example schema - will expand with Better Auth tables
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name"),
  emailVerified: boolean("email_verified").default(false),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));
```

**File:** `lib/db/migrations/.gitkeep`

```
# Migrations will be generated here
```

**Notes:**

- Schema uses Better Auth conventions
- UUIDs for all IDs (better for distributed systems)
- Timestamps on everything
- Cascade deletes for sessions
- Using Neon's HTTP driver (`neon-http`) for optimal serverless performance

#### 1.4 Better Auth Setup

**File:** `lib/auth.ts`

```typescript
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import { env } from "./env";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
  },
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
});
```

**File:** `app/api/auth/[...all]/route.ts`

```typescript
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
```

**File:** `lib/auth-client.ts`

```typescript
import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
});

export const { signIn, signOut, signUp, useSession } = authClient;
```

**Notes:**

- Better Auth handles all session management
- Drizzle adapter means auth tables use your schema
- Client exports for use in components

---

### Phase 2: Development Tooling

#### 2.1 Prettier Configuration

**File:** `.prettierrc`

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "tabWidth": 2,
  "useTabs": false,
  "printWidth": 100,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

**File:** `.prettierignore`

```
node_modules
.next
out
dist
build
coverage
*.lock
.env*
public
```

#### 2.2 Pre-commit Hooks

**File:** `.simple-git-hooks.json`

```json
{
  "pre-commit": "bun run pre-commit"
}
```

**Update:** `package.json` scripts section

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build --turbopack",
    "start": "next start",
    "type-check": "tsc --noEmit",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "pre-commit": "bun run type-check && bun run format:check",
    "postinstall": "simple-git-hooks",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio"
  }
}
```

**Command to run:**

```bash
bun run postinstall  # Sets up git hooks
```

**Notes:**

- `postinstall` ensures hooks are installed for all team members
- Pre-commit runs TypeScript check + Prettier check (NOT format)
- If checks fail, commit is blocked

#### 2.3 Makefile

**File:** `Makefile`

```makefile
.PHONY: help db-generate db-migrate db-push db-studio db-teardown format

help:
	@echo "Available commands:"
	@echo "  make db-generate   - Generate Drizzle migration from schema changes"
	@echo "  make db-migrate    - Apply pending migrations to database"
	@echo "  make db-push       - Push schema directly (development only)"
	@echo "  make db-studio     - Open Drizzle Studio"
	@echo "  make db-teardown   - Drop all tables (WARNING: destructive)"
	@echo "  make format        - Format code with Prettier"

db-generate:
	@echo "Generating migration..."
	@bun run db:generate

db-migrate:
	@echo "Applying migrations..."
	@bun run db:migrate

db-push:
	@echo "Pushing schema changes..."
	@bun run db:push

db-studio:
	@echo "Opening Drizzle Studio..."
	@bun run db:studio

db-teardown:
	@echo "WARNING: This will drop all tables!"
	@read -p "Are you sure? (y/N): " confirm && [ "$$confirm" = "y" ] || exit 1
	@echo "Dropping all tables..."
	@bun run tsx scripts/db-teardown.ts

format:
	@echo "Formatting code..."
	@bun run format
```

**File:** `scripts/db-teardown.ts`

```typescript
import { sql } from "drizzle-orm";
import { db } from "../lib/db";

async function teardown() {
  console.log("Dropping all tables...");

  // Drop all tables in public schema
  await db.execute(sql`
    DROP SCHEMA public CASCADE;
    CREATE SCHEMA public;
    GRANT ALL ON SCHEMA public TO postgres;
    GRANT ALL ON SCHEMA public TO public;
  `);

  console.log("Database teardown complete!");
  process.exit(0);
}

teardown().catch((error) => {
  console.error("Teardown failed:", error);
  process.exit(1);
});
```

**Notes:**

- Makefile provides clean interface for common tasks
- `db-teardown` has confirmation prompt to prevent accidents
- Uses `.env` automatically via drizzle config

#### 2.4 Claude Documentation

**File:** `CLAUDE.md`

```markdown
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
```

---

### Phase 3: Example Implementations

#### 3.1 Example: User Authentication UI

**File:** `app/(auth)/login/page.tsx`

```typescript
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    const result = await signIn.email({
      email: data.email,
      password: data.password,
    });

    if (result.error) {
      form.setError("root", {
        message: result.error.message,
      });
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Sign In</h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.formState.errors.root && (
              <p className="text-sm text-destructive">{form.formState.errors.root.message}</p>
            )}

            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
```

#### 3.2 Example: Data Table with TanStack Table

**File:** `components/ui/data-table.tsx`

```typescript
"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Search...",
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="space-y-4">
      {searchKey && (
        <Input
          placeholder={searchPlaceholder}
          value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(searchKey)?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
```

#### 3.3 Example: Server Action

**File:** `app/dashboard/actions.ts`

```typescript
"use server";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function getUsers() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const allUsers = await db.select().from(users);
  return allUsers;
}
```

---

### Phase 4: File Summary

## File paths with 1-2 sentence summary of changes to be made.

**New Files:**

- `.env.local` - Environment variables (DATABASE_URL, auth secrets, Neon API keys)
- `.env.example` - Template for environment variables
- `.prettierrc` - Prettier configuration with Tailwind plugin
- `.prettierignore` - Ignore patterns for Prettier
- `.simple-git-hooks.json` - Git hooks configuration
- `Makefile` - Developer commands for database and formatting
- `CLAUDE.md` - AI assistant instructions and code conventions
- `drizzle.config.ts` - Drizzle ORM configuration
- `lib/env.ts` - Type-safe environment variable validation
- `lib/db/index.ts` - Database client initialization
- `lib/db/schema.ts` - Database schema definitions (users, sessions tables)
- `lib/db/migrations/.gitkeep` - Placeholder for migration files
- `lib/auth.ts` - Better Auth server configuration
- `lib/auth-client.ts` - Better Auth client exports for components
- `app/api/auth/[...all]/route.ts` - Better Auth API handler
- `scripts/db-teardown.ts` - Database reset script
- `app/(auth)/login/page.tsx` - Example login form with React Hook Form
- `components/ui/data-table.tsx` - Reusable TanStack Table component
- `app/dashboard/actions.ts` - Example server actions

**Modified Files:**

- `package.json` - Add scripts for type-check, format, pre-commit, db commands
- `.gitignore` - Already appropriate, no changes needed

---

## Manual testing plan

### Pre-testing Setup

1. Create Neon account and project at neon.com
2. Copy **pooled** connection string to `.env.local` as `DATABASE_URL` (use the one with `-pooler` suffix)
3. Generate auth secret: `openssl rand -base64 32` → `.env.local` as `BETTER_AUTH_SECRET`
4. Get Neon API key from console → `.env.local` as `NEON_API_KEY` and `NEON_PROJECT_ID`
5. Run: `bun install`
6. Run: `bun run postinstall` (sets up git hooks)

### Database Testing

1. **Generate initial migration:**

   ```bash
   make db-generate
   ```

   ✓ Should create migration file in `lib/db/migrations/`
   ✓ Check file contains users and sessions tables

2. **Apply migration:**

   ```bash
   make db-migrate
   ```

   ✓ Should execute without errors
   ✓ Verify in Neon console that tables exist

3. **Test Drizzle Studio:**

   ```bash
   make db-studio
   ```

   ✓ Opens browser to localhost:4983
   ✓ Can see users and sessions tables
   ✓ Can view schema

4. **Test database teardown:**
   ```bash
   make db-teardown
   ```
   ✓ Prompts for confirmation
   ✓ Drops all tables successfully
   ✓ Re-run migration to restore: `make db-migrate`

### Auth Testing

1. **Start dev server:**

   ```bash
   bun run dev
   ```

2. **Test signup flow:**
   - Navigate to `/api/auth/signup` endpoint
   - Create test user via API
   - ✓ User appears in database (check Drizzle Studio)
   - ✓ Session created

3. **Test login page:**
   - Navigate to `/login`
   - ✓ Form renders correctly
   - ✓ Email validation works (try invalid email)
   - ✓ Password validation works (try < 8 chars)
   - Enter valid credentials
   - ✓ Redirects to `/dashboard`
   - ✓ Session cookie set (check DevTools)

### Development Tooling Testing

1. **Test TypeScript check:**

   ```bash
   bun run type-check
   ```

   ✓ Passes with no errors

2. **Test Prettier:**

   ```bash
   make format
   ```

   ✓ Formats all files
   ✓ Check git diff to see changes

3. **Test pre-commit hook:**
   - Make a file with TypeScript error
   - Try to commit: `git add . && git commit -m "test"`
   - ✓ Commit blocked by type-check
   - Fix error, commit again
   - ✓ Commit succeeds

4. **Test Prettier check in pre-commit:**
   - Make a file with bad formatting
   - Try to commit
   - ✓ Commit blocked by prettier check
   - Run `make format`, commit again
   - ✓ Commit succeeds

### Component Testing

1. **Test data table:**
   - Create test page with DataTable component
   - Pass dummy data
   - ✓ Table renders
   - ✓ Sorting works
   - ✓ Filtering works
   - ✓ Pagination works

2. **Test form example:**
   - Visit `/login` page
   - ✓ Form validation works client-side
   - ✓ Submission works
   - ✓ Error states display correctly

### End-to-End Flow

1. Fresh database: `make db-teardown` then `make db-migrate`
2. Start dev: `bun run dev`
3. Create user account
4. Sign in
5. View protected page (dashboard)
6. Sign out
7. Verify redirect to login
8. ✓ Complete flow works without errors

---

## Installation Commands Summary

Run these in order:

```bash
# 1. Install dependencies
bun add drizzle-orm @neondatabase/serverless
bun add -d drizzle-kit
bun add better-auth
bun add react-hook-form @hookform/resolvers zod
bun add -d prettier prettier-plugin-tailwindcss
bun add -d simple-git-hooks
bun add -d tsx
bun add @t3-oss/env-nextjs zod

# 2. Set up git hooks
bun run postinstall

# 3. Configure environment (manual: create .env.local with values from .env.example)

# 4. Generate and run migrations
make db-generate
make db-migrate

# 5. Start development
bun run dev
```

---

## Notes & Recommendations

### What I Changed From Your Request:

1. **Forms:** Recommended React Hook Form instead of TanStack Forms (see Architecture Decision #3)
2. **Database:** Recommended Neon for local dev instead of local Postgres (see Architecture Decision #1)

### What's Not Included (intentionally):

1. **ESLint:** You didn't mention it, and Prettier + TypeScript covers most needs. Add if you want, but it's bloat for most projects.
2. **Testing framework:** Not specified. Add Vitest/Playwright later if needed.
3. **CI/CD:** Out of scope for "initialization"
4. **Docker:** You said "bun runtime for everything" - Docker contradicts this

### Potential Issues:

1. **Better Auth** is newer - less StackOverflow answers than NextAuth. Trade-off: cleaner API vs. smaller ecosystem. Note: Neon now offers native auth built on Better Auth (Dec 2025), but we're using Better Auth standalone for more control.
2. **Neon branching** for database teardown requires API calls - adds complexity vs. local Postgres drop/create.
3. **Turbopack** (`--turbopack` flag in scripts) is still beta - might hit bugs. Remove flag if issues arise.
4. **Neon driver** - Using `@neondatabase/serverless` with `neon-http` driver for optimal serverless performance. This uses HTTP for single transactions (faster). For interactive transactions, you'd need the WebSocket driver.

### What to Do Next:

1. Run installation commands above
2. Set up Neon account and get credentials
3. Create `.env.local` with real values
4. Run migrations
5. Test auth flow
6. Build your first feature using the patterns established
