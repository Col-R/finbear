"use server"

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { requireUserId } from '@/lib/auth/session'

const AddPosition = z.object ({
    ticker: z.string().trim().toUpperCase().min(1).max(10),
    shares: z.coerce.number().positive(),
    costBasis: z.coerce.number()
        .min(0, { message: "Dollar amount cannot be negative" })
        .max(1000000, { message: "Dollar amount cannot exceed one million" })
        .refine((val) => Number(val.toFixed(2)) === val, {
            message: "Dollar amount must have at most two decimal places"}),
});

export async function addPosition(portfolioId: string, formData: FormData): Promise<void> {
    const userId = await requireUserId();

    const portfolio = await prisma.portfolio.findFirst ({
        where: { id: portfolioId, userId},
        select: { id: true }
    });
    if (!portfolio) throw new Error("Portfolio not found")

    const  { ticker, shares, costBasis } = AddPosition.parse({
        ticker: formData.get("ticker"),
        shares: formData.get("shares"),
        costBasis: formData.get("costBasis"),
    });

    await prisma.position.create({
        data: { portfolioId, ticker, shares, costBasis }
    });

    revalidatePath(`/dashboard/portfolios/${portfolioId}`)
}