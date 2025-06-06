'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signUp(formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signUp({ email, password })
  if (error) {
    console.error('Signup error:', error)
    return
  }

  redirect('/dashboard')
}

export async function signIn(formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword( {email, password})
  if (error) {
    console.error('Login error:', error)
    return
  }

  redirect('/dashboard')
}

export async function getCurrentUser() {
  const supabase = await createServerSupabaseClient(); 
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
