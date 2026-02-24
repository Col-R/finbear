import "server-only"

export type QuoteData = {
  price: number
  change: number
  changePercent: number
}

export type QuoteMap = Map<string, QuoteData>

type CacheEntry = { data: QuoteData; expiresAt: number }

const cache = new Map<string, CacheEntry>()
const CACHE_TTL_MS = 60_000

/** Exposed for testing only — clears the in-memory cache. */
export function __resetCache(): void {
  cache.clear()
}

interface PolygonTickerSnapshot {
  ticker: string
  day: { c: number; o: number; h: number; l: number; v: number }
  todaysChange: number
  todaysChangePerc: number
}

interface PolygonSnapshotResponse {
  status: string
  tickers: PolygonTickerSnapshot[]
}

/**
 * Fetch quotes for a batch of tickers using Polygon.io Snapshot endpoint.
 * Returns cached data when within TTL, fetches only uncached tickers via
 * a single batch request, and on API failure returns whatever was cached.
 */
export async function getQuotes(tickers: string[]): Promise<QuoteMap> {
  const result: QuoteMap = new Map()

  if (tickers.length === 0) return result

  const now = Date.now()
  const uncached: string[] = []

  for (const ticker of tickers) {
    const entry = cache.get(ticker)
    if (entry && entry.expiresAt > now) {
      result.set(ticker, entry.data)
    } else {
      uncached.push(ticker)
    }
  }

  if (uncached.length === 0) return result

  try {
    const apiKey = process.env.POLYGON_API_KEY
    if (!apiKey) {
      console.warn("[polygon] POLYGON_API_KEY not set")
      return result
    }

    const tickerList = uncached.join(",")
    const url = `https://api.polygon.io/v2/snapshot/locale/us/market/stocks/tickers?tickers=${tickerList}&apiKey=${apiKey}`

    const response = await fetch(url)

    if (!response.ok) {
      console.warn(`[polygon] API returned ${response.status}`)
      return result
    }

    const json: PolygonSnapshotResponse = await response.json()

    const fetchedAt = Date.now()
    for (const snap of json.tickers ?? []) {
      const data: QuoteData = {
        price: snap.day.c,
        change: snap.todaysChange,
        changePercent: snap.todaysChangePerc,
      }
      cache.set(snap.ticker, { data, expiresAt: fetchedAt + CACHE_TTL_MS })
      result.set(snap.ticker, data)
    }
  } catch (error) {
    console.warn("[polygon] fetch failed", error)
  }

  return result
}
