"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Portfolio detail error:", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-lg py-20 text-center">
      <h1 className="mb-2 text-2xl font-semibold">Something went wrong</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Our bears couldn&rsquo;t load this portfolio. You can try again or go back.
      </p>
      <div className="flex justify-center gap-2">
        <Button onClick={reset} variant="secondary">Try again</Button>
        <Link href="/dashboard/portfolios">
          <Button>Back to portfolios</Button>
        </Link>
      </div>
    </div>
  );
}
