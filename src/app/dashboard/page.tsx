import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { prisma } from '@/lib/prisma'

import CreatePortfolioForm from "@/components/portfolio/CreatePortfolioForm";

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {Separator} from '@/components/ui/separator'

import { unstable_noStore } from "next/cache";

export default async function DashboardPage() {
  unstable_noStore() // prevents stale lists

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const portfolios = await prisma.portfolio.findMany({
    where: {userId: user.id},
    orderBy: {createdAt: "desc"},
  });



  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Your Portfolios</h1>
            <p className="text-sm text-muted-foreground">
              Create a portfolio, then add positions to track performance.
            </p>
        </div>
        <CreatePortfolioForm />
      </div>

      <Separator className="mb-6"/>

      {portfolios.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No portfolios yet</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Use the “New Portfolio” button to get started.
          </CardContent>
        </Card>
      ): (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {portfolios.map((p) => (
            <Card key={p.id} className="hover:shadow-sm transition-shadow">
              <CardHeader>
                <CardTitle className="text-base">{p.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Created {new Date(p.createdAt).toLocaleDateString()}
              </CardContent>
            </Card>
          ))}
        </div>
      )}


    </div>
  );
}
