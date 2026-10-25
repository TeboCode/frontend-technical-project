"use client";

import { Crown, HandMetal, Sparkles } from "lucide-react";
import { useEffect, useEffectEvent, useId, useRef, useState, type CSSProperties, type MouseEvent } from "react";

type PremiumFeatureDialogProps = {
  open: boolean;
  onClose: () => void;
};

/** How long the confetti plays before the dialog closes (matches --animate-confetti). */
const CELEBRATION_MS = 650;

const CONFETTI_COLORS = ["#43a047", "#f0b041", "#1a73e8", "#e53935", "#8e24aa"];

// Fixed (not random) so every burst looks the same: pieces fan out mostly
// upwards from the button, alternating spin direction.
const CONFETTI = Array.from({ length: 14 }, (_, index) => {
  const angle = Math.PI + (index / 13) * Math.PI;
  const distance = 70 + (index % 3) * 30;
  return {
    "--x": `${Math.round(Math.cos(angle) * distance)}px`,
    "--y": `${Math.round(Math.sin(angle) * distance)}px`,
    "--r": `${(index % 2 ? 1 : -1) * (200 + index * 15)}deg`,
    backgroundColor: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
  } as CSSProperties;
});

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Playful stand-in for logging out. Uses the native <dialog> in modal mode,
 * which traps focus, closes on Escape, makes the page behind it inert and
 * returns focus to the Log Out button when it closes.
 */
export function PremiumFeatureDialog({ open, onClose }: PremiumFeatureDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const titleId = useId();
  const descriptionId = useId();
  const handleClose = useEffectEvent(onClose);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Let the confetti play, then close.
  useEffect(() => {
    if (!isCelebrating) return;
    const timer = setTimeout(() => {
      setIsCelebrating(false);
      handleClose();
    }, CELEBRATION_MS);
    return () => clearTimeout(timer);
  }, [isCelebrating]);

  const respectTheHustle = () => {
    if (isCelebrating) return;
    if (prefersReducedMotion()) onClose();
    else setIsCelebrating(true);
  };

  // The dialog has no padding, so a click on the dialog element itself is a
  // click on the backdrop.
  const closeOnBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onClose={onClose}
      onClick={closeOnBackdropClick}
      className="playful-dialog m-auto w-[calc(100%-2rem)] max-w-sm overflow-visible rounded-2xl bg-card p-0 text-center text-body shadow-raised"
    >
      <div className="px-6 pt-8 pb-6">
        <div className="relative mx-auto flex size-20 items-center justify-center">
          <span className="flex size-20 items-center justify-center rounded-full bg-linear-to-br from-amber-200 to-amber-400 text-amber-900 shadow-[0_6px_20px_rgb(240_176_65/0.45)] ring-4 ring-amber-100 dark:ring-amber-400/20">
            <Crown aria-hidden="true" className="size-10 motion-safe:animate-wiggle" />
          </span>
          <Sparkles aria-hidden="true" className="absolute -top-2 -right-3 size-6 text-amber-400 motion-safe:animate-twinkle" />
          <Sparkles aria-hidden="true" className="absolute -bottom-1 -left-4 size-4 text-brand motion-safe:animate-twinkle [animation-delay:0.6s]" />
        </div>

        <h2 id={titleId} className="mt-6 text-xl font-semibold text-heading">
          Premium feature detected
        </h2>
        <div id={descriptionId}>
          <p className="mt-2">Logging out is available in the full version.</p>
          <p className="mt-4 rounded-lg bg-muted px-4 py-3 text-sm italic">
            This is the version where I learn things and pretend they&apos;re intentional.
          </p>
        </div>

        <div className="relative mt-6">
          {isCelebrating && (
            <div aria-hidden="true" className="pointer-events-none absolute top-1/2 left-1/2">
              {CONFETTI.map((style, index) => (
                <span key={index} style={style} className="absolute size-2 rounded-[2px] animate-confetti" />
              ))}
            </div>
          )}
          <button
            type="button"
            autoFocus
            onClick={respectTheHustle}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-solid px-5 py-3 font-medium text-white transition hover:-rotate-1 hover:scale-[1.03] hover:bg-brand-solid-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand active:scale-95 motion-reduce:transform-none motion-reduce:transition-colors"
          >
            <HandMetal aria-hidden="true" className="size-5" />
            Respect the hustle
          </button>
        </div>
      </div>
    </dialog>
  );
}
