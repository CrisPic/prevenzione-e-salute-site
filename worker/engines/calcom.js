// Cal.com API v2 engine (https://cal.com/docs/api-reference/v2).
// Needs: Worker secret CALCOM_API_KEY, and booking.services[].eventTypeId in src/data/site.js.
// TODO before go-live: verify against a real account (free-plan API access, phone field, error shape).
import { addDays, localDate } from '../time.js';

const API = 'https://api.cal.com/v2';

async function call(env, path, { version, method = 'GET', body } = {}) {
  const res = await fetch(API + path, {
    method,
    headers: {
      authorization: `Bearer ${env.CALCOM_API_KEY}`,
      'cal-api-version': version,
      ...(body ? { 'content-type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  return { res, data };
}

// Cal.com error replies can echo the attendee's name, email or phone, even in
// fields that look like codes. Nothing from the provider is ever logged or rethrown:
// logs carry only our own diagnostic codes and the HTTP status.
export class EngineError extends Error {
  constructor(code, status) { super(code); this.name = 'EngineError'; this.code = code; this.status = status; }
}

// Known Cal.com error codes, matched as whole tokens (not loose words).
const SLOT_CODES = new Set(['no_available_users_found_error', 'booking_time_out_of_bounds_error', 'booking_conflict_error', 'hosts_unavailable_for_booking']);
const EMAIL_CODES = new Set(['email_domain_cannot_receive_mail', 'invalid_email', 'invalid_email_address']);

// Provider code + top-level message as lowercase tokens; used only to classify, never logged.
function errorTokens(data) {
  const parts = [data?.error?.code, data?.error?.message, data?.message, data?.code];
  return new Set(parts.filter((x) => typeof x === 'string').join(' ').toLowerCase().split(/[^a-z0-9_]+/).filter(Boolean));
}
const hasAny = (tokens, set) => [...set].some((c) => tokens.has(c));

export async function getSlots(service, cfg, env) {
  if (!service.eventTypeId) throw new EngineError('calcom_no_event_type');
  const { timeZone: tz, daysAhead, minNoticeHours } = cfg;
  const today = localDate(new Date(), tz);
  const end = addDays(today, daysAhead - 1);
  const q = new URLSearchParams({ eventTypeId: String(service.eventTypeId), start: today, end, timeZone: tz });
  const { res, data } = await call(env, `/slots?${q}`, { version: '2024-09-04' });
  if (!res.ok) throw new EngineError('calcom_slots_failed', res.status);

  const earliest = Date.now() + minNoticeHours * 36e5;
  const days = [];
  for (let i = 0; i < daysAhead; i++) {
    const date = addDays(today, i);
    const slots = (data.data?.[date] || [])
      .map((s) => (typeof s === 'string' ? s : s.start)) // "2026-11-13T09:00:00.000+01:00"
      .filter((s) => new Date(s).getTime() >= earliest)
      .map((s) => ({ time: s.slice(11, 16), start: new Date(s).toISOString() }));
    days.push({ date, slots });
  }
  return days;
}

export async function createBooking(input, cfg, env) {
  const { res, data } = await call(env, '/bookings', {
    method: 'POST',
    version: '2026-02-25',
    body: {
      start: input.start,
      eventTypeId: input.service.eventTypeId,
      attendee: { name: input.name, email: input.email, phoneNumber: input.phone, timeZone: cfg.timeZone, language: 'it' },
      metadata: { source: 'website' },
    },
  });
  if (res.ok) return { ok: true, uid: data.data?.uid };
  const tokens = errorTokens(data);
  // 1. Availability conflict: HTTP 409 or a known slot code -> patient picks another time.
  // 2. A known email code -> point at the email field.
  // 3. Anything else (auth, phone, unknown 400s) -> generic error.
  const outcome = res.status === 409 || hasAny(tokens, SLOT_CODES) ? 'slot_taken'
    : res.status === 400 && hasAny(tokens, EMAIL_CODES) ? 'invalid_email'
    : 'unknown';
  console.error('Cal.com booking failed', JSON.stringify({ op: 'createBooking', status: res.status, outcome }));
  if (outcome === 'slot_taken') return { error: 'slot_taken', status: 409 };
  if (outcome === 'invalid_email') return { error: 'invalid', field: 'email', status: 400 };
  return { error: 'server', status: 502 };
}
