# Lexli — Landing Page

Single-page marketing site for **Lexli**, the AI legal workspace for Indian legal teams.

Built with Next.js 16 (App Router), React 19, Tailwind CSS v4, and shadcn/ui. The
foundation (theme system, animation primitives, UI components, showcase scaffolding)
was harvested from the CloudGlance landing-page repo.

> **New here / resuming in a fresh chat?** Read [`docs/HANDOFF.md`](docs/HANDOFF.md) first —
> it explains how this repo was created, what to reference for upgrades, current state,
> guardrails, and placeholders to replace before launch.

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (outputs to dist/, standalone)
npm run lint
```

## Structure

- `app/layout.tsx` — root shell: fonts, theme provider, metadata + JSON-LD, header/footer.
- `app/page.tsx` — the single landing page (Hero → Features → How it works → Who it's for → CTA).
- `data/features.ts` — feature copy (data-driven; edit here for copy changes).
- `components/nav/SiteHeader.tsx` — sticky single-page header with smooth in-page anchor scroll.
- `components/animations/` — `RevealOnScroll`, `StaggerChildren`, `CountUp`.
- `components/showcases/` — animation scaffolding (`useStepAnimation`, `useInView`, `AnimatedItem`)
  ready for bespoke Lexli feature showcases (chat-with-citations, translation, scanner).
- `components/ui/` — shadcn/ui primitives.
- `styles/globals.css` — Tailwind v4 `@theme` design tokens (light/dark).

## TODO / unverified

Per the product overview, the following are **not** asserted until confirmed: security/
compliance claims, pricing, "trusted by", and metrics ("save X hours"). Add only what's true.
Sign In and Book a Demo currently point at `https://app.lexli.ai` / `mailto:hello@lexli.ai`
placeholders — update when real URLs exist.
