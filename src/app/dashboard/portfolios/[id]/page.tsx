import {notFound} from 'next/navigation'
import Link from 'next/link'

import { prisma } from  '@/lib/prisma'
import { requireUserId } from '@/lib/auth/session'
import AddPositionForm from '@/components/position/AddPositionForm'
import { getQuotes } from '@/lib/quotes/polygon'
import { calculatePositionValue, calculatePortfolioSummary } from '@/lib/portfolio/math'
import EditPositionDialog from '@/components/position/EditPositionDialog'
import DeletePositionButton from '@/components/position/DeletePositionButton'

import {
  Card, CardHeader, CardTitle, CardDescription, CardContent
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


export default async function PortfolioDetailPage(
  { params }: { params: Promise<{ id: string }> } // Next.js 15 requires params to be awaited
) {
    const { id } = await params;
    const userId = await requireUserId();
    const portfolio = await prisma.portfolio.findFirst({
        where: { id: id, userId},
        select: { 
          id: true, name: true, createdAt: true,
             positions: { 
                select: { id: true, ticker: true, shares: true, costBasis: true }, 
                orderBy: { ticker: "asc" } },
        }
    });
    if (!portfolio) notFound();

    const tickers = [...new Set(portfolio.positions.map(p => p.ticker))]
    const quotes = await getQuotes(tickers)
    const summary = calculatePortfolioSummary(portfolio.positions, quotes)

    return(

    <div className="mx-auto max-w-5xl px-6 py-8">
      <div className="mb-6 flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{portfolio.name}</h1>
          <p className="text-sm text-muted-foreground">
            Created {new Date(portfolio.createdAt).toLocaleDateString()}
          </p>
        </div>
        <Link href="/dashboard/portfolios" className="text-sm text-muted-foreground hover:underline">
          ← Back to portfolios
        </Link>
      </div>

      {summary.positionCount > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Portfolio Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-lg font-semibold">${summary.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Cost</p>
                <p className="text-lg font-semibold">${summary.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Gain/Loss</p>
                <p className={`text-lg font-semibold ${summary.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {summary.totalGainLoss >= 0 ? '+' : ''}${summary.totalGainLoss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Return</p>
                <p className={`text-lg font-semibold ${summary.totalGainLossPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {summary.totalGainLossPercent >= 0 ? '+' : ''}{summary.totalGainLossPercent.toFixed(2)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Add position</CardTitle>
          <CardDescription>Enter a ticker, shares, and cost basis.</CardDescription>
        </CardHeader>
        <CardContent>
          <AddPositionForm portfolioId={portfolio.id} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Positions</CardTitle>
          <CardDescription>
            {portfolio.positions.length === 0 ? "No positions yet." : "Your current holdings."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {portfolio.positions.length === 0 ? (
            <p className="text-sm text-muted-foreground">Use the form above to add your first position.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Ticker</TableHead>
                  <TableHead>Shares</TableHead>
                  <TableHead>Cost Basis ($)</TableHead>
                  <TableHead>Current Price</TableHead>
                  <TableHead>Market Value</TableHead>
                  <TableHead>Gain/Loss</TableHead>
                  <TableHead>Gain/Loss %</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {portfolio.positions.map((pos) => {
                  const quote = quotes.get(pos.ticker)
                  const posValue = quote ? calculatePositionValue(pos, quote.price) : null
                  const gainLoss = posValue ? posValue.gainLoss : 0
                  const gainLossPercent = posValue ? posValue.gainLossPercent : 0
                  
                  return (
                    <TableRow key={pos.id}>
                      <TableCell className="font-medium">{pos.ticker}</TableCell>
                      <TableCell>{pos.shares}</TableCell>
                      <TableCell>${pos.costBasis.toFixed(2)}</TableCell>
                      <TableCell>{quote ? `${quote.price.toFixed(2)}` : '—'}</TableCell>
                      <TableCell>{posValue ? `${posValue.marketValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'}</TableCell>
                      <TableCell className={posValue ? (gainLoss >= 0 ? 'text-green-600' : 'text-red-600') : ''}>
                        {posValue ? `${gainLoss >= 0 ? '+' : ''}${gainLoss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'}
                      </TableCell>
                      <TableCell className={posValue ? (gainLossPercent >= 0 ? 'text-green-600' : 'text-red-600') : ''}>
                        {posValue ? `${gainLossPercent >= 0 ? '+' : ''}${gainLossPercent.toFixed(2)}%` : '—'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <EditPositionDialog positionId={pos.id} ticker={pos.ticker} shares={pos.shares} costBasis={pos.costBasis} />
                          <DeletePositionButton positionId={pos.id} ticker={pos.ticker} />
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
    )
}