import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ModeToggle } from "@/components/mode-toggle";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center px-4">
          <h1 className="text-xl font-bold">Next.js OSS Template</h1>
          <nav className="ml-auto flex items-center gap-4">
            <ModeToggle />
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="space-y-6 pt-6 pb-8 md:pt-10 md:pb-12 lg:py-32">
          <div className="container mx-auto flex max-w-[64rem] flex-col items-center gap-4 px-4 text-center">
            <h1 className="text-3xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">
              Production-Ready Next.js Template
            </h1>
            <p className="text-muted-foreground max-w-[42rem] leading-normal sm:text-xl sm:leading-8">
              A modern, full-stack Next.js template with authentication, database integration, and
              best practices built in. Get started in minutes, not hours.
            </p>
            <div className="flex gap-4">
              <Link href="/signup">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline">
                  View Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-8 md:py-12 lg:py-24">
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Authentication</CardTitle>
                <CardDescription>Better Auth integration</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Secure email/password authentication with session management, email verification,
                  and optional signup whitelist.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Database</CardTitle>
                <CardDescription>Drizzle ORM + Neon</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Type-safe database queries with Drizzle ORM connected to serverless Neon
                  PostgreSQL with built-in migrations.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>UI Components</CardTitle>
                <CardDescription>shadcn/ui + Tailwind</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Beautiful, accessible components built with Radix UI and Tailwind CSS. Includes
                  forms, tables, and charts.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Type Safety</CardTitle>
                <CardDescription>End-to-end TypeScript</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Full TypeScript coverage with Zod validation for forms and environment variables
                  using @t3-oss/env.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Developer Experience</CardTitle>
                <CardDescription>Tooling included</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Pre-configured Prettier, git hooks, Makefile commands, and development scripts for
                  a smooth workflow.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Best Practices</CardTitle>
                <CardDescription>Production-ready patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Server actions, API routes, protected pages, and example implementations following
                  Next.js 15+ conventions.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="border-t">
          <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
              <h2 className="text-3xl leading-[1.1] font-bold sm:text-3xl md:text-6xl">
                Ready to build?
              </h2>
              <p className="text-muted-foreground max-w-[85%] leading-normal sm:text-lg sm:leading-7">
                Clone the repository and start building your next project with a solid foundation.
              </p>
              <Link href="/signup">
                <Button size="lg" className="mt-4">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 md:py-0">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:h-24 md:flex-row">
          <p className="text-muted-foreground text-center text-sm leading-loose md:text-left">
            Built with Next.js, Better Auth, Drizzle, Neon, and shadcn/ui
          </p>
        </div>
      </footer>
    </div>
  );
}
