import "server-only";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function getAuthUser() {
    const supabase = await createServerSupabaseClient();
    const {data, error} = await supabase.auth.getUser();
    if (error) return null;
    return data.user ?? null;
}

export async function requireUser() {
    const user = await getAuthUser();
    if (!user) redirect("/login");
    const db = await prisma.user.findUnique({
        where: { id: user.id },
        select: { id: true, email: true, createdAt: true},
    });
    return {auth: { id: user.id, email: user.email }, db}
}

export async function requireUserId() {
    const u = await requireUser();
    return u.auth.id;
}