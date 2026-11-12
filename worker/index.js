// Cloudflare Worker: serves the static site (ASSETS) and the booking API.
// Only /api/* reaches this code (see run_worker_first in wrangler.jsonc).
//
//   GET  /api/booking/slots?service=certificato  -> free slots for the next days
//   POST /api/booking                              -> create an appointment
//
// The visitor's browser only talks to this site; the booking engine (Cal.com)
// is called server-side, so no third-party script or cookie reaches the visitor.
import { booking } from '../src/data/site.js';
import * as mock from './engines/mock.js';
import * as calcom from './engines/calcom.js';

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });

const engineFor = (env) => {
  if (env.BOOKING_MODE === 'mock') return mock;
  if (env.BOOKING_MODE === 'calcom' && env.CALCOM_API_KEY) return calcom;
  return null; // "off" or misconfigured
};

const findService = (id) => booking.services.find((s) => s.id === id);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (!url.pathname.startsWith('/api/')) return env.ASSETS.fetch(request);

    const engine = engineFor(env);
    if (!engine) return json({ ok: false, error: 'disabled' }, 503);

    try {
      if (url.pathname === '/api/booking/slots' && request.method === 'GET') {
        const service = findService(url.searchParams.get('service'));
        if (!service) return json({ ok: false, error: 'invalid_service' }, 400);
        const days = await engine.getSlots(service, booking, env);
        return json({ ok: true, demo: engine === mock, timeZone: booking.timeZone, days });
      }

      if (url.pathname === '/api/booking' && request.method === 'POST') {
        // Same-origin only: blocks other sites from posting bookings through a visitor's browser
        const origin = request.headers.get('origin');
        if (origin && origin !== url.origin) return json({ ok: false, error: 'forbidden' }, 403);

        const body = await request.json().catch(() => null);
        const input = validate(body);
        if (input.error) return json({ ok: false, error: input.error, field: input.field }, 400);
        if (input.spam) return json({ ok: true, demo: true }); // honeypot filled: pretend success

        const result = await engine.createBooking(input, booking, env);
        if (result.error) return json({ ok: false, error: result.error }, result.status || 409);
        return json({ ok: true, demo: engine === mock, start: input.start, service: input.service.id });
      }

      return json({ ok: false, error: 'not_found' }, 404);
    } catch (err) {
      console.error('booking api error', err);
      return json({ ok: false, error: 'server' }, 502);
    }
  },
};

// Only name, phone, email, service, time (GDPR: no health data).
function validate(b) {
  if (!b || typeof b !== 'object') return { error: 'invalid' };
  if (b.website) return { spam: true };
  const service = findService(b.service);
  if (!service) return { error: 'invalid', field: 'service' };

  const start = typeof b.start === 'string' ? new Date(b.start) : null;
  const latestBookable = Date.now() + (booking.daysAhead + 1) * 864e5;
  const earliest = Date.now() + booking.minNoticeHours * 36e5 - 6e4;
  if (!start || isNaN(start) || start < earliest || start > latestBookable) return { error: 'invalid', field: 'start' };

  const name = String(b.name || '').trim().replace(/\s+/g, ' ');
  if (name.length < 3 || name.length > 80) return { error: 'invalid', field: 'name' };

  const email = String(b.email || '').trim().toLowerCase();
  if (email.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return { error: 'invalid', field: 'email' };

  const phone = normalizePhone(b.phone);
  if (!phone) return { error: 'invalid', field: 'phone' };

  if (b.privacy !== true) return { error: 'invalid', field: 'privacy' };

  return { service, start: start.toISOString(), name, email, phone };
}

// Italian numbers get +39; other countries must be typed with +prefix.
function normalizePhone(raw) {
  let p = String(raw || '').replace(/[\s.\-()/]/g, '');
  if (p.startsWith('00')) p = '+' + p.slice(2);
  if (!p.startsWith('+')) p = '+39' + p;
  return /^\+\d{8,15}$/.test(p) ? p : null;
}
