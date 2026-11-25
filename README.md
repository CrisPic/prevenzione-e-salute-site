# Prevenzione e Salute – website

Bilingual (IT/EN) static website for a medical studio in Milan offering non-competitive sports medical certificates.

**Stack:** Astro (static) · GitHub · Cloudflare Workers (static assets) · Medaid Book for bookings  
**Cost:** domain only (~€10–20/year)

## Run locally

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # output in dist/
```

## Structure

- `src/data/site.js` – address, phone, hours, prices, company details, Medaid booking link (single source of truth)
- `worker/` – small API for the site's own demo booking form, used only on branch previews (`BOOKING_MODE=mock`)
- `src/layouts/` – page layouts; `Base.astro` holds the design tokens
- `DESIGN.md` – design system conventions (spacing, type, colour, patterns)
- `src/pages/` – Italian pages at `/`, English pages in `src/pages/en/`

## Deploy

Every push to `main` is built and deployed automatically by Cloudflare Workers Builds. Other branches get a preview URL with demo booking.
