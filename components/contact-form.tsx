'use client';

import { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent } from './ui/card';
import { CONTACT_EMAIL, emailjsConfig } from '@/lib/site';
import { capture, identifyVisitor } from '@/lib/analytics';
import { fakeSend, type FormPreview } from '@/lib/form-preview';

const EMPTY = {
    firstName: '',
    lastName: '',
    email: '',
    companyName: '',
    message: '',
};

const SAMPLE = {
    firstName: 'Aditi',
    lastName: 'Deshpande',
    email: 'aditi@deshpande-associates.in',
    companyName: 'Deshpande & Associates',
    message: 'We are four advocates at the Nagpur Bench. Can the whole chamber share one case record?',
};

/** `preview` is for /dev/forms only: it seeds a state and fakes the send. */
export function ContactForm({ preview }: { preview?: FormPreview } = {}) {
    const [formData, setFormData] = useState(preview && preview !== 'empty' ? SAMPLE : EMPTY);
    const [isSubmitting, setIsSubmitting] = useState(preview === 'sending');
    // The address the last message came from, for the confirmation; null until one is sent.
    const [sentFrom, setSentFrom] = useState<string | null>(preview === 'sent' ? SAMPLE.email : null);
    const [hasFailed, setHasFailed] = useState(preview === 'error');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setHasFailed(false);

        try {
            if (preview) {
                await fakeSend();
            } else {
                // No fallback credentials by design. The values this repo inherited
                // belonged to the CloudGlance emailjs account, which would have sent
                // Lexli's enquiries through someone else's inbox. If the config is
                // absent the form is not rendered at all (see ContactForm's caller).
                if (!emailjsConfig) throw new Error('emailjs is not configured');

                const emailjs = (await import('@emailjs/browser')).default;
                await emailjs.send(
                    emailjsConfig.serviceId,
                    emailjsConfig.templateId,
                    {
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        email: formData.email,
                        company: formData.companyName,
                        message: formData.message,
                        to_email: CONTACT_EMAIL,
                    },
                    emailjsConfig.publicKey
                );
                identifyVisitor(formData.email);
                capture('contact_submitted');
            }

            // No auto-reset, as on the waitlist: the confirmation stays until they ask for a new form.
            setSentFrom(formData.email);
            setFormData(EMPTY);
        } catch (error) {
            // A silently dropped message is worse than a visible failure: the
            // sender walks away believing they have been in touch.
            console.error('Failed to send email:', error);
            setHasFailed(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    if (sentFrom) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="py-4">
                        <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
                            <Check className="h-5 w-5" strokeWidth={2.25} />
                        </div>
                        <h3 className="font-serif text-2xl font-semibold mb-3">Message received.</h3>
                        <p className="text-muted-foreground leading-relaxed mb-6">
                            Thank you. We will reply to{' '}
                            <span className="font-medium text-foreground">{sentFrom}</span>.
                        </p>
                        <Button variant="outline" onClick={() => setSentFrom(null)}>
                            Send another message
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent className="pt-6">
                <form onSubmit={handleSubmit}>
                    {/* Disabled as one while sending, so nothing changes under a message in flight. */}
                    <fieldset disabled={isSubmitting} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                                    First name
                                </label>
                                <Input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    autoComplete="given-name"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                                    Last name
                                </label>
                                <Input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    autoComplete="family-name"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-2">
                                Email
                            </label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                placeholder="Where we reply"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="companyName" className="block text-sm font-medium mb-2">
                                Firm or practice <span className="text-muted-foreground">(optional)</span>
                            </label>
                            {/* Field name stays `companyName` / template var `company`:
                                the emailjs template is not ours to change yet. */}
                            <Input
                                id="companyName"
                                name="companyName"
                                type="text"
                                autoComplete="organization"
                                value={formData.companyName}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="message" className="block text-sm font-medium mb-2">
                                Message
                            </label>
                            <Textarea
                                id="message"
                                name="message"
                                placeholder="Your question, or what you would like to see in a demo."
                                value={formData.message}
                                onChange={handleChange}
                                rows={5}
                                className="min-h-[120px]"
                                required
                            />
                        </div>

                        {hasFailed && (
                            <p
                                role="alert"
                                className="rounded-md border border-destructive-foreground/30 bg-destructive px-3 py-2 text-sm text-destructive-foreground"
                            >
                                The message did not send. Try again, or write to us directly at{' '}
                                <a href={`mailto:${CONTACT_EMAIL}`} className="underline">
                                    {CONTACT_EMAIL}
                                </a>
                                .
                            </p>
                        )}

                        <Button type="submit" size="lg" className="w-full">
                            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                            {isSubmitting ? 'Sending…' : 'Send message'}
                        </Button>
                    </fieldset>
                </form>
            </CardContent>
        </Card>
    );
}
