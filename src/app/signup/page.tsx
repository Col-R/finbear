'use client';

import registerUser from '@/components/auth/RegisterUser'
import { useFormStatus } from 'react-dom';

export default function SignupForm() {
  const { pending } = useFormStatus()
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <form action={registerUser} className='space-y-4'>
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="input"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          className="input"
        />
        <button type="submit" disabled={pending} className="btn">
          {pending ? "Creating…" : "Sign up"}
        </button>
      </form>
    </div>
  )
}
