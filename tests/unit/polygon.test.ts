import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

vi.mock("server-only", () => ({}))

import { getQuotes, __resetCache } from "@/lib/quotes/polygon"
import type { QuoteData } from "@/lib/quotes/polygon"

function makeSnapshotResponse(
  entries: { ticker: string; close: number; change: number; changePerc: number }[]
) {
  return {
    status: "OK",
    tickers: entries.map((e) => ({
      ticker: e.ticker,
      day: { c: e.close, o: 0, h: 0, l: 0, v: 0 },
      todaysChange: e.change,
      todaysChangePerc: e.changePerc,
    })),
  }
}

const fetchMock = vi.fn()

beforeEach(() => {
  vi.useFakeTimers()
  __resetCache()
  vi.stubEnv("POLYGON_API_KEY", "test-key")
  vi.stubGlobal("fetch", fetchMock)
  fetchMock.mockReset()
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})

describe("getQuotes", () => {
  it("returns empty Map for empty ticker array without calling fetch", async () => {
    const result = await getQuotes([])

    expect(result).toBeInstanceOf(Map)
    expect(result.size).toBe(0)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("fetches batch snapshot and maps response correctly for 3 tickers", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve(
          makeSnapshotResponse([
            { ticker: "AAPL", close: 150.25, change: 1.25, changePerc: 0.83 },
            { ticker: "MSFT", close: 380.0, change: -2.5, changePerc: -0.66 },
            { ticker: "GOOG", close: 140.0, change: 3.0, changePerc: 2.19 },
          ])
        ),
    })

    const result = await getQuotes(["AAPL", "MSFT", "GOOG"])

    expect(fetchMock).toHaveBeenCalledOnce()
    expect(result.size).toBe(3)

    const aapl = result.get("AAPL") as QuoteData
    expect(aapl.price).toBe(150.25)
    expect(aapl.change).toBe(1.25)
    expect(aapl.changePercent).toBe(0.83)

    const msft = result.get("MSFT") as QuoteData
    expect(msft.price).toBe(380.0)
    expect(msft.change).toBe(-2.5)

    const goog = result.get("GOOG") as QuoteData
    expect(goog.changePercent).toBe(2.19)

    const url = fetchMock.mock.calls[0][0] as string
    expect(url).toContain("tickers=AAPL,MSFT,GOOG")
    expect(url).toContain("apiKey=test-key")
  })

  it("serves cached data without fetching when within TTL", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve(
          makeSnapshotResponse([
            { ticker: "AAPL", close: 150.0, change: 1.0, changePerc: 0.5 },
          ])
        ),
    })

    await getQuotes(["AAPL"])
    expect(fetchMock).toHaveBeenCalledOnce()

    vi.advanceTimersByTime(30_000)

    const result = await getQuotes(["AAPL"])
    expect(fetchMock).toHaveBeenCalledOnce()
    expect(result.get("AAPL")?.price).toBe(150.0)
  })

  it("re-fetches after cache TTL expires", async () => {
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve(
            makeSnapshotResponse([
              { ticker: "AAPL", close: 150.0, change: 1.0, changePerc: 0.5 },
            ])
          ),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve(
            makeSnapshotResponse([
              { ticker: "AAPL", close: 155.0, change: 6.0, changePerc: 4.0 },
            ])
          ),
      })

    await getQuotes(["AAPL"])
    expect(fetchMock).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(61_000)

    const result = await getQuotes(["AAPL"])
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(result.get("AAPL")?.price).toBe(155.0)
  })

  it("returns empty Map on API failure (network error)", async () => {
    fetchMock.mockRejectedValueOnce(new Error("network down"))

    const result = await getQuotes(["AAPL"])

    expect(result).toBeInstanceOf(Map)
    expect(result.size).toBe(0)
  })

  it("returns empty Map on non-OK HTTP status", async () => {
    fetchMock.mockResolvedValueOnce({ ok: false, status: 500 })

    const result = await getQuotes(["AAPL"])

    expect(result.size).toBe(0)
  })

  it("only fetches uncached tickers in a mixed request", async () => {
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve(
            makeSnapshotResponse([
              { ticker: "AAPL", close: 150.0, change: 1.0, changePerc: 0.5 },
            ])
          ),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve(
            makeSnapshotResponse([
              { ticker: "MSFT", close: 380.0, change: 2.0, changePerc: 0.6 },
            ])
          ),
      })

    await getQuotes(["AAPL"])

    const result = await getQuotes(["AAPL", "MSFT"])

    expect(fetchMock).toHaveBeenCalledTimes(2)
    const secondUrl = fetchMock.mock.calls[1][0] as string
    expect(secondUrl).toContain("tickers=MSFT")
    expect(secondUrl).not.toContain("AAPL")

    expect(result.size).toBe(2)
    expect(result.get("AAPL")?.price).toBe(150.0)
    expect(result.get("MSFT")?.price).toBe(380.0)
  })
})
