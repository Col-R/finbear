import { describe, it, expect } from 'vitest'
import {
  calculatePositionValue,
  calculatePortfolioSummary,
  type QuoteMap,
} from '@/lib/portfolio/math'

describe('calculatePositionValue', () => {
  it('calculates correct P/L with positive gain', () => {
    const position = { shares: 50, costBasis: 150.25 }
    const result = calculatePositionValue(position, 175.0)

    expect(result.marketValue).toBe(8750.0)
    expect(result.totalCost).toBe(7512.5)
    expect(result.gainLoss).toBe(1237.5)
    expect(result.gainLossPercent).toBe(16.47)
  })

  it('calculates correct P/L with negative loss', () => {
    const position = { shares: 100, costBasis: 50.0 }
    const result = calculatePositionValue(position, 45.5)

    expect(result.marketValue).toBe(4550.0)
    expect(result.totalCost).toBe(5000.0)
    expect(result.gainLoss).toBe(-450.0)
    expect(result.gainLossPercent).toBe(-9.0)
  })

  it('returns all zeros when shares are zero', () => {
    const position = { shares: 0, costBasis: 100.0 }
    const result = calculatePositionValue(position, 150.0)

    expect(result.marketValue).toBe(0)
    expect(result.totalCost).toBe(0)
    expect(result.gainLoss).toBe(0)
    expect(result.gainLossPercent).toBe(0)
  })

  it('handles rounding to 2 decimal places correctly', () => {
    const position = { shares: 3, costBasis: 33.33 }
    const result = calculatePositionValue(position, 44.44)

    expect(result.marketValue).toBe(133.32)
    expect(result.totalCost).toBe(99.99)
    expect(result.gainLoss).toBe(33.33)
    expect(result.gainLossPercent).toBe(33.33)
  })

  it('returns 0% gain when totalCost is zero', () => {
    const position = { shares: 100, costBasis: 0 }
    const result = calculatePositionValue(position, 100.0)

    expect(result.marketValue).toBe(10000.0)
    expect(result.totalCost).toBe(0)
    expect(result.gainLoss).toBe(10000.0)
    expect(result.gainLossPercent).toBe(0)
  })
})

describe('calculatePortfolioSummary', () => {
  it('calculates summary for multiple positions with quotes', () => {
    const positions = [
      { ticker: 'AAPL', shares: 50, costBasis: 150.25 },
      { ticker: 'MSFT', shares: 100, costBasis: 50.0 },
    ]

    const quotes: QuoteMap = new Map([
      ['AAPL', { price: 175, change: 1, changePercent: 0.5 }],
      ['MSFT', { price: 45.5, change: -0.5, changePercent: -1 }],
    ])

    const result = calculatePortfolioSummary(positions, quotes)

    expect(result.totalValue).toBe(13300.0)
    expect(result.totalCost).toBe(12512.5)
    expect(result.totalGainLoss).toBe(787.5)
    expect(result.totalGainLossPercent).toBe(6.29)
    expect(result.positionCount).toBe(2)
  })

  it('skips positions without quotes in the map', () => {
    const positions = [
      { ticker: 'AAPL', shares: 50, costBasis: 150.25 },
      { ticker: 'GOOG', shares: 10, costBasis: 100.0 },
    ]

    const quotes: QuoteMap = new Map([
      ['AAPL', { price: 175, change: 1, changePercent: 0.5 }],
    ])

    const result = calculatePortfolioSummary(positions, quotes)

    expect(result.positionCount).toBe(1)
    expect(result.totalValue).toBe(8750.0)
    expect(result.totalCost).toBe(7512.5)
    expect(result.totalGainLoss).toBe(1237.5)
    expect(result.totalGainLossPercent).toBe(16.47)
  })

  it('handles empty positions array', () => {
    const quotes: QuoteMap = new Map([
      ['AAPL', { price: 175, change: 1, changePercent: 0.5 }],
    ])

    const result = calculatePortfolioSummary([], quotes)

    expect(result.totalValue).toBe(0)
    expect(result.totalCost).toBe(0)
    expect(result.totalGainLoss).toBe(0)
    expect(result.totalGainLossPercent).toBe(0)
    expect(result.positionCount).toBe(0)
  })

  it('handles empty quotes map', () => {
    const positions = [
      { ticker: 'AAPL', shares: 50, costBasis: 150.25 },
      { ticker: 'MSFT', shares: 100, costBasis: 50.0 },
    ]

    const quotes: QuoteMap = new Map()

    const result = calculatePortfolioSummary(positions, quotes)

    expect(result.totalValue).toBe(0)
    expect(result.totalCost).toBe(0)
    expect(result.totalGainLoss).toBe(0)
    expect(result.totalGainLossPercent).toBe(0)
    expect(result.positionCount).toBe(0)
  })

  it('returns 0% gain when total cost is zero across portfolio', () => {
    const positions = [
      { ticker: 'AAPL', shares: 100, costBasis: 0 },
    ]

    const quotes: QuoteMap = new Map([
      ['AAPL', { price: 150, change: 1, changePercent: 0.5 }],
    ])

    const result = calculatePortfolioSummary(positions, quotes)

    expect(result.totalValue).toBe(15000.0)
    expect(result.totalCost).toBe(0)
    expect(result.totalGainLossPercent).toBe(0)
  })
})
