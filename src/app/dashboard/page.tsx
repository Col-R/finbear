import { requireUserId } from "@/lib/auth/session";
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { getQuotes } from '@/lib/quotes/polygon'
import { calculatePortfolioSummary } from '@/lib/portfolio/math'
import CreatePortfolioForm from "@/components/portfolio/CreatePortfolioForm";
import RenamePortfolioDialog from "@/components/portfolio/RenamePortfolioDialog";
import DeletePortfolioDialog from "@/components/portfolio/DeletePortfolioDialog";

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {Separator} from '@/components/ui/separator'

import { unstable_noStore } from "next/cache";

export default async function DashboardPage() {
  unstable_noStore() // prevents stale lists
  const userId = await requireUserId()

  const portfolios = await prisma.portfolio.findMany({
    where: {userId: userId},
    orderBy: {createdAt: "desc"},
    include: { positions: { select: { ticker: true, shares: true, costBasis: true } } },
  });

  const allTickers = [...new Set(portfolios.flatMap(p => p.positions.map(pos => pos.ticker)))]
  const quotes = await getQuotes(allTickers)



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
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <Link href={`/dashboard/portfolios/${p.id}`}>
                  <CardTitle className="text-base hover:underline">{p.name}</CardTitle>
                </Link>
                <div className="flex-col">
                  <RenamePortfolioDialog id={p.id} currentName={p.name} />
                  <DeletePortfolioDialog id = {p.id} name={p.name} />
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>Created {new Date(p.createdAt).toLocaleDateString()}</p>
                
                {(() => {
                  const summary = calculatePortfolioSummary(p.positions, quotes)
                  return summary.positionCount > 0 ? (
                    <p className="text-sm font-medium mt-1 text-foreground">
                      Total: ${summary.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      <span className={`ml-2 ${summary.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ({summary.totalGainLossPercent >= 0 ? '+' : ''}{summary.totalGainLossPercent.toFixed(2)}%)
                      </span>
                    </p>
                  ) : null
                })()}
              </CardContent>
            </Card>
          ))}
        </div>
      )}


    </div>
  );
}
