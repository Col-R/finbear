"use server"

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { requireUserId } from '@/lib/auth/session'

const AddPosition = z.object({
    ticker: z.string().trim().toUpperCase().min(1).max(10),
    shares: z.coerce.number().positive(),
    costBasis: z.coerce.number()
        .min(0, { message: "Dollar amount cannot be negative" })
        .max(1000000, { message: "Dollar amount cannot exceed one million" })
        .refine((val) => Number(val.toFixed(2)) === val, {
            message: "Dollar amount must have at most two decimal places"}),
});

const UpdatePosition = z.object({
    ticker: z.string().trim().toUpperCase().min(1).max(10).optional(),
    shares: z.coerce.number().positive().optional(),
    costBasis: z.coerce.number()
        .min(0, { message: "Dollar amount cannot be negative" })
        .max(1000000, { message: "Dollar amount cannot exceed one million" })
        .refine((val) => Number(val.toFixed(2)) === val, {
            message: "Dollar amount must have at most two decimal places"})
        .optional(),
}).refine((data) => Object.keys(data).some((k) => data[k as keyof typeof data] !== undefined), {
    message: "At least one field must be provided for update",
});

export async function addPosition(portfolioId: string, formData: FormData): Promise<void> {
    const userId = await requireUserId();

    const portfolio = await prisma.portfolio.findFirst({
        where: { id: portfolioId, userId},
        select: { id: true }
    });
    if (!portfolio) throw new Error("Portfolio not found")

    const { ticker, shares, costBasis } = AddPosition.parse({
        ticker: formData.get("ticker"),
        shares: formData.get("shares"),
        costBasis: formData.get("costBasis"),
    });

    await prisma.position.create({
        data: { portfolioId, ticker, shares, costBasis }
    });

    revalidatePath(`/dashboard/portfolios/${portfolioId}`)
}

export async function updatePosition(positionId: string, formData: FormData): Promise<{ error: string } | void> {
    const userId = await requireUserId();

    const position = await prisma.position.findFirst({
        where: { id: positionId },
        include: { portfolio: { select: { id: true, userId: true } } },
    });
    if (!position) return { error: "Position not found" };
    if (position.portfolio.userId !== userId) return { error: "Not authorized" };

    const result = UpdatePosition.safeParse({
        ticker: formData.get("ticker") ?? undefined,
        shares: formData.get("shares") ?? undefined,
        costBasis: formData.get("costBasis") ?? undefined,
    });
    if (!result.success) return { error: result.error.issues[0]?.message ?? "Invalid data" };

    const data = Object.fromEntries(
        Object.entries(result.data).filter(([, v]) => v !== undefined)
    ) as Partial<{ ticker: string; shares: number; costBasis: number }>;

    await prisma.position.update({
        where: { id: positionId },
        data,
    });

    revalidatePath(`/dashboard/portfolios/${position.portfolio.id}`);
}

export async function deletePosition(positionId: string): Promise<{ error: string } | void> {
    const userId = await requireUserId();

    const position = await prisma.position.findFirst({
        where: { id: positionId },
        include: { portfolio: { select: { id: true, userId: true } } },
    });
    if (!position) return { error: "Position not found" };
    if (position.portfolio.userId !== userId) return { error: "Not authorized" };

    await prisma.position.delete({
        where: { id: positionId },
    });

    revalidatePath(`/dashboard/portfolios/${position.portfolio.id}`);
}