import Link from "next/link"
import { Button } from "@/components/ui/button";
import { signOut } from "@/app/auth/actions";
import { requireUser } from "@/lib/auth/session";

export default async function DashboardLayout ({
    children,
}: {children: React.ReactNode}) {
    const { auth, db } = await requireUser();

    return(
        <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
            <div className="flex items-center gap-6">
                <Link href="/dashboard" className="font-semibold tracking-tight">
                Finbear
                </Link>
                <nav className="hidden sm:flex items-center gap-4 text-sm text-muted-foreground">
                <Link href="/dashboard" className="hover:text-foreground">
                    Overview
                </Link>
                <Link href="/dashboard" className="hover:text-foreground">
                    Portfolios
                </Link>
                {/* Add more links as pages appear */}
                </nav>
            </div>

            {/* Server-action submit: posts straight to signOut and redirects to /login */}
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span>{db?.email ?? auth.email ?? ""}</span>
                <form action={signOut}>
                    <Button variant="ghost" size="sm">Sign out</Button>
                </form>
                </div>
            </div>
        </header>

        <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
        </div>
    )
}