/**
 * FAQ copy. Source: `content/faq.md`.
 *
 * Rule for this file: an answer here may not introduce a claim that is not
 * already made on /platform, /tools/*, or /solutions/*. This is the page people
 * quote back at you.
 *
 * Deliberately absent: "What does it cost?" — pricing is undefined and there is
 * no pricing page. An answer that says nothing is worse than no question.
 */

export type Faq = { question: string; answer: string };
export type FaqGroup = { title: string; faqs: Faq[] };

export const faqGroups: FaqGroup[] = [
  {
    title: 'Getting started',
    faqs: [
      {
        question: 'Is Lexli free?',
        // conservative: no case counts or usage limits stated — they are
        // undefined site-wide.
        answer:
          // "Front-door tools" was internal jargon that no longer appears
          // anywhere on the site now the tools grid is one list.
          'There is a free account, and it is where everyone starts. It covers Daily Board, Case Finder, Legal Translator, and Document Scanner. Paid plans add the rest of the workspace and team access.',
      },
      {
        question: 'What do I need to start?',
        answer:
          'An email address or a Google account. There is nothing to install, and nothing has to be migrated first. Your existing files, diaries, and templates stay where they are.',
      },
      {
        question: 'Do I have to move my old cases in before Lexli is useful?',
        answer:
          "No. Add one case and the workspace is useful for that case. Most people start with tomorrow's board, because it takes a name and a court and nothing else.",
      },
      {
        question: 'Which devices does it work on?',
        answer:
          'Desk, phone, and court: the same workspace, logged in on multiple devices. Each account is its own login; there are no shared passwords.',
      },
    ],
  },
  {
    title: 'Courts and coverage',
    faqs: [
      {
        question: 'Which courts does Lexli cover?',
        // conservative: matches the site-wide coverage claim exactly.
        answer:
          'Case records come from official court records across High Courts and District Courts, searchable by case number or advocate name: status, parties, acts, orders and judgements, and hearing history. Supreme Court and Tribunal coverage, and search by CNR or party name, are scheduled.',
      },
      {
        question: 'Where does the Daily Board get its data?',
        answer:
          'From the cause lists the courts publish. The board builds itself daily and covers multiple advocates and multiple courts together.',
      },
      {
        question: 'Does Lexli file cases for me?',
        answer:
          'Lexli prepares the filing. You approve it, and submission happens through your own portal credentials, never on Lexli’s authority. Nothing leaves the platform until you have read it and said yes.',
      },
    ],
  },
  {
    title: 'The AI Assistant',
    faqs: [
      {
        question: "Where do the Assistant's answers come from?",
        answer:
          "From the case's own files, orders, and hearing history when you point it at a case, and from web search for judgements, statutes, and current updates beyond your own files.",
      },
      {
        question: 'Can it run the other tools?',
        answer:
          'Yes. Ask for a draft, a translation, or a case lookup inside a conversation and it runs the tool and hands the output back to you.',
      },
      {
        question: 'Does it replace my own reading?',
        answer:
          'No, and it is not built to. Translations come with a comparison view and flagged passages; drafts and filing packets come back for your review. The judgement stays yours.',
      },
      {
        question: 'What languages does it work in?',
        answer:
          'Documents translate between English, Hindi, and Marathi, with nine more Indian languages scheduled: Bengali, Gujarati, Tamil, Telugu, Kannada, Malayalam, Punjabi, Odia, and Assamese. Drafting works in English, Hindi, and Marathi.',
      },
    ],
  },
  {
    title: 'Teams and firms',
    faqs: [
      {
        question: 'Can my clerk and juniors use the same cases?',
        answer:
          'Yes. Profiles are role-based: advocate, clerk, litigant. Your admin decides who reads and who writes, per team.',
      },
      {
        question: 'Can I add people later?',
        answer:
          'Yes. Start alone and add the team when the team is ready. Nothing migrates; the record gains readers.',
      },
      {
        question: 'Do you have plans for firms?',
        answer: 'Seat-based accounts, for larger firms and businesses. Talk to us about your team.',
      },
    ],
  },
  {
    title: 'Security and data',
    faqs: [
      {
        question: 'Where is my data stored?',
        answer:
          "On Azure, encrypted with AES-256 at rest and TLS 1.3 in transit, behind Cloudflare's WAF. Production access is least-privilege, short-lived, logged, and reviewed.",
      },
      {
        question: 'Are you SOC 2 or ISO 27001 certified?',
        answer:
          'No. Lexli is built to the controls those standards define, and is GDPR-ready, but it has not been audited against them, and we say so plainly rather than implying otherwise.',
      },
      {
        question: 'Who can see my case files?',
        // Narrow but true. Retention, staff access, and model-training answers
        // are not stated anywhere on the site yet — do not add them here first.
        answer:
          'The people you give access to, at the level your admin sets. Every account is its own login, and read and write permissions are decided per team.',
      },
    ],
  },
];

/** Flattened, for JSON-LD. */
export const allFaqs: Faq[] = faqGroups.flatMap((group) => group.faqs);

/**
 * The homepage's short list: the five questions a cold visitor asks before
 * anything else — price, coverage, consent, language, data. Selected by
 * question text so the answers stay single-sourced above.
 */
const HOMEPAGE_QUESTIONS = [
  'Is Lexli free?',
  'Which courts does Lexli cover?',
  'Does Lexli file cases for me?',
  'What languages does it work in?',
  'Where is my data stored?',
];

export const homepageFaqs: Faq[] = HOMEPAGE_QUESTIONS.map((question) => {
  const faq = allFaqs.find((f) => f.question === question);
  if (!faq) throw new Error(`Homepage FAQ not found in faqGroups: "${question}"`);
  return faq;
});
