/**
 * Pure P/L calculation functions for portfolio positions.
 * No external dependencies (Prisma, Supabase, fetch, etc.)
 */

import type { QuoteData } from '@/lib/quotes/polygon'

export type { QuoteData }
export type QuoteMap = Map<string, QuoteData>

/**
 * Round a monetary value to 2 decimal places.
 */
function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100
}

/**
 * Calculate P/L metrics for a single position.
 *
 * @param position - { shares, costBasis (per-share) }
 * @param currentPrice - current market price per share
 * @returns Object with marketValue, totalCost, gainLoss, gainLossPercent
 */
export function calculatePositionValue(
  position: { shares: number; costBasis: number },
  currentPrice: number
): {
  marketValue: number
  totalCost: number
  gainLoss: number
  gainLossPercent: number
} {
  const { shares, costBasis } = position

  // Handle edge case: zero shares
  if (shares === 0) {
    return {
      marketValue: 0,
      totalCost: 0,
      gainLoss: 0,
      gainLossPercent: 0,
    }
  }

  const marketValue = roundToTwoDecimals(shares * currentPrice)
  const totalCost = roundToTwoDecimals(shares * costBasis)
  const gainLoss = roundToTwoDecimals(marketValue - totalCost)

  // Avoid division by zero
  const gainLossPercent =
    totalCost === 0
      ? 0
      : roundToTwoDecimals((gainLoss / totalCost) * 100)

  return {
    marketValue,
    totalCost,
    gainLoss,
    gainLossPercent,
  }
}

/**
 * Calculate portfolio-level P/L summary.
 * Skips positions without quotes in the quoteMap.
 *
 * @param positions - Array of positions with ticker, shares, costBasis
 * @param quotes - Map of ticker -> QuoteData
 * @returns Object with portfolio totals and positionCount (only positions with quotes)
 */
export function calculatePortfolioSummary(
  positions: Array<{ shares: number; costBasis: number; ticker: string }>,
  quotes: QuoteMap
): {
  totalValue: number
  totalCost: number
  totalGainLoss: number
  totalGainLossPercent: number
  positionCount: number
} {
  let totalValue = 0
  let totalCost = 0
  let positionCount = 0

  for (const position of positions) {
    const quote = quotes.get(position.ticker)

    // Skip positions without quotes
    if (!quote) {
      continue
    }

    const posValue = calculatePositionValue(position, quote.price)
    totalValue += posValue.marketValue
    totalCost += posValue.totalCost
    positionCount += 1
  }

  // Round totals
  totalValue = roundToTwoDecimals(totalValue)
  totalCost = roundToTwoDecimals(totalCost)
  const totalGainLoss = roundToTwoDecimals(totalValue - totalCost)

  // Avoid division by zero
  const totalGainLossPercent =
    totalCost === 0
      ? 0
      : roundToTwoDecimals((totalGainLoss / totalCost) * 100)

  return {
    totalValue,
    totalCost,
    totalGainLoss,
    totalGainLossPercent,
    positionCount,
  }
}
