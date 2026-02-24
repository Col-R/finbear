'use client'

import { useState } from 'react'
import { updatePosition } from '@/app/dashboard/portfolios/[id]/actions'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Pencil } from 'lucide-react'

interface EditPositionDialogProps {
  positionId: string
  ticker: string
  shares: number
  costBasis: number
}

export default function EditPositionDialog({
  positionId,
  ticker,
  shares: initialShares,
  costBasis: initialCostBasis,
}: EditPositionDialogProps) {
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)
  const [shares, setShares] = useState(initialShares.toString())
  const [costBasis, setCostBasis] = useState(initialCostBasis.toString())
  const [error, setError] = useState<string | null>(null)

  async function onAction(formData: FormData) {
    setPending(true)
    setError(null)
    
    try {
      const result = await updatePosition(positionId, formData)
      if (result?.error) {
        setError(result.error)
        toast.error(result.error)
        return
      }
      toast.success('Position updated')
      setOpen(false)
    } catch (e) {
      if (e instanceof Error) {
        // error logged on server
      } else {
        // unknown error
      }
      setError('An unexpected error occurred')
      toast.error('An unexpected error occurred')
    } finally {
      setPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Edit position">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit position: {ticker}</DialogTitle>
        </DialogHeader>
        <form action={onAction} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="shares" className="text-right text-sm font-medium">
              Shares
            </label>
            <Input
              id="shares"
              name="shares"
              type="number"
              value={shares}
              onChange={(e) => setShares(e.target.value)}
              className="col-span-3"
              step="any"
              min="0"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="costBasis" className="text-right text-sm font-medium">
              Cost Basis
            </label>
            <Input
              id="costBasis"
              name="costBasis"
              type="number"
              value={costBasis}
              onChange={(e) => setCostBasis(e.target.value)}
              className="col-span-3"
              step="any"
              min="0"
              required
              placeholder="Cost basis per share ($)"
            />
          </div>
          
          {error && <p className="text-sm text-red-600">{error}</p>}
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
