'use client'

import { useState } from 'react'
import { deletePosition } from '@/app/dashboard/portfolios/[id]/actions'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Trash2 } from 'lucide-react'

interface DeletePositionButtonProps {
  positionId: string
  ticker: string
}

export default function DeletePositionButton({
  positionId,
  ticker,
}: DeletePositionButtonProps) {
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onAction() {
    setPending(true)
    setError(null)
    
    try {
      const result = await deletePosition(positionId)
      if (result?.error) {
        setError(result.error)
        toast.error(result.error)
        return
      }
      toast.success('Position deleted')
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
        <Button variant="ghost" size="icon" aria-label="Delete position">
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete &quot;{ticker}&quot;?</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          This will permanently remove this position.
        </p>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <form action={onAction}>
          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="destructive" disabled={pending}>
              {pending ? 'Deleting…' : 'Delete'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
