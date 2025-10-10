import {notFound} from 'next/navigation'
import Link from 'next/link'
import { prisma } from  '@/lib/prisma'
import { requireUserId } from '@/lib/auth/session'
import AddPositionForm from '@/components/position/AddPositionForm'

import {
  Card, CardHeader, CardTitle, CardDescription, CardContent
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


type Props = { params: { id: string } };

export default async function PortfolioDetailPage({params}: Props) {
    const userId = await requireUserId();
    const portfolio = await prisma.portfolio.findFirst({
        where: { id: params.id, userId},
        select: {
            id: true, name: true, createdAt: true,
             positions: { select: { id: true, ticker: true, shares: true, costBasis: true }, orderBy: { ticker: "asc" } },
        }
    });
    if (!portfolio) notFound();

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
                  <TableHead className="w-[140px]">Ticker</TableHead>
                  <TableHead>Shares</TableHead>
                  <TableHead>Cost basis ($)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {portfolio.positions.map((pos) => (
                  <TableRow key={pos.id}>
                    <TableCell className="font-medium">{pos.ticker}</TableCell>
                    <TableCell>{pos.shares}</TableCell>
                    <TableCell>${pos.costBasis.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
    )
}