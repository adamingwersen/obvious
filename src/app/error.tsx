"use client";

import { Button } from "@/components/ui/button";

type ErrorBoundaryProps = {
  error: Error;
  reset: () => void;
};
export default function AppErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  const cause = typeof error.cause === "string" ? error.cause : "Unknown cause";
  // TODO - make this nicer
  return (
    <main className="flex h-screen items-center bg-primary text-zinc-200">
      <div className="mx-auto flex flex-col items-center justify-center gap-6">
        <p>{error.message}</p>
        <p>{cause}</p>
        <Button variant="secondary" onClick={reset}>
          Try again
        </Button>
      </div>
    </main>
  );
}
