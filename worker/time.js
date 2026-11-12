// Time helpers for a fixed time zone (Europe/Rome), DST-safe, no libraries.

// Offset of `tz` at instant `date`, in minutes (e.g. +60 in winter, +120 in summer).
export function tzOffsetMinutes(date, tz) {
  const name = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'longOffset' })
    .formatToParts(date)
    .find((p) => p.type === 'timeZoneName').value; // "GMT+01:00" or "GMT"
  const m = name.match(/GMT([+-])(\d{2}):(\d{2})/);
  return m ? (m[1] === '-' ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3])) : 0;
}

// Local wall-clock time in `tz` -> UTC Date.
export function zonedToUtc(dateStr, timeStr, tz) {
  const guess = new Date(`${dateStr}T${timeStr}:00Z`);
  const off = tzOffsetMinutes(new Date(guess.getTime() - tzOffsetMinutes(guess, tz) * 6e4), tz);
  return new Date(guess.getTime() - off * 6e4);
}

// "YYYY-MM-DD" of instant `date` in `tz`.
export function localDate(date, tz) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
}

export function addDays(dateStr, n) {
  const d = new Date(`${dateStr}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}
