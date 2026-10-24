// Opening-hours helpers. Times in the data are local South African time.
// Public holidays aren't detected (there's no holiday calendar yet), so on a
// holiday the regular weekday hours are shown.

import type { OpeningHours } from "./types";

export const BRANCH_TIME_ZONE = "Africa/Johannesburg";

type DayKey = Exclude<keyof OpeningHours, "publicHolidays">;
type TimeRange = { open: number; close: number };

export const OPENING_HOURS_LABELS: Record<keyof OpeningHours, string> = {
  mondayToFriday: "Monday – Friday",
  saturday: "Saturday",
  sunday: "Sunday",
  publicHolidays: "Public holidays",
};

/** Parses "09:00 - 18:00" into minutes after midnight; null when closed or unreadable. */
export function parseTimeRange(value: string): TimeRange | null {
  const match = value.match(/^(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  const [, oh, om, ch, cm] = match.map(Number);
  return { open: oh * 60 + om, close: ch * 60 + cm };
}

function dayKeyFor(weekday: number): DayKey {
  if (weekday === 0) return "sunday";
  if (weekday === 6) return "saturday";
  return "mondayToFriday";
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** The weekday (0 = Sunday) and minutes after midnight in branch-local time. */
function localTime(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: BRANCH_TIME_ZONE,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const part = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return {
    weekday: WEEKDAYS.indexOf(part("weekday")),
    minutes: Number(part("hour")) * 60 + Number(part("minute")),
  };
}

const formatMinutes = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

export type OpenStatus = {
  isOpen: boolean;
  /** e.g. "Closes 18:00" or "Opens tomorrow 09:00". */
  detail: string;
};

export function getOpenStatus(hours: OpeningHours, now: Date): OpenStatus {
  const { weekday, minutes } = localTime(now);
  const today = parseTimeRange(hours[dayKeyFor(weekday)]);

  if (today && minutes >= today.open && minutes < today.close) {
    return { isOpen: true, detail: `Closes ${formatMinutes(today.close)}` };
  }
  if (today && minutes < today.open) {
    return { isOpen: false, detail: `Opens ${formatMinutes(today.open)}` };
  }

  // Closed for the rest of today: find the next day with hours.
  for (let offset = 1; offset <= 7; offset++) {
    const day = (weekday + offset) % 7;
    const range = parseTimeRange(hours[dayKeyFor(day)]);
    if (range) {
      const when = offset === 1 ? "tomorrow" : WEEKDAYS[day];
      return { isOpen: false, detail: `Opens ${when} ${formatMinutes(range.open)}` };
    }
  }
  return { isOpen: false, detail: "Temporarily closed" };
}
