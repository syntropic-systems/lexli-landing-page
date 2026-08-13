/**
 * Site-wide constants. Every outbound CTA target lives here so a launch-time
 * swap (app URL, demo flow) is a one-file change.
 */

export const SITE_URL = "https://lexli.ai";

/** Product app — every "Start free" / "Sign in" CTA. */
export const APP_URL = "https://dev-app.lexli.ai/";

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

/** Copy used on the primary CTA pair, kept consistent across pages.
 * Convention: `startFree` on primary buttons, `startFreeShort` when the
 * free door rides in the secondary slot; `talkToUs` is the softer /contact
 * label for pages where "Book a demo" would overreach (Company, FAQ). */
export const CTA = {
  startFree: "Create free account",
  startFreeShort: "Start free",
  signIn: "Sign in",
  startOnLexli: "Start on Lexli",
  bookDemo: "Book a demo",
  talkToUs: "Talk to us",
  explorePlatform: "Explore the platform",
} as const;
