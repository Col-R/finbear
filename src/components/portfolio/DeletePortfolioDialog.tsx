"use client"

import { useState } from "react"
import { deletePortfolio } from "@/app/dashboard/actions"
import { Button } from "@/components/ui/button"
import {   
    Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,} from "@/components/ui/dialog"
import { Trash2 } from "lucide-react"

export default function DeletePortfolioDialog({
    id,
    name,
} : {
    id: string;
    name: string;
}) {
    const [open, setOpen] = useState(false);
    const [pending, setPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function onAction(fd: FormData) {
        setPending(true);
        setError(null);

        try{
            await deletePortfolio(fd);
            setOpen(false);
        } catch(e: unknown){
            if (e instanceof Error) {
                setError(e.message)
            } else {
                setError("Failed to delete portfolio")
            } 
        } finally {
            setPending(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Delete portfolio">
                <Trash2 className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Delete “{name}”?</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">
                This will remove the portfolio{` `}
                <span className="font-medium">{name}</span>
                {` `}
                {`and`} all its positions.
                </p>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <form action={onAction}>
                <input type="hidden" name="id" value={id} />
                <DialogFooter className="mt-4">
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                    </Button>
                    <Button type="submit" variant="destructive" disabled={pending}>
                    {pending ? "Deleting…" : "Delete"}
                    </Button>
                </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )

}