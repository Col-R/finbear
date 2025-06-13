'use client';
import { useState } from 'react';

// shadCN
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";


export interface SignupFormProps {
  action: (formData: FormData) => Promise<void>;
}

export default function SignupForm({action}:SignupFormProps) {
  const [isPending, setIsPending] = useState(false)
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full h-full shadow-xl">
        <form
          action={action}
          onSubmit={() => setIsPending(true)}
          className="space-y-6"
        >
          <CardHeader>
            <CardTitle className="text-2xl">Create an account</CardTitle>
            <CardDescription>It’s quick and easy.</CardDescription>
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
              autoComplete="new-password"
            />
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
