"use client";

/**
 * Sign‑in page for Clerk.
 * This regular page (non‑catch‑all) ensures the route `/sign-in` exists and
 * renders the Clerk `<SignIn>` component with path routing.
 */
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50">
      <SignIn path="/sign-in" routing="path" forceRedirectUrl="/" />
    </div>
  );
}
