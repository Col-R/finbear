"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import {prisma} from "@/lib/prisma";
import { redirect } from "next/navigation";

/**
 * Handles the full sign-up flow:
 *  1) Create Supabase Auth user
 *  2) Upsert into Postgres `User` table (id = auth.uid)
 */
export default async function registerUser(formData: FormData) {
  const rawEmail = String(formData.get("email"))
  const email    = rawEmail.trim().toLowerCase();
  const password = String(formData.get("password"));

  // 1️⃣  Supabase signUp
  const supabase = await createServerSupabaseClient();          // cookie-aware SSR client

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
      console.error("SUPABASE signUp error →", { code: error.code, message: error.message });
  throw new Error(error.message);
  }
  const uid = data.user!.id;  

  // Upsert into User table – RLS lets this authenticated call through
  await prisma.user.upsert({
    where:  { id: uid },          // 'user.id' is already a UUID string
    create: { id: uid, email },   // can add default fields later
    update: {},                       // nothing to update for now
  });

  // Optional: send welcome email, analytics, etc.

  redirect("/dashboard");
}
