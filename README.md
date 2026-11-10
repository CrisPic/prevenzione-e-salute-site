# Prevenzione e Salute – website

Bilingual (IT/EN) static website for a medical studio in Milan offering non-competitive sports medical certificates.

**Stack:** Astro (static) · GitHub · Cloudflare Pages · Cal.com/Calendly booking  
**Cost:** domain only (~€10–20/year)

## Run locally

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # output in dist/
```

## Structure

- `src/data/site.js` – address, phone, prices, booking link (single source of truth)
- `src/layouts/` – page layouts
- `src/pages/` – Italian pages at `/`, English pages in `src/pages/en/`

## Deploy

Every push to `main` is built and deployed automatically by Cloudflare Pages.
