// components/auth/LoginForm.tsx
'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return setError(error.message)
    router.push("/dashboard")
  }

  return (
    <>
      {error && <p className="text-red-500">{error}</p>}
      <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <Input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" />
      <Button onClick={handleLogin}>Login</Button>
    </>
  )
}
