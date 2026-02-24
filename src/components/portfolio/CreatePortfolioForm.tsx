"use client"

import { useState } from "react"
import { createPortfolio } from "@/app/dashboard/actions"
import { toast } from "sonner"
import { Input } from "../ui/input"
import { Button } from '../ui/button'
import { Plus } from "lucide-react"

export default function CreatePortfolioForm() {

    const [pending, setPending] = useState(false)
    const [name, setName] = useState('')

    async function onAction(fd:FormData) {
        setPending(true);
        try{
            await createPortfolio(fd);
            setName("");
            toast.success('Portfolio created')
        } catch (e) {
            if (e instanceof Error) {
                toast.error(e.message)
            } else {
                toast.error('Failed to create portfolio')
            }
        } finally {
            setPending(false)
        }
    }

    return (
        <form action={onAction}>
            <Input
                name="name"
                placeholder="Pretax, Crypto, Retirement..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-56"
            />

            <Button type="submit" disabled={pending}>
                <Plus className="mr-2 h-4 w-4"/>
                {pending ? "Creating..." : "New Portfolio"}
            </Button>
        </form>
    )
}