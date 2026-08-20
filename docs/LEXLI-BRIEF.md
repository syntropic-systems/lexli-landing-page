# Lexli AI — Complete Briefing for a Fresh Agent

> **Purpose:** This document gives an agent with zero prior knowledge everything it needs to understand Lexli AI — the product, the users, the positioning, the vocabulary, the current state, and the open questions — so it can meaningfully discuss and plan user-experience work. Read the whole thing before responding.
>
> **Last updated:** 15 August 2026.

---

## 1. One-paragraph summary

**Lexli AI** (brand: "Lexli") is an **AI workspace for Indian legal practice**, built by a small team in **Nagpur, Maharashtra**. It is a single web platform (app at `dev-app.lexli.ai`; public site at `lexli.ai`) where an advocate's entire practice — cases, files, hearings, orders, research, drafts, and conversations — lives in **one record organised by case**, and where a set of six named tools (Daily Board, Case Finder, Legal Translator, Document Scanner, Drafting, eFiling Support) all work from that same record. It targets Indian litigators — solo advocates, small chambers, law firms, in-house legal teams — with Maharashtra (Marathi/Hindi/English) as the first market. The core promise: take the clerical, repetitive layer off the advocate's desk (checking tomorrow's board, re-typing party names, hunting order copies) and leave every act of legal judgement with the advocate. The consent principle that governs everything the platform does on the user's behalf: **"Lexli prepares. You decide."**

---

## 2. The problem Lexli solves

An Indian advocate's day contains a great deal of work that is *not* the practice of law:

- Checking tomorrow's cause list ("the board") across multiple court websites, WhatsApp groups, and a clerk — every evening.
- A single case file existing in four places: the office almirah, a junior's bag, a pen drive, photographs on a phone.
- Typing the same party names into every application, vakalatnama, and index — names that have not changed since the case began.
- Clients calling after every hearing; the answer exists somewhere across a diary, an order copy, and memory.
- Court records went online (eCourts, cause lists, digital orders), but the data is scattered across a dozen systems built for *publication*, not for *work*.

**Lexli's thesis:** the data was already there; what was missing was somewhere for it to land. Point tools (a scanner app, a translator, a case-status site) each make you re-upload the same file and re-type the same names. A workspace that already holds the case record doesn't need to ask.

---

## 3. Positioning (settled)

- **One brand, platform-first, tools as front doors.** Lexli is *the platform*. The six tools are named, individually discoverable capabilities *inside* the platform — some have public "front-door" pages and free use for first-touch/citizen-grade tasks — and every tool page funnels back to the platform.
- **Not** "a suite of products" and **not** "Platform vs Products" as siblings. Products live inside the platform; some just have their own doors.
- **The moat (verbatim from the team's board):** *"Integration is the moat a point solution can't copy."* Any single tool exists elsewhere. What doesn't exist elsewhere is the shared case record that all of them read from and write to.
- **Working strapline/tagline candidate:** "Legal intelligence, made accessible." (LEXLI expansion is still an open decision.)
- **Site-level line:** "Lexli — the AI workspace for Indian legal practice."

---

## 4. Who it's for (three audiences)

| Audience | Who exactly | What they want | Entry point |
|---|---|---|---|
| **Advocates & lawyers** | Solo litigators and small chambers; District Court and High Court practice; Maharashtra-first | Recognition: "is this for me?" Tomorrow's board built for them, files in one place, drafts pre-filled | Daily Board (free) → platform |
| **Law firms & businesses** | Firms (partners, juniors, clerks on the same case); in-house legal teams; businesses that are litigants (with or without outside counsel) | Team on one record, role-based access, admin control, security answers for IT reviewers, seat-based plans | Book a demo; also start free |
| **Citizens / litigants** | A person checking their own case, or needing one document translated | One task, now, free — no interest in "a platform" | Case Finder, Legal Translator (free front doors) |

A fourth page addresses **clerks & legal staff** — written *for the advocate deciding for their staff*, showing the same duties (keeping the board, filing what arrives, keeping cases current, preparing packets) done on the shared record under access the advocate controls.

**Persona roles inside the product:** advocate, clerk, litigant (role-based profiles).

---

## 5. The product — platform core

Everything sits on the case record. Platform core capabilities:

### 5.1 Case Management — "the spine"
- Every case is one living record: parties, acts, hearing history, orders and judgements, files, and the conversations about it.
- Case status pulled from official court records (details, parties, acts, orders, hearing history).
- Cloud file storage per case, with offline access; **whatever any Lexli tool produces saves to the case that produced it.**
- Create a case manually, or find it once in Case Finder and add it with its court record attached.
- Custom details (e.g. your own personal file number).
- Chats can be tied to a case, so context carries across hearings.

### 5.2 AI Assistant — "the orchestrator"
- Where daily work happens. Case-aware: point it at a case and it answers from that case's actual files, orders, hearing history — **with citations**.
- **Tool calling:** ask for a draft, translation, case lookup, or tomorrow's board and it runs the relevant Lexli tool inside the same conversation and hands the output back.
- Upload a scan/PDF and question it directly.
- Web search built in (judgements, statutes, current updates beyond your own files).
- Voice mode (speak instead of type). Confirmed shipped.
- User memory — remembers preferences and patterns across conversations. Confirmed shipped.

### 5.3 Document Intelligence — "the foundation"
- Built to read legal documents *as they actually arrive*: scanned annexures, stamped pages, tables inside affidavits, hundred-page executed agreements with a stamp across the signature block.
- Reads text, tables, images, stamps, and long legal content from PDFs, forms, contracts, amendments → structured data.
- This is why the board updates itself, drafts arrive pre-filled, and eFiling packets assemble.

### 5.4 Legal Research
- Live legal search: judgements, case law, statutes (IPC, BNSS, etc.), government resolutions (GRs).
- Case-aware research grounded in the case's own files and history.
- Arguments and rebuttals preparation.
- Case notes for every hearing.
- IRAC-method case summaries.
- Working calculations: limitation period, court fees, jurisdiction for a given case.

### 5.5 Advanced Search
- Plain-language search across the whole platform: cases, orders, statements inside files, dates, names, file names. E.g. "the order where costs were imposed", "the agreement with the indemnity clause", "files from the March hearing".

### 5.6 Accounts & Profiles
- Single-user or teams; start alone, add the team later.
- Role-based profiles: advocate, clerk, litigant.
- Admin and access management (who reads / who writes, per team).
- Multi-device login (desk, court, phone).
- Free and paid plans; sign in with Google or email. **Free-tier limits are still undefined** (see §9).
- Seat-based enterprise accounts for larger firms/businesses.

### 5.7 Security (approved wording — do not embellish)
- Hosted on **Azure**; **AES-256** at rest, **TLS 1.3** in transit; **Cloudflare** WAF, DDoS mitigation, CDN; least-privilege, short-lived, logged, reviewed production access.
- **Built to SOC 2 Type II and ISO 27001 controls; GDPR-ready — NOT yet audited/certified.** The team deliberately says "aligned, not certified". Never claim certification.

### 5.8 Integrations — "works with the courts"
- Case status, orders, hearing history, party details from official live court records.
- **Confirmed coverage today (conservative claim used site-wide):** High Courts and District Courts, searchable by **case number** or **advocate name**. Supreme Court, Tribunals, search by **CNR** and **party name** are *scheduled/coming* — copy must not claim them as live.
- Cause lists pulled from what courts publish.
- eFiling packets prepared to portal format and submitted through the *user's own* credentials.
- Nothing has to migrate: existing files, diaries, templates stay as they are.

---

## 6. The product — the six tools

Grouped as **four public front doors** (free on a free account; citizen/first-touch tone) and **two inside tools** (advocate product-depth tone; CTA = platform/demo).

### Front doors (free to start)

**Daily Board (Cause List)** — `/tools/daily-board`
- Tomorrow's board built automatically from the cause lists courts publish, for every court you appear in and every advocate in the office (multi-advocate, multi-court).
- Auto-runs daily. Each entry: the case's latest orders attached, opposition advocate details, case timetable (which case, where, when).
- Export as PDF/doc with order files attached; also available via AI Assistant ("what's my board for tomorrow").
- Tap an entry → into the case record. Lowest-friction entry point for advocates.

**Case Finder** — `/tools/case-finder`
- Find a case and open the full record: status, parties, acts, orders and judgements, hearing history — from official court records.
- Save it → it becomes a managed case in your workspace, record attached; then Daily Board picks it up, research starts from it, orders land in its file.
- Highest citizen traffic ("check case status"). Coverage as per §5.8.

**Legal Translator** — `/tools/legal-translator`
- Upload or scan a legal document; translate between **English, Hindi, Marathi**. Nine more Indian languages scheduled: Bengali, Gujarati, Tamil, Telugu, Kannada, Malayalam, Punjabi, Odia, Assamese (label as *scheduled*, not available).
- Side-by-side comparison view with warnings on passages needing the advocate's eye; edit in place with version history; export clean .doc/.pdf; assign to case.

**Document Scanner** — `/tools/document-scanner`
- Scan from phone or laptop; digitise to editable/searchable .doc or .pdf with OCR; save straight to the case; recents/outputs kept in the upload modal.
- Once scanned, the file is already searchable, quotable in research, and prepared for eFiling.

### Inside tools (for the practice)

**Drafting** — `/tools/drafting`
- Start from a pre-filled template (by case type) or blank; parties, court, case type filled in from the case file.
- Type or dictate (voice-to-text); auto-correct backed by a legal dictionary; in-app editing with version history; follows the user's personal drafting pattern; multilingual (EN/HI/MR); export .doc/.pdf or assign to case.
- Callable from the AI Assistant.

**eFiling Support** — `/tools/efiling-support` — **LIVE** (older docs listing it as roadmap are stale)
- Assembles the eFiling packet: eDraft (form) filled from case files via information extraction; documents OCR'd, merged, blank pages removed, indexed to the portal's expected format.
- Filled-form editing and verification; eDraft management (save, revise, export .doc) before submission.
- **Submission goes through the user's own portal credentials. Lexli never files on its own authority.** Zero-wit, highest-stakes flow — the consent architecture is the spine.

**Cross-cutting facts:** every tool is callable from the AI Assistant; every tool's output saves to the case; front-door tools are *not* standalone apps — a **free platform account** unlocks them, and the CTA everywhere is "create free account → land in the platform".

---

## 7. Product principles (design-relevant)

1. **Organised by case.** Everything hangs off the case record. A case holds *files*; the *workspace* is the platform level.
2. **Nothing needs re-explaining.** If the platform already knows it (parties, case type, court), no tool asks for it again.
3. **Lexli prepares. You decide.** The platform drafts, translates, assembles, and flags — the human reviews and approves. Nothing is filed/sent/submitted on Lexli's authority. Translations come with comparison + warnings; drafts and packets come back for review.
4. **Honesty over claims.** No unverified metrics ("save X hours"), no "trusted by" logos, no fake certifications. Aligned ≠ certified. Coverage claims match reality per court.
5. **Nothing migrates first.** Lexli sits on top of what already works and earns its place case by case.
6. **Multi-device, multi-role.** Desk, corridor, courtroom door, phone. Advocate / clerk / litigant see what their role needs and no more.
7. **Indian-language-first.** Marathi is a first language, not a translation target.

---

## 8. Voice, tone, and locked terminology

Governed by an internal voice-and-tone guide. Key rules (matter for any UX copy, microcopy, empty states, error messages):

- **Write for a sceptical senior advocate.** Dry, precise, serious. Sarcasm never. Wit at most one line per section, and only when it rides on a concrete specific.
- **Security, Pricing, eFiling = zero wit.** Flat, precise register.
- **Describe behaviour, not "AI".** Say what it does ("answers from the case's files, with citations"), not "AI-powered". "AI" appears only in the product name *AI Assistant*.
- **Banned words:** seamless, empower, leverage, solution (as in "our solution"), world-class, simply, AI-powered, and similar marketing filler.
- **Consent line:** "Lexli prepares. You decide." — appears wherever the platform acts for the user.
- **Terminology (decided once):**
  - **case**, not "matter"
  - **workspace** = platform level; a case holds **files**
  - **eDraft** only in the eFiling context; **draft** everywhere else
  - **judgement** (Indian spelling); Indian English throughout
  - **board** = the daily cause list; "Daily Board (Cause List)" is the product name
- **Formatting:** sentence case for headings and buttons; no exclamation marks; serial comma; front-load the claim.
- **Recognition over persuasion** on audience pages: concrete scenes the reader recognises beat adjectives.
- Naming currently used: "Lexli" (wordmark styling vs "LEXLI" still open).

---

## 9. Current state and open questions

### Website (this repo — `lexli-landing-page`)
- Next.js 16 / React 19 / Tailwind v4 / shadcn/ui / framer-motion. Multi-page site: `/`, `/platform`, `/tools` + 6 tool pages, `/solutions` + 3 persona pages (advocates, clerks-legal-staff, law-firms-businesses), `/company`, `/faq`, `/contact`.
- Sign In → `https://dev-app.lexli.ai`. Book a demo → `mailto:hello@lexli.ai` (placeholder flow).
- Full copy drafts for every page live in `content/*.md` with inline `[VERIFY]` / `[COMING]` / `[DECIDE]` flags. Policy: where a flag is unresolved, ship the *narrower* claim.
- Homepage copy is the least settled page (hero headline and tagline still open).

### Product facts confirmed by the team
- eFiling Support is **live**.
- Voice mode, offline file access, and user memory in the AI Assistant are **live**.

### Still open / unverified (do not assert as fact)
- **Free-tier limits** (which tools, how many cases/searches/pages/translations) — undefined; blocks a Pricing page and several FAQ answers.
- **Pricing** — undefined; no pricing page.
- Whether live cause-list *reconciliation* (re-checking as lists change) is shipped vs daily build only.
- Whether case status on saved cases auto-updates live vs on refresh.
- Court coverage widening (SC, Tribunals, CNR, party-name search) — currently *coming*.
- OCR on every scan vs only in the eFiling flow (draft assumes every scan).
- Which case types have Drafting templates at launch; how the "personal drafting pattern" is learned/configured; exact drafting languages.
- Legal Translator: all EN/HI/MR pairs supported; what the comparison-view warnings actually mark; cross-document terminology consistency.
- Seat-based enterprise plans: self-serve or on request.
- Permission granularity: per-case vs per-team read/write.
- Cross-organisation shared workspaces (business ↔ outside counsel) — appears nowhere on the boards; not claimed.
- Data policy details for "who can see my case files" (staff access, model training, retention).
- Founder story, why-Nagpur, team roles/bios — all unwritten.
- Tagline / LEXLI acronym expansion; "Lexli" vs "LEXLI".

### Team
Ayush Talmale, Swapnish Sahare, Yash Tiwari — small team, Nagpur. Contact: hello@lexli.ai / dev@lexli.ai.

---

## 10. Quick vocabulary for the discussion

| Term | Meaning |
|---|---|
| Board / Daily Board / cause list | The list of tomorrow's hearings for an advocate across courts |
| Case record | The single living record of a case in Lexli (parties, acts, hearing history, orders, files, chats) |
| Front-door tool | Daily Board, Case Finder, Legal Translator, Document Scanner — free, public first-touch tools |
| Inside tool | Drafting, eFiling Support — advocate-depth tools inside the workspace |
| eDraft | The eFiling form/draft prepared for a court portal (term used only in eFiling context) |
| CNR | Case Number Record — India's unique eCourts case identifier |
| Vakalatnama | Document authorising an advocate to appear for a party |
| GR | Government Resolution (Maharashtra government orders) |
| IPC / BNSS | Indian Penal Code / Bharatiya Nagarik Suraksha Sanhita (statutes) |
| IRAC | Issue–Rule–Application–Conclusion legal summary structure |
| Litigant | A party to a case (also a profile role for citizens using Lexli) |
| Clerk | Practice staff who maintain the register, files, and board (a profile role) |
| Workspace | The platform level (an individual's or firm's Lexli account) |
| "Lexli prepares. You decide." | The consent principle: the platform prepares, the human approves |

---

*End of briefing. When discussing UX, assume the audience is a sceptical senior Indian advocate on a phone in a court corridor as often as at a desk, and that every claim about a shipped capability should be checked against §9 before being relied on.*
