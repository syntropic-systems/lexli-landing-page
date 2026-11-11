import posthog from "posthog-js";

/** PostHog event; a no-op when PostHog is not initialised (no key in this build). */
export function capture(event: string, properties?: Record<string, unknown>) {
  if (!posthog.__loaded) return;
  posthog.capture(event, properties);
}

/** Links this browser's earlier visits to the person who just submitted a form. */
export function identifyVisitor(email: string) {
  if (!posthog.__loaded) return;
  const id = email.trim().toLowerCase();
  if (id) posthog.identify(id, { email: id });
}
