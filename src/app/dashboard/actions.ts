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

const RenamePortfolio = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, "Name too short").max(64, "Name too long").trim(),
});

export async function renamePortfolio(formData: FormData): Promise<void> {
  
  const parsed = RenamePortfolio.parse({
    id:String(formData.get("id") ?? ""),
    name: String(formData.get("name") ?? "")
  })

  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  try {
    await prisma.portfolio.update({
      where: {
        id: parsed.id,
        userId: user.id,
      },
      data: { name: parsed.name}
    });
  } catch (e: unknown) {
    throw e;
  }
  revalidatePath('/dashboard')
}

const DeletePortfolio= z.object({
  id: z.string().uuid(),
})

export async function deletePortfolio(formData: FormData): Promise<void> {
  const { id } = DeletePortfolio.parse({
    id: String(formData.get("id") ?? "")
  });

  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error ("Not authenticated");

  // cascade delete for all positions within the portfolio
  const { count } = await prisma.portfolio.deleteMany({
    where: { id, userId:user.id}
  })

  if (count === 0) {
    // not found or not owned when deleteMany runs
    throw new Error("Portfolio not found")
  }

  revalidatePath('/dashboard')
}