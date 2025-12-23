import { getCurrentUser } from "./actions";
import { DashboardCharts } from "./components/dashboard-charts";
import { UserNav } from "./components/user-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ModeToggle } from "@/components/mode-toggle";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  console.log(user);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center px-4">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <div className="ml-auto flex items-center space-x-4">
            <ModeToggle />
            <UserNav user={user} />
          </div>
        </div>
      </header>

      <main className="container mx-auto flex-1 space-y-4 p-4 pt-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231</div>
              <p className="text-muted-foreground text-xs">+20% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,350</div>
              <p className="text-muted-foreground text-xs">+180 this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12.5%</div>
              <p className="text-muted-foreground text-xs">+2.1% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Email Verified</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.emailVerified ? "Yes" : "No"}</div>
              <p className="text-muted-foreground text-xs">Your account status</p>
            </CardContent>
          </Card>
        </div>

        <DashboardCharts />

        <Card>
          <CardHeader>
            <CardTitle>Welcome to your Dashboard</CardTitle>
            <CardDescription>
              This is an example dashboard showing how to build authenticated pages with charts and
              data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Email:</span> {user.email}
              </p>
              <p className="text-sm">
                <span className="font-medium">Name:</span> {user.name}
              </p>
              <p className="text-sm">
                <span className="font-medium">User ID:</span> {user.id}
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
