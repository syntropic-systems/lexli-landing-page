# Lexli Landing Page — Handoff & Context

> **Purpose of this doc:** give a fresh chat / new contributor everything needed to
> work on this repo without prior conversation history. Read this first.

---

## TL;DR

This is the **single-page marketing site for Lexli**, an AI legal workspace for
Indian legal teams. It was **bootstrapped from the CloudGlance landing-page repo** by
harvesting the reusable foundation and discarding all multi-page machinery.

- **Stack:** Next.js 16 (App Router, Turbopack) · React 19 · Tailwind CSS v4 · shadcn/ui · framer-motion
- **Shape:** one page — Hero → Features → How it works → Who it's for → CTA
- **Status:** builds clean, dev server boots (HTTP 200). Initial commit only. Not yet deployed.
- **Location:** `/home/yash/dev_folder/syntropic_systems/lexli-landing-page` (fresh git repo, `master` branch)

---

## How this repo was created

It is **not** a generic scaffold. It was created by copying the reusable base out of the
sibling CloudGlance repo and rebuilding the page layer for a single page.

**Source repo (the reference for all future upgrades):**
`/home/yash/dev_folder/syntropic_systems/landing-page` — the CloudGlance landing page.
When you need a component, animation, pattern, or config that isn't here yet, **look there
first** — it's a richer, multi-page version of the same foundation.

### What was carried over (the shared foundation)

- All config: `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`,
  `eslint.config.mjs`, `.prettierrc`, `components.json`, `vercel.json`, `.gitignore`
- `lib/utils.ts` (`cn()` helper)
- Every `components/ui/*` shadcn primitive
- Animation system: `components/animations/` (`RevealOnScroll`, `StaggerChildren`/`StaggerItem`, `CountUp`)
- Theme system: `theme-provider`, `theme-toggle`, `theme-aware-image`
- Layout primitives: `section.tsx`, `hero-section.tsx`, `cta-section.tsx`, `page-header.tsx`, `feature-card.tsx`
- `Aurora.tsx` (WebGL hero background, used by `hero-section`)
- `contact-form.tsx` (emailjs-based; **present but NOT used on the page yet**)
- **Showcase animation scaffolding** (the key reusable engine): `components/showcases/useStepAnimation.ts`,
  `useInView.ts`, `AnimatedItem.tsx` — kept deliberately so bespoke Lexli showcases can be built later
- `styles/globals.css` (Tailwind v4 `@theme` design tokens, light + dark)

### What was dropped from CloudGlance

- All `app/(site)/*` pages (product, automations + sub-routes, solutions, company, contact, pricing, faq)
- Blog: `content/`, `lib/blog.ts`, `blog-toc`, MDX deps
- Pricing: `data/pricing.ts`, `components/pricing/*`
- Every CloudGlance-specific showcase (tender-bidding, tender-evaluation, rfx, product)
- The cross-page scroll machinery (`scroll-to-section.tsx`, sessionStorage nav data)
- The complex multi-page nav dropdown logic
- All CloudGlance `public/` assets (logos, screenshots, integrations, team photos)
- CloudGlance-only deps (mdx, gray-matter, reading-time, recharts, cobe, lenis, etc.)

### What was newly written for Lexli

- `app/layout.tsx` — Lexli metadata, JSON-LD (SoftwareApplication + Organization), fonts, theme, shell
- `app/page.tsx` — the single landing page
- `components/nav/SiteHeader.tsx` — **simplified** single-page header (smooth in-page anchor scroll,
  no dropdowns, no sessionStorage)
- `components/footer.tsx` — rewritten for Lexli with anchor links (overwrote the copied CloudGlance one)
- `data/features.ts` — the 4 current features (copy source: the product overview)
- `app/robots.ts`, `app/sitemap.ts` (single URL), `app/manifest.ts`, `app/icon.tsx` ("L" monogram favicon)
- `app/not-found.tsx` — trimmed 404

---

## Content source & guardrails

