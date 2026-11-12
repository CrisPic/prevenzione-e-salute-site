// Demo engine: believable fake availability, nothing is stored or sent.
import { addDays, localDate, zonedToUtc } from '../time.js';

// Small deterministic hash so the same day always shows the same "busy" slots.
const hash = (s) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

const toMin = (t) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3));
const toTime = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

export async function getSlots(service, cfg) {
  const { timeZone: tz, daysAhead, minNoticeHours, mockHours } = cfg;
  const earliest = Date.now() + minNoticeHours * 36e5;
  const today = localDate(new Date(), tz);
  const days = [];
  for (let i = 0; i < daysAhead; i++) {
    const date = addDays(today, i);
    const weekday = new Date(`${date}T12:00:00Z`).getUTCDay();
    const slots = [];
    if (mockHours.days.includes(weekday)) {
      for (const [from, to] of mockHours.ranges) {
        for (let m = toMin(from); m + service.minutes <= toMin(to); m += 30) {
          const time = toTime(m);
          const start = zonedToUtc(date, time, tz);
          if (start.getTime() < earliest) continue;
          if (hash(date + time) % 3 === 0) continue; // ~1/3 already taken
          slots.push({ time, start: start.toISOString() });
        }
      }
    }
    days.push({ date, slots });
  }
  return days;
}

export async function createBooking() {
  return { ok: true };
}
