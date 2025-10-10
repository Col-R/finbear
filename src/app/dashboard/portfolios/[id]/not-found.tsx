// app/dashboard/portfolios/[id]/not-found.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg py-20 text-center">
      <h1 className="mb-2 text-2xl font-semibold">Portfolio not found</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        This portfolio doesn’t exist or you don’t have access to it.
      </p>
      <div className="flex justify-center gap-2">
        <Link href="/dashboard/portfolios">
          <Button variant="secondary">Back to portfolios</Button>
        </Link>
        <Link href="/dashboard">
          <Button>Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