The page copy comes from the **Lexli product overview** (originally at
`docs/personal/lexli-overview.md` in the *CloudGlance* repo — not copied here; ask the user
for it if you need the full source, or see "Features" below for what's already encoded).

**Hard guardrails from that overview (do not violate without user confirmation):**

- ❌ **No unverified claims.** Security/compliance (encryption, data residency, certifications),
  pricing, "trusted by" logos, and metrics ("save X hours", "N% faster") are **intentionally
  absent** because they were not confirmed. Add only what's verified true.
- E-filing copy stays generic ("file with the courts") until specific courts/portals are confirmed.
- Languages = **Marathi / Hindi / English** (current defaults; configurable).
- Open naming questions (unconfirmed): "Lexli" vs "LEXLI" styling, final tagline, whether
  "AI Case Assistant" / "Document Scanner" are the final public feature names.

### The 4 current features (in `data/features.ts`)

1. **Case Management** — every matter in one place, shared up-to-date record
2. **AI Case Assistant** — plain-language Q&A over your own case files, **with citations**
3. **AI Legal Translation** — PDF → Marathi/Hindi/English → clean DOCX + PDF
4. **Document Scanner** — phone capture → searchable PDF saved to the case

**Roadmap (deliberately NOT on the page yet):** Live Case Updates, Automated Case E-Filing.

---

## Repo structure

```
app/
  layout.tsx        root shell: fonts, ThemeProvider, metadata + JSON-LD, header/footer,
                    fixed radial-dot background
  page.tsx          the single page (all sections + anchor ids)
  icon.tsx          dynamic "L" monogram favicon (edge runtime)
  manifest.ts robots.ts sitemap.ts not-found.tsx
components/
  nav/SiteHeader.tsx     sticky, blur-on-scroll, smooth anchor scroll, mobile sheet
  footer.tsx             Lexli footer, anchor links
  hero-section.tsx       Aurora background + forced scroll-past-hero on desktop
  section.tsx            universal section wrapper (animated title/description)
  cta-section.tsx feature-card.tsx page-header.tsx
  Aurora.tsx contact-form.tsx (contact-form unused so far)
  animations/            RevealOnScroll, StaggerChildren/Item, CountUp
  showcases/             useStepAnimation, useInView, AnimatedItem  (scaffolding only)
  ui/                    shadcn primitives
  theme-*.tsx
  index.ts               barrel export
data/
  features.ts            feature copy (edit here for feature wording)
lib/utils.ts             cn()
styles/globals.css       Tailwind v4 @theme tokens (primary = slate-blue hsl(208 46% 33%))
```

### Section anchors (must stay in sync between header, footer, and page)

`#features` · `#how-it-works` · `#who-its-for` · `#contact`
Defined in `app/page.tsx`; linked from `components/nav/SiteHeader.tsx` and `components/footer.tsx`.
If you rename/add a section, update all three.

---

## Mental model for editing

1. **Pages are composition shells.** `app/page.tsx` declares content as local arrays
   (`audiences`, `steps`) and `data/features.ts`, then composes `Section` + cards. Logic lives
   in components, not the page.
2. **`Section` is the universal wrapper** — use it for consistent spacing + animated headers.
3. **Copy changes → edit `data/features.ts` or the arrays in `app/page.tsx`**, not JSX structure.
4. **Theming is token-based** in `styles/globals.css` (`@theme` + `:root`/`.dark`). Primary is slate-blue.
5. **Need a richer component?** Port it from the CloudGlance repo (see source path above) rather
   than rebuilding from scratch.

---

## Current state / known issues

- ✅ `npm run build` passes (TypeScript clean, 6 routes generate)
- ✅ `npm run dev` boots, `/` returns HTTP 200, correct `<title>`
- ⚠️ `npm run lint` runs but leaves **~9 warnings in inherited foundation files**
  (`theme-aware-image`, `showcases/*`, `infinite-moving-cards`, `navbar-menu`, `stagger-children`).
  These are the `setMounted(true)` mount-guard and framer-motion typing patterns that the
  CloudGlance repo itself ships and accepts. Not bugs; left as the inherited baseline.
- 🔧 **Config fixes applied during bootstrap** (don't revert):
  - ESLint pinned to `^9.0.0` — ESLint 10 breaks `eslint-config-next`'s bundled react plugin.
  - Added `dist/**` to `eslint.config.mjs` ignores — `next.config.ts` uses `distDir: 'dist'`,
    and the inherited config only ignored `.next/`.

---

## Placeholders to replace before launch

| Thing | Current value | Where |
|---|---|---|
| Sign In URL | `https://app.lexli.ai` | `SiteHeader.tsx`, `footer.tsx` |
| Book a Demo target | `mailto:hello@lexli.ai` | `app/page.tsx` (CTA) |
| LinkedIn | `https://www.linkedin.com/company/lexli-ai` | `footer.tsx`, `layout.tsx` JSON-LD |
| Site URL | `https://lexli.ai` | `layout.tsx`, `robots.ts`, `sitemap.ts` |
| Logo | "Lexli" wordmark + "L" favicon (no SVG asset yet) | `SiteHeader.tsx`, `footer.tsx`, `app/icon.tsx` |

---

## Likely next tasks (and how to approach them)

- **Build bespoke animated showcases** (chat-with-citations, translation, scanner). Use the
  scaffolding in `components/showcases/` (`useStepAnimation`). Reference CloudGlance's showcases
  in the source repo (`components/showcases/`) for the established pattern.
- **Wire a real Book-a-Demo flow** — either the existing `contact-form.tsx` (needs emailjs env
  vars: see CloudGlance repo for the env var names) or a Calendly/Cal.com embed (CloudGlance has
  `cal-widget.tsx` you can port).
- **Add a real logo** — replace the wordmark/monogram once a brand asset exists.
- **Deploy to Vercel** — `output: 'standalone'`, `distDir: 'dist'` already set.

---

## Commands

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build -> dist/
npm run lint
```

> Node engine note: package targets Node 20.19+/22.13+/24+. Local Node was 20.13 during
> bootstrap (works, emits an EBADENGINE warning only).

---

## Resuming work in a fresh chat

A Claude Code session is tied to the directory it launched in; there is **no command to move a
live conversation between repos**. To continue here: start a new Claude Code session with this
repo (`lexli-landing-page`) as the working directory and point it at this doc
(`docs/HANDOFF.md`). This doc is the handoff mechanism — it carries the full context.
