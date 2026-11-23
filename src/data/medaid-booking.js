import { site } from './site.js';

// Cloudflare branch builds serve mock bookings, including when Medaid is live on main.
const branch = process.env.WORKERS_CI_BRANCH;
const isLocalBuild = !process.env.WORKERS_CI && !branch;
export const medaidBookingEnabled = site.medaidBooking.enabled && (isLocalBuild || branch === 'main');
