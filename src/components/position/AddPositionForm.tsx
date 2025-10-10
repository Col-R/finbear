'use client'

import { useState } from 'react'
import { addPosition } from '@/app/dashboard/portfolios/[id]/actions'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AddPositionForm({portfolioId}: { portfolioId: string}) {
    const [pending, setPending] = useState(false);
    const [error, setError] = useState<string | null>(null)

    const [ticker, setTicker] = useState("");
    const [shares, setShares] = useState("");
    const [costBasis, setCostBasis] = useState("");

    async function onAction(fd: FormData) {
        setPending(true);
        setError(null);
        try {
        // normalize a bit before sending (server still validates)
        const t = (fd.get("ticker") as string)?.trim().toUpperCase();
        fd.set("ticker", t);

        await addPosition(portfolioId, fd);
        // clear
        setTicker("");
        setShares("");
        setCostBasis("");
        } catch (e: any) {
        setError(e?.message ?? "Failed to add position.");
        } finally {
        setPending(false);
        }
    }

    return (
        <form action={onAction} className="grid grid-cols-1 gap-3 sm:grid-cols-4">
            <Input
                name="ticker"
                placeholder="Ticker (e.g., AAPL)"
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
                required
                className="uppercase"
                maxLength={10}
            />
            <Input
                name="shares"
                type="number"
                inputMode="decimal"
                placeholder="Shares"
                value={shares}
                onChange={(e) => setShares(e.target.value)}
                required
                min="0"
                step="any"
            />
            <Input
                name="costBasis"
                type="number"
                inputMode="decimal"
                placeholder="Cost basis ($)"
                value={costBasis}
                onChange={(e) => setCostBasis(e.target.value)}
                required
                min="0"
                step="any"
            />
            <Button type="submit" disabled={pending}>
                {pending ? "Adding…" : "Add position"}
            </Button>

            {error && (
                <p className="col-span-full text-sm text-red-600">{error}</p>
            )}
        </form>
    )
} 