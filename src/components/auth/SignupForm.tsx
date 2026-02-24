'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

export interface SignupFormProps {
  action: (formData: FormData) => Promise<void>;
}

export default function SignupForm({ action }: SignupFormProps) {
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onAction(fd: FormData) {
    setIsPending(true)
    setError(null)
    try {
      await action(fd)
    } catch (e) {
      if (e instanceof Error && (e.message === 'NEXT_REDIRECT' || e.message.includes('NEXT_REDIRECT'))) {
        throw e
      }
      const message = e instanceof Error ? e.message : 'Something went wrong'
      setError(message)
      toast.error(message)
      setIsPending(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full h-full shadow-xl">
        <form action={onAction} className="space-y-6">
          <CardHeader>
            <CardTitle className="text-2xl">Create an account</CardTitle>
            <CardDescription>It is quick and easy.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input type="email" name="email" placeholder="you@example.com" required autoComplete="email" />
            <Input type="password" name="password" placeholder="Password" required autoComplete="new-password" />
            {error && <p className="text-sm text-red-600">{error}</p>}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Creating…" : "Sign up"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
