'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma'

const CreatePortfolio = z.object({
    name: z.string().min(2, "Name too short").max(64, "Name too long"),
});

export async function createPortfolio(formData: FormData): Promise<void> {
    const supabase = await createServerSupabaseClient();
    const {
        data: {user}
    } = await supabase.auth.getUser()

    if (!user) throw new Error ("not authenticated");

  const parsed = CreatePortfolio.safeParse({
    name: String(formData.get("name") ?? "").trim(),
  });
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid name");
  }

  await prisma.portfolio.create({
    data: {
        name: parsed.data.name,
        userId: user.id //uuid from supabase auth
    }
  });

  revalidatePath('/dashboard');
}

