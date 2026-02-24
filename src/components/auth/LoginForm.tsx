'use client'

import { useState } from "react"
import { signIn } from "@/app/auth/actions"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card"

export default function LoginForm() {
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onAction(fd: FormData) {
    setIsPending(true)
    setError(null)
    
    try {
      const result = await signIn(fd)
      if (result?.error) {
        setError(result.error)
        toast.error(result.error)
        setIsPending(false)
      }
    } catch (error) {
      if (error instanceof Error && (error.message === 'NEXT_REDIRECT' || error.message.includes('NEXT_REDIRECT'))) {
        throw error
      }
      setIsPending(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full h-full shadow-xl">
        <form action={onAction} className="space-y-6">
          <CardHeader>
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>Enter your credentials to continue.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input 
              type="email" 
              name="email" 
              placeholder="you@example.com" 
              required 
              autoComplete="email" 
            />
            <Input 
              type="password" 
              name="password" 
              placeholder="Password" 
              required 
              autoComplete="current-password" 
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Logging in…" : "Log in"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
