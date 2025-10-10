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
import { ChevronRight } from 'lucide-react'

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
            <Card
              key={p.id}
              className="transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 border-border/70 hover:border-foreground/15"
            >
              <CardHeader className="space-y-1">
                <CardTitle className="text-base">{p.name}</CardTitle>
                <CardDescription>
                  Created {new Date(p.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>

              <CardContent className="text-sm text-muted-foreground">
                View details to manage positions.
              </CardContent>

              <CardFooter className="flex justify-between">
                <Link
                  href={`/dashboard/portfolios/${p.id}`}
                  className="group inline-flex items-center rounded-md border border-transparent px-3 py-2 text-sm font-medium
                            transition-all duration-200 hover:bg-muted focus-visible:outline-none focus-visible:ring-2
                            focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-label={`Open portfolio ${p.name}`}
                >
                  Open
                  <ChevronRight
                    className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-focus-visible:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>

                {/* Optional future actions */}
                {/* <div className="flex gap-1">
                  <Button variant="ghost" size="sm">Rename</Button>
                  <Button variant="destructive" size="sm">Delete</Button>
                </div> */}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

    </div>
  );
}
