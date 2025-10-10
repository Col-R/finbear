'use client'

import { useState } from 'react'
import { renamePortfolio } from '@/app/dashboard/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pencil } from 'lucide-react'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function RenamePortfolioDialog({
    id,
    currentName
}: {
    id: string,
    currentName: string
}) {
    const [open, setOpen] = useState(false);
    const [pending, setPending] = useState(false);
    const [name, setName] = useState(currentName);
    const [error, setError] = useState<string | null>(null);

    async function onAction(fd: FormData) {
        setPending(true);
        setError(null);

        try {
            await renamePortfolio(fd);
            setOpen(false);
        } catch (e) {
            if (e instanceof Error) {
                console.error('Caught error:', e.message);
                console.error('Stack trace', e.stack)
            } else {
                console.error('Unknown error caught: ', e)
            }
        } finally {
                setPending(false)
        }
    }

    return (
            <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Rename portfolio">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename portfolio</DialogTitle>
        </DialogHeader>

        <form action={onAction} className="space-y-4">
          <input type="hidden" name="id" value={id} />
          <Input
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="New portfolio name"
            required
            minLength={2}
            maxLength={64}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
    )
}