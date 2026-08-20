# Law Firms & Businesses — `/solutions/law-firms-businesses` — v1

> **Status:** Draft v1 — solutions template, two-audience form.
> **Structure decision (from team):** firms lead; "businesses" covers all three modes — in-house legal teams, businesses as litigants, businesses working with external counsel. The page is firms-first with a three-part businesses half.
> **Register:** recognising, specific; wit light in the firms half, near-zero in the businesses half (buyers here include IT reviewers and finance heads — closer to the Security register).
> **Hard flag:** cross-organisation shared workspaces (business ↔ external counsel) appear NOWHERE on the boards. That subsection is written soft — "keep your own record" — not as a collaboration claim. Do not harden it without confirmation.

---

## SEO

- **Title:** Lexli for law firms & businesses — one record, whole team
- **Meta description:** Partners, juniors, and clerks on the same case record with role-based access and admin control. And for businesses: every case your company touches, tracked in one place.
- **URL:** `/solutions/law-firms-businesses`

---

## Hero

**Eyebrow:** For law firms & businesses

**Headline:** The matter file, without the "who has the file?"

**Subhead:** Lexli puts the whole team on the same case record — partners, juniors, clerks, each with the access their role carries — under admin control the firm holds.

**Primary CTA:** Book a demo →
**Secondary CTA:** Start free →

> [DECIDE] Headline uses "matter file" — our locked terminology is **case**, but "matter" is the natural register for firms. Options: (1) keep "case file" for consistency — "The case file, without the 'who has the file?'" *(recommended — terminology rule wins)*, (2) allow "matter" on this page only as the firm-world word. Guide says decide once; recommend (1).

---

## For law firms

### The file, shared properly

A case at a firm is touched by five people and owned by one record. On Lexli, the partner sees the strategy notes, the junior updates the hearing history, the clerk files the scans — the same case, live, with no version of it in anyone's inbox. `[VERIFY-RECOGNITION: five-people framing rings true for target firm size]`

### Run like a firm, not a shared drive

- **Roles and access** — advocate, clerk, and staff profiles; read and write decided per team, by your admin.
- **Admin management** — accounts, access, and teams controlled centrally by the firm, not negotiated per case.
- **Seat-based plans** — add seats as the firm grows. `[VERIFY: enterprise seat-based plans live or on request]`
- **Every tool, same record** — the board for every advocate in the firm, drafting from the firm's case files, research grounded in the firm's own record.

### What your IT reviewer will ask

*One paragraph, flat register.*

Lexli is hosted on Azure, encrypted with AES-256 at rest and TLS 1.3 in transit, behind Cloudflare's WAF, with least-privilege, logged production access. It is built to SOC 2 Type II and ISO 27001 controls — not yet audited against them, and we say it that way deliberately. The full detail is on the security page. → `/platform#security`

### Nothing migrates first

Lexli works alongside how the firm already runs. Existing files, diaries, templates, and habits stay as they are — the workspace sits on top of what already works, and earns its place case by case. `[VERIFY: honest onboarding cost — if setup requires real work, this paragraph must say how much (guide §6)]`

---

## For businesses

*Three short subsections — three different relationships to the courts. Near-zero wit.*

### Legal teams inside companies

Disputes, notices, recoveries — an in-house team runs cases the way a firm does, and Lexli works the same way for them: every case a record, every document filed to it, research and drafting grounded in it, access controlled by the team's admin.

### Businesses with cases, without lawyers on staff

A company does not need a legal department to be in court. Case Finder and Case Management give a business its own record of every case it is party to — status, hearing history, orders as they publish — without calling anyone to ask. `[VERIFY: case-status update cadence — inherited Case Finder flags apply]`

### Businesses working with outside counsel

Your counsel runs the case. You keep your own record of it — the status, the orders, the documents your side holds — in your own workspace, so the company's view of its litigation doesn't live in a forwarded PDF. `[VERIFY — HARD: written deliberately as "your own parallel record", NOT as a shared workspace with the firm. Cross-org collaboration appears nowhere on the boards. If shared workspaces ARE planned/shipped, this section can harden — confirm first.]`

---

## Final CTA

**Headline:** Put the team on one record.

**Subhead:** A demo takes half an hour and your most complicated case.

**Primary CTA:** Book a demo →
**Secondary CTA:** Start free →

---

## Review checklist

| # | Item | Flag |
|---|---|---|
| 1 | Cross-org counsel/business relationship — parallel record vs shared workspace | VERIFY — hard, shapes a whole section |
| 2 | Seat-based enterprise plans — live or on request | VERIFY |
| 3 | Onboarding honesty paragraph — what setup actually takes | VERIFY |
| 4 | "Matter" vs "case" on this page | DECIDE |
| 5 | Firm-size recognition framing (five people on a case) | VERIFY-RECOGNITION |
| 6 | Demo CTA subhead ("half an hour and your most complicated case") — team comfortable committing to that | DECIDE |
