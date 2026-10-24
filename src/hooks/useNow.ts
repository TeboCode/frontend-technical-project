"use client";

import { useSyncExternalStore } from "react";

const MINUTE = 60_000;

function subscribe(onChange: () => void) {
  const id = setInterval(onChange, MINUTE / 4);
  return () => clearInterval(id);
}

// Snapshots change once a minute, so components re-render at most that often.
const getSnapshot = () => Math.floor(Date.now() / MINUTE) * MINUTE;
const getServerSnapshot = () => null;

/**
 * The current time, refreshed every minute. Returns null during server
 * rendering and hydration, so time-dependent UI never causes a mismatch.
 */
export function useNow(): Date | null {
  const timestamp = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return timestamp === null ? null : new Date(timestamp);
}
