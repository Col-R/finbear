// app/dashboard/portfolios/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/auth/session";

import { unstable_noStore as noStore } from "next/cache";


export default async function PortfoliosPage() {
    noStore(); // always fetch fresh data for this page

  const userId = await requireUserId(); // redirects to /login if not authed
  const portfolios = await prisma.portfolio.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, createdAt: true },
  });
  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Portfolios</h1>
          <p className="text-sm text-muted-foreground">
            Manage your portfolios and drill into positions and performance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* For now, send users to the Dashboard where the create form lives */}
          <Link href="/dashboard">
            <Button>New Portfolio</Button>
          </Link>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Grid of portfolio cards (mocked) */}
      {portfolios.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No portfolios yet</CardTitle>
            <CardDescription>
              Create your first portfolio to start tracking positions and performance.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/dashboard">
              <Button>Get started</Button>
            </Link>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {portfolios.map((p) => (
            <Card key={p.id} className="hover:shadow-sm transition-shadow">
              <CardHeader className="space-y-1">
                <CardTitle className="text-base">{p.name}</CardTitle>
                <CardDescription>
                  Created {new Date(p.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {/* Placeholder for summary stats (e.g., positions count, value) */}
                View details to manage positions.
              </CardContent>
              <CardFooter className="flex justify-between">
                <Link href={`/dashboard/portfolios/${p.id}`}>
                  <Button variant="secondary" size="sm">Open</Button>
                </Link>
                {/* optional action slots: Rename/Delete buttons */}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Roadmap / TODOs section */}
      <div className="mt-10">
        <h2 className="mb-2 text-sm font-medium text-muted-foreground">Coming soon</h2>
        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
          <li>Fetch portfolios for the logged-in user (SSR with Prisma).</li>
          <li>Add inline “Create Portfolio” (dialog or inline form).</li>
          <li>Rename and Delete actions (hook server actions).</li>
          <li>Navigate to portfolio detail page for positions & performance.</li>
        </ul>
      </div>
    </div>
  );
}
