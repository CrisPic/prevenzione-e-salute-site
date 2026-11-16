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

// Cal.com error replies can echo the attendee's name, email or phone.
// Never log or rethrow the raw body: keep only a short machine-readable code.
const SAFE_CODE = /^[A-Za-z0-9_.:-]{1,64}$/;
export function safeCode(data) {
  const code = data?.error?.code ?? data?.code;
  return typeof code === 'string' && SAFE_CODE.test(code) ? code : undefined;
}

// Text used only for classifying the error, never logged: the provider's own
// code + top-level message, not the details block (which can contain the email).
function errorText(data) {
  const parts = [data?.error?.code, data?.error?.message, data?.message, data?.code];
  return parts.filter((x) => typeof x === 'string').join(' ').toLowerCase();
}

export async function getSlots(service, cfg, env) {
  if (!service.eventTypeId) throw new Error(`No Cal.com eventTypeId for service "${service.id}"`);
  const { timeZone: tz, daysAhead, minNoticeHours } = cfg;
  const today = localDate(new Date(), tz);
  const end = addDays(today, daysAhead - 1);
  const q = new URLSearchParams({ eventTypeId: String(service.eventTypeId), start: today, end, timeZone: tz });
  const { res, data } = await call(env, `/slots?${q}`, { version: '2024-09-04' });
  if (!res.ok) throw new Error(`Cal.com slots failed: status ${res.status}, code ${safeCode(data) || 'n/a'}`);

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
      metadata: { source: 'website', phone: input.phone },
    },
  });
  if (res.ok) return { ok: true, uid: data.data?.uid };
  console.error('Cal.com booking failed', JSON.stringify({ op: 'createBooking', status: res.status, code: safeCode(data) }));
  const msg = errorText(data);
  // 1. A real availability conflict wins: the patient must pick another time.
  const taken = res.status === 409 || (res.status === 400 && /available|availability|booked|taken|conflict|no longer/.test(msg));
  if (taken) return { error: 'slot_taken', status: 409 };
  // 2. Only an error *about* the email (e.g. "email_domain_cannot_receive_mail") points at the email field.
  if (res.status === 400 && /email/.test(msg)) return { error: 'invalid', field: 'email', status: 400 };
  // 3. Auth (401/403) and anything else are setup problems: generic error + fallback.
  return { error: 'server', status: 502 };
}
