# Design system – "Civico caldo"

Chosen 2026-11-16: a precise, civic layout (information first, strong wayfinding) on warm paper.
Tokens live in one place: `src/layouts/Base.astro` `:root`. Shared classes are defined right below them.

## Principles
- The service name is the page title. Price, duration, validity, location and what to bring come before any brand message.
- Sections are separated by a 2 px dark rule (`.sec`), never by cards, coloured bands or shadows.
- Azzurro (`--accent`) means "act" and is used for nothing else: one `.btn-primary` per view. Mark that button `data-primary-cta` so the mobile bar steps aside while it is on screen.
- No decorative icons, badges, gradients or scroll animation. The only line above a title is the `.kicker`, which says what the page covers, not a slogan. Motion (≤ 200 ms) only confirms an interaction and is disabled under `prefers-reduced-motion`.
- Missing contacts and photos are hidden, never shown as `[placeholder]`. Exceptions: opening hours read "In arrivo" (the FAQ refers to them) and P.IVA / PEC stay in the footer.
- Italian, formal "lei", informative only (health advertising rules).

## Tokens (Base.astro)
| Group | Tokens |
| --- | --- |
| Colour | `--brand` sage, `--brand-dark` headings/rules/footer, `--brand-soft` selected states, `--accent` action, `--text`, `--muted` (5.6:1), `--line` hairline, `--rule` section rule, `--line-control` input edges (≥ 3:1), `--bg` warm paper, `--card` form surface only |
| Space | `--space-1…16` on a 4 px base, `--gutter` 16 / 32 px |
| Type | Inter only. `--fs-body` 17 px / 1.6, `--fs-sm` 15, `--fs-xs` 13, `--fs-h1/h2/h3`, `--measure` 68ch |
| Shape | `--radius-s` 8 (inputs, tiles), `--radius-m` 10 (buttons, notes), `--radius-l` 14 (form, confirmation) |
| Motion | `--dur-fast` 120 ms, `--dur` 200 ms, `--ease` |

## Patterns
| Pattern | Where | Use for |
| --- | --- | --- |
| `.opening` + `.kicker` + `h1` + `.lead` | `Page.astro`, Home | Top of every page |
| `.sec` > `.container` > `.sec-head` + `.sec-body` | All pages | A section: heading column + content column on desktop, stacked on phones |
| `.facts` (`<dl>`) | Home hero, Prenota, Dove | Practical facts as label / value rows; `.facts__big` for the price, `<small>` for a condition |
| `PriceList.astro` | Home, Servizi | Services with price, from `serviceInfo` in `src/data/site.js` |
| `ol.rows` / `ul.rows` | Steps, checklists | Numbered or plain lists with hairlines |
| `FaqItem.astro` | Servizi | `<details>` FAQ |
| `InfoCallout.astro`, `.note` | Booking fallback, privacy | Short note with a sage left rule |
| `.btn`, `.btn-primary`, `.btn-lg`, `.btn-block`, `.arrow-link` | Everywhere | Actions and inline links |
| `MobileBar.astro` | Phones | Bottom bar: recap + Prenota, or Prenota / WhatsApp / Chiama when numbers exist |

## Content sources
- `src/data/site.js`: address, contacts, hours, prices, `serviceInfo` (approved service copy), booking services.
- Approved copy changes go through the doctor review (TASKS.md section 4).
