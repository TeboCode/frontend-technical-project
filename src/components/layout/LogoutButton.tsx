"use client";

import { useState } from "react";
import { PremiumFeatureDialog } from "./PremiumFeatureDialog";

type LogoutButtonProps = {
  className?: string;
};

// Playground: there's no real authentication, so logging out opens a joke
// "premium feature" dialog instead of ending a session.
export function LogoutButton({ className = "" }: LogoutButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => setIsDialogOpen(true)}
        className={`rounded-sm bg-danger-solid px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-danger-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger ${className}`}
      >
        Log Out
      </button>
      <PremiumFeatureDialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </>
  );
}
