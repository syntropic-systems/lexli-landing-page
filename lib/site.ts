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
 * Waitlist is the default: entry is gated as of October 2026, and a build
 * that loses its environment should fail toward a closed door, not an open
 * signup. Set NEXT_PUBLIC_ACCESS_MODE=open (exactly) to reopen, locally or
 * per Vercel environment; anything else means waitlist. Only the button
 * labels, targets, and byMode() copy switch on this.
 */
export type AccessMode = "open" | "waitlist";
export const ACCESS_MODE: AccessMode =
  process.env.NEXT_PUBLIC_ACCESS_MODE === "open" ? "open" : "waitlist";
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
 * The template must accept: kind ("Waitlist" or "Message"), firstName, lastName,
 * email, company, message, to_email. Both forms send the whole name as firstName. Lexli's template fixes its "To" at contact@lexli.ai rather than
 * {{to_email}}: the public key ships in the page, and a recipient taken from
 * the request would let anyone send mail anywhere through our account. So
 * `to_email` is ignored there; CONTACT_EMAIL changes need the template changed.
 */
const emailjsServiceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const emailjsTemplateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const emailjsPublicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

export const emailjsConfig =
  emailjsServiceId && emailjsTemplateId && emailjsPublicKey
    ? { serviceId: emailjsServiceId, templateId: emailjsTemplateId, publicKey: emailjsPublicKey }
    : null;

/** Demo requests. Points at the contact page, which opens on the booking calendar. */
export const DEMO_HREF = "/contact";

/** The 30-minute demo on Lexli's Cal.com (cal.com/lexli-ai/30min), embedded on the contact page. */
export const CAL_LINK = "lexli-ai/30min";

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

/** Pick the copy for the current access mode. Used wherever page prose
 * names the door ("Create a free account and…" vs "Join the waitlist and…")
 * so a mode flip keeps the words and the buttons in agreement. Keep both
 * variants complete sentences; never splice a fragment. */
export function byMode<T>(copy: { open: T; waitlist: T }): T {
  return copy[ACCESS_MODE];
}

export const CTA = {
  ...CTA_BY_MODE[ACCESS_MODE],
  signIn: "Sign in",
  bookDemo: "Book a demo",
  talkToUs: "Talk to us",
  explorePlatform: "Explore the platform",
  seeAllTools: "See all six tools",
} as const;
