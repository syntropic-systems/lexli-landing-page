/**
 * Site-wide constants. Every outbound CTA target lives here so a launch-time
 * swap (app URL, demo flow) is a one-file change.
 */

export const SITE_URL = "https://lexli.ai";

/** Product app — the "Sign in" target in every mode, and the primary CTA
 * target while access is open. */
export const APP_URL = "https://app.lexli.ai/";

/**
 * Access mode. `open`: the primary CTA sends visitors to the app to create
 * an account. `waitlist`: entry is gated, the primary CTA sends them to the
 * waitlist instead, and the labels stop promising a free account today.
 *
 * Read from the environment so Vercel can flip it per deployment without a
 * commit; anything other than "waitlist" means open. Only the button labels
 * and targets switch on this — page prose is written per mode by hand.
 */
export type AccessMode = "open" | "waitlist";
export const ACCESS_MODE: AccessMode =
  process.env.NEXT_PUBLIC_ACCESS_MODE === "waitlist" ? "waitlist" : "open";
export const IS_WAITLIST = ACCESS_MODE === "waitlist";

/** Where the waitlist lives once it exists. Only reached in waitlist mode. */
export const WAITLIST_HREF = "/waitlist";

/** Primary CTA target: the app while open, the waitlist while gated. */
export const PRIMARY_HREF = IS_WAITLIST ? WAITLIST_HREF : APP_URL;

/** Where contact-form submissions and direct mail land. */
export const CONTACT_EMAIL = "contact@lexli.ai";

/**
 * emailjs credentials, or `null` when the form is not configured.
 *
 * Deliberately no fallback values: this repo shipped with the CloudGlance
 * account's service/template/key hardcoded, which meant Lexli enquiries were
 * routed through another project's inbox. Absent config now means the contact
 * form is not rendered at all — direct email is offered instead. Set all three
 * env vars against Lexli's own emailjs account and the form returns.
 *
 * The template must accept: firstName, lastName, email, company, message,
 * to_email — and its "To" field must be {{to_email}}, or the recipient set in
 * the template wins and `to_email` is ignored.
 */
const emailjsServiceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const emailjsTemplateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const emailjsPublicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

export const emailjsConfig =
  emailjsServiceId && emailjsTemplateId && emailjsPublicKey
    ? { serviceId: emailjsServiceId, templateId: emailjsTemplateId, publicKey: emailjsPublicKey }
    : null;

/** Demo requests. Points at the contact page now that one exists. */
export const DEMO_HREF = "/contact";

export const LINKEDIN_URL = "https://www.linkedin.com/company/lexli-ai";

/** Copy used on the primary CTA pair, kept consistent across pages, with
 * one label set per access mode so a mode flip never touches a page.
 * Convention: `startFree` on primary buttons, `startFreeShort` when the
 * primary door rides in the secondary slot; `tryTool(name)` is the tool-page
 * hero for a front-door tool; `talkToUs` is the softer /contact label for
 * pages where "Book a demo" would overreach (Company, FAQ). The keys keep
 * their open-mode names on purpose: callers say which slot they fill, and
 * the mode decides the wording. */
const CTA_BY_MODE = {
  open: {
    startFree: "Create free account",
    startFreeShort: "Start free",
    startOnLexli: "Start on Lexli",
    tryTool: (name: string) => `Try ${name} free`,
  },
  waitlist: {
    startFree: "Join the waitlist",
    startFreeShort: "Join the waitlist",
    startOnLexli: "Request access",
    tryTool: () => "Request access",
  },
} as const;

export const CTA = {
  ...CTA_BY_MODE[ACCESS_MODE],
  signIn: "Sign in",
  bookDemo: "Book a demo",
  talkToUs: "Talk to us",
  explorePlatform: "Explore the platform",
  seeAllTools: "See all four tools",
} as const;
