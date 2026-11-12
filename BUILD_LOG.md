# Build log

Decisions, tools and costs, kept for the portfolio.

| Date | Step | Tools | Cost | Notes |
| --- | --- | --- | --- | --- |
| 2026-11-10 | Brief, competitor research, Italian copy | Claude (Cowork, Docs) | €0 | 12 Milan providers compared; €50 at the low end of €50–120 |
| 2026-11-10 | Project scaffold (Astro 7, IT/EN routing), placeholder page | Claude, Astro | €0 | Build verified: 2 pages |
| 2026-11-10 | GitHub repo + Cloudflare Workers auto-deploy on push | Git, GitHub, Cloudflare | €0 | Live at prevenzione-e-salute-site.pichin-cristian.workers.dev |
| 2026-11-10 | Home + Servizi, Prenota, Partner, Contatti, Privacy (IT); palette A teal+lime; self-hosted Inter font | Claude, Astro | €0 | 7 pages build; palette chosen from 4 rendered options |
| 2026-11-12 | v2 canvas fixes (repeated facts, lime = action, mobile hero, partner link, Partner sticky bar, one footer, radius/tile tokens, trimmed frames) + desktop Servizi/Prenota/Partner/Contatti designs | Claude (Cowork, Design canvas) | €0 | TASKS.md section 1, [Claude] items |
| 2026-11-12 | Astro: shared components (IconTile, ServiceRow, StepTimeline, FaqItem, PriceCard, InfoCallout), no-JS mobile menu, shape tokens, focus styles + skip link, 44 px footer links, 80 px mobile-bar space, EN link hidden | Claude, Astro | €0 | Build OK (7 pages); checked at 390 and 1440 px, no horizontal overflow |
| 2026-11-12 | SEO audit (source + live site): score 62/100; main gaps: no sitemap/robots rules, no canonical/OG, no LocalBusiness/FAQ schema, trailing-slash redirects, no 404 page | Claude Code (searchfit-seo) | €0 | Audit only, no code changes |
| 2026-11-12 | SEO fixes: sitemap + robots.txt, canonical, OG/Twitter + share image, MedicalClinic + FAQPage JSON-LD, trailing-slash links, 404 page, noindex until go-live, longer descriptions, home heading order, .num contrast | Claude Code | €0 | Build OK (8 pages); built locally via npx node@22 |
