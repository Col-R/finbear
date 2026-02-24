import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('next/cache', () => ({
    revalidatePath: vi.fn(),
}))

vi.mock('server-only', () => ({}))

vi.mock('@/lib/prisma', () => ({
    prisma: {
        position: {
            findFirst: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
        },
        portfolio: {
            findFirst: vi.fn(),
        },
    },
}))

vi.mock('@/lib/auth/session', () => ({
    requireUserId: vi.fn(),
}))

import { updatePosition, deletePosition } from '@/app/dashboard/portfolios/[id]/actions'
import { prisma } from '@/lib/prisma'
import { requireUserId } from '@/lib/auth/session'
import { revalidatePath } from 'next/cache'

const mockPrisma = prisma as unknown as {
    position: {
        findFirst: ReturnType<typeof vi.fn>
        update: ReturnType<typeof vi.fn>
        delete: ReturnType<typeof vi.fn>
    }
    portfolio: {
        findFirst: ReturnType<typeof vi.fn>
    }
}
const mockRequireUserId = requireUserId as ReturnType<typeof vi.fn>
const mockRevalidatePath = revalidatePath as ReturnType<typeof vi.fn>

const OWNER_USER_ID = 'user-123'
const OTHER_USER_ID = 'user-456'
const POSITION_ID = 'pos-abc'
const PORTFOLIO_ID = 'port-xyz'

const mockPosition = {
    id: POSITION_ID,
    ticker: 'AAPL',
    shares: 10,
    costBasis: 150.00,
    portfolioId: PORTFOLIO_ID,
    portfolio: {
        id: PORTFOLIO_ID,
        userId: OWNER_USER_ID,
    },
}

function makeFormData(fields: Record<string, string>): FormData {
    const fd = new FormData()
    for (const [k, v] of Object.entries(fields)) {
        fd.append(k, v)
    }
    return fd
}

beforeEach(() => {
    vi.clearAllMocks()
    mockRequireUserId.mockResolvedValue(OWNER_USER_ID)
    mockPrisma.position.findFirst.mockResolvedValue(mockPosition)
    mockPrisma.position.update.mockResolvedValue({ ...mockPosition })
    mockPrisma.position.delete.mockResolvedValue({ ...mockPosition })
})


describe('updatePosition', () => {
    it('updates position with valid data and calls revalidatePath', async () => {
        const fd = makeFormData({ shares: '20', costBasis: '175.50' })
        const result = await updatePosition(POSITION_ID, fd)

        expect(result).toBeUndefined()
        expect(mockPrisma.position.update).toHaveBeenCalledWith({
            where: { id: POSITION_ID },
            data: { shares: 20, costBasis: 175.50 },
        })
        expect(mockRevalidatePath).toHaveBeenCalledWith(`/dashboard/portfolios/${PORTFOLIO_ID}`)
    })

    it('updates only ticker when only ticker provided', async () => {
        const fd = makeFormData({ ticker: 'msft' })
        const result = await updatePosition(POSITION_ID, fd)

        expect(result).toBeUndefined()
        expect(mockPrisma.position.update).toHaveBeenCalledWith({
            where: { id: POSITION_ID },
            data: { ticker: 'MSFT' },
        })
    })

    it('returns error when no fields provided (Zod refine fails)', async () => {
        const fd = makeFormData({})
        const result = await updatePosition(POSITION_ID, fd)

        expect(result).toEqual({ error: expect.stringContaining('At least one field') })
        expect(mockPrisma.position.update).not.toHaveBeenCalled()
    })

    it('returns error when shares is invalid (negative number)', async () => {
        const fd = makeFormData({ shares: '-5' })
        const result = await updatePosition(POSITION_ID, fd)

        expect(result).toHaveProperty('error')
        expect(mockPrisma.position.update).not.toHaveBeenCalled()
    })

    it('returns error when user does not own the position', async () => {
        mockRequireUserId.mockResolvedValue(OTHER_USER_ID)
        const fd = makeFormData({ shares: '20' })
        const result = await updatePosition(POSITION_ID, fd)

        expect(result).toEqual({ error: 'Not authorized' })
        expect(mockPrisma.position.update).not.toHaveBeenCalled()
    })

    it('returns error when position is not found', async () => {
        mockPrisma.position.findFirst.mockResolvedValue(null)
        const fd = makeFormData({ shares: '20' })
        const result = await updatePosition(POSITION_ID, fd)

        expect(result).toEqual({ error: 'Position not found' })
        expect(mockPrisma.position.update).not.toHaveBeenCalled()
    })
})


describe('deletePosition', () => {
    it('deletes position for valid owner and calls revalidatePath', async () => {
        const result = await deletePosition(POSITION_ID)

        expect(result).toBeUndefined()
        expect(mockPrisma.position.delete).toHaveBeenCalledWith({
            where: { id: POSITION_ID },
        })
        expect(mockRevalidatePath).toHaveBeenCalledWith(`/dashboard/portfolios/${PORTFOLIO_ID}`)
    })

    it('returns error when user does not own the position', async () => {
        mockRequireUserId.mockResolvedValue(OTHER_USER_ID)
        const result = await deletePosition(POSITION_ID)

        expect(result).toEqual({ error: 'Not authorized' })
        expect(mockPrisma.position.delete).not.toHaveBeenCalled()
    })

    it('returns error when position is not found', async () => {
        mockPrisma.position.findFirst.mockResolvedValue(null)
        const result = await deletePosition(POSITION_ID)

        expect(result).toEqual({ error: 'Position not found' })
        expect(mockPrisma.position.delete).not.toHaveBeenCalled()
    })

    it('does not revalidate when ownership check fails', async () => {
        mockRequireUserId.mockResolvedValue(OTHER_USER_ID)
        await deletePosition(POSITION_ID)

        expect(mockRevalidatePath).not.toHaveBeenCalled()
    })
})
