/**
 * States a form can be shown in on /dev/forms. Production never passes one;
 * with a preview state, a form fakes its send (no emailjs, no PostHog).
 */
export type FormPreview = 'empty' | 'filled' | 'sending' | 'error' | 'sent' | 'unconfigured';

/** Stands in for a send in preview: a short wait, then success. */
export const fakeSend = () => new Promise((resolve) => setTimeout(resolve, 1200));
