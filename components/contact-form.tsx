'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { CONTACT_EMAIL, emailjsConfig } from '@/lib/site';

export function ContactForm() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        companyName: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [hasFailed, setHasFailed] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setHasFailed(false);

        try {
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

            setShowSuccess(true);
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                companyName: '',
                message: '',
            });

            setTimeout(() => {
                setShowSuccess(false);
            }, 5000);
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

    if (showSuccess) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="text-center py-8">
                        <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                            <svg
                                className="w-8 h-8 text-green-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                        <h3 className="font-serif text-xl font-semibold mb-2">Message received</h3>
                        <p className="text-muted-foreground">
                            We have it, and we will come back to you.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                                First Name
                            </label>
                            <Input
                                id="firstName"
                                name="firstName"
                                type="text"
                                placeholder="First Name"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                                Last Name
                            </label>
                            <Input
                                id="lastName"
                                name="lastName"
                                type="text"
                                placeholder="Last Name"
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
                            placeholder="Email"
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
                            placeholder="Firm or practice"
                            value={formData.companyName}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label htmlFor="message" className="block text-sm font-medium mb-2">
                            Message
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            placeholder="Your message..."
                            value={formData.message}
                            onChange={handleChange}
                            rows={5}
                            className="flex min-h-[120px] w-full rounded-md border border-input bg-muted px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            required
                        />
                    </div>

                    {hasFailed && (
                        <p className="rounded-md border border-destructive-foreground/30 bg-destructive px-3 py-2 text-sm text-destructive-foreground">
                            The message did not send. Try again, or write to us directly at{' '}
                            <a href={`mailto:${CONTACT_EMAIL}`} className="underline">
                                {CONTACT_EMAIL}
                            </a>
                            .
                        </p>
                    )}

                    <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? 'Sending…' : 'Send message'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
