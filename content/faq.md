# FAQ — `/faq` — v1

> **Status:** Draft v1. Every answer is derived from copy already shipped on `/platform`,
> `/tools/*`, or `/solutions/*` — an FAQ that introduces new claims is a liability, because it is
> the page people quote back at you.
> **Register (tone map):** flat, direct, zero wit. Answers open with the answer.
> **Flags:** `[VERIFY]` = confirm before launch. The free-tier questions are the weak spot: the
> limits are undefined everywhere on the site, and this is the page where people come to look
> for exactly that number.

---

## SEO

- **Title:** FAQ — questions about Lexli
- **Meta description:** What Lexli costs, which courts it covers, how your data is handled, and what the AI Assistant can and cannot do.
- **URL:** `/faq`

---

## Getting started

**Is Lexli free?**
There is a free account, and it is where everyone starts. It covers the front-door tools — Daily Board, Case Finder, Legal Translator, and Document Scanner — and your first cases. Paid plans add the rest of the workspace and team access.
`[VERIFY — BLOCKS ANSWER: the exact free-tier limits are undefined across the whole site. This
answer currently promises "your first cases" without saying how many. Either supply the numbers or
cut that clause.]`

**What do I need to start?**
An email address or a Google account. There is nothing to install, and nothing has to be migrated first — your existing files, diaries, and templates stay where they are.

**Do I have to move my old cases in before Lexli is useful?**
No. Add one case and the workspace is useful for that case. Most people start with tomorrow's board, because it takes a name and a court and nothing else.

**Which devices does it work on?**
Desk, phone, and court — the same workspace, logged in on multiple devices. Each account is its own login; there are no shared passwords.

---

## Courts and coverage

**Which courts does Lexli cover?**
Case records — status, parties, acts, orders and judgements, and hearing history — come from official court records across High Courts and District Courts, searchable by case number or advocate name. Supreme Court and Tribunal coverage, and search by CNR or party name, are scheduled.
`[VERIFY: this is the conservative coverage claim used site-wide. Widen only against confirmed
per-court behaviour.]`

**Where does the Daily Board get its data?**
From the cause lists the courts publish. The board builds itself daily and covers multiple advocates and multiple courts together.
`[VERIFY: whether the board re-checks and reconciles as lists change — the site currently does not
claim this.]`

**Does Lexli file cases for me?**
Lexli prepares the filing. You approve it, and submission happens through your own portal credentials — never on Lexli's authority. Nothing leaves the platform until you have read it and said yes.

---

## The AI Assistant

**Where do the Assistant's answers come from?**
From the case's own files, orders, and hearing history when you point it at a case, and from web search for judgements, statutes, and current updates beyond your own files.

**Can it run the other tools?**
Yes. Ask for a draft, a translation, or a case lookup inside a conversation and it runs the tool and hands the output back to you.

**Does it replace my own reading?**
No, and it is not built to. Translations come with a comparison view and flagged passages; drafts and filing packets come back for your review. The judgement stays yours.

**What languages does it work in?**
Documents translate between English, Hindi, and Marathi, with nine more Indian languages scheduled — Bengali, Gujarati, Tamil, Telugu, Kannada, Malayalam, Punjabi, Odia, and Assamese. Drafting works in English, Hindi, and Marathi.
`[VERIFY: drafting language list — the product board says "multi-lingual" without naming them.]`

---

## Teams and firms

**Can my clerk and juniors use the same cases?**
Yes. Profiles are role-based — advocate, clerk, litigant — and your admin decides who reads and who writes, per team.

**Can I add people later?**
Yes. Start alone and add the team when the team is ready. Nothing migrates; the record gains readers.

**Do you have plans for firms?**
Seat-based accounts, for larger firms and businesses.
`[VERIFY: whether these are self-serve or on request, and whether pricing can be stated here.]`

---

## Security and data

**Where is my data stored?**
On Azure, encrypted with AES-256 at rest and TLS 1.3 in transit, behind Cloudflare's WAF. Production access is least-privilege, short-lived, logged, and reviewed.

**Are you SOC 2 or ISO 27001 certified?**
No. Lexli is built to the controls those standards define, and is GDPR-ready — but it has not been audited against them, and we say so plainly rather than implying otherwise.

**Who can see my case files?**
The people you give access to, at the level your admin sets.
`[VERIFY — this answer is thin and it is one of the two or three questions that actually decides a
sale. It needs the real answer on staff access, model training, and retention, from whoever owns
the data policy. Do not ship as-is.]`

---

## Pricing

**What does it cost?**
`[VERIFY — BLOCKS ANSWER: pricing is undefined and there is no pricing page. Until there is, this
question should either be omitted from the page or answered with "Free to start; paid plans on
request — talk to us." Omitting it is more honest than an answer that says nothing.]`

---

## Review checklist

| # | Item | Flag |
|---|---|---|
| 1 | Free-tier limits — the numbers, finally | VERIFY — blocks two answers |
| 2 | Pricing question — omit, or answer with "on request" | VERIFY — blocks answer |
| 3 | "Who can see my case files" — real answer on staff access, model training, retention | VERIFY — blocks answer |
| 4 | Court coverage — matches the site-wide conservative claim | VERIFY |
| 5 | Cause-list reconciliation | VERIFY |
| 6 | Drafting language list | VERIFY |
| 7 | Seat-based plans — self-serve or on request | VERIFY |
| 8 | Whether an FAQ should exist before Pricing does | DECIDE |
