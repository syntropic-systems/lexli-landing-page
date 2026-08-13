'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from './ui/button';
import { RevealOnScroll } from '@/components/animations';

interface HeroSectionProps {
    title: ReactNode;
    description?: string;
    badge?: string;
    /** Short proof points under the description — keep to three, a few words each. */
    pointers?: string[];
    children?: ReactNode;
    primaryCta?: {
        text: string;
        href: string;
    };
    secondaryCta?: {
        text: string;
        href: string;
    };
}

/**
 * The front-door hero. Same surface language as PageHero — static gradient,
 * card edge, brand wash — but a size louder: taller stage, bigger serif, a
 * radial bloom instead of a flat wash. Copy-only by design.
 */
export function HeroSection({
    title,
    description,
    badge,
    pointers,
    children,
    primaryCta,
    secondaryCta,
}: HeroSectionProps) {
    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            // -mt-14/pt-14 cancels the sticky header so the stage starts under
            // it. Full-viewport stage, copy vertically centered — the front
            // door owns the fold. The [&+section] trim keeps the hero's mb
            // from stacking with the next Section's full top padding.
            // Same surface as PageHero: a clean fall from background to the
            // accent/70 tonal floor — no radial bloom.
            className="relative -mt-14 pt-14 h-[100vh] flex items-center mb-20 md:mb-28 lg:mb-32 [&+section]:pt-8 md:[&+section]:pt-12 lg:[&+section]:pt-16 overflow-hidden rounded-b-xl shadow-primary/20 shadow-xl bg-gradient-to-b from-background via-background to-accent/70"
        >
            <div className="container relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="max-w-3xl text-left space-y-5 md:space-y-6 xl:space-y-7">
                        {badge && (
                            <RevealOnScroll direction="up" duration={0.6}>
                                <span className="inline-flex items-center px-3 py-1 rounded-full border border-primary/40 bg-primary/5 text-primary font-semibold tracking-wider uppercase text-[11px] md:text-xs">
                                    {badge}
                                </span>
                            </RevealOnScroll>
                        )}

                        <RevealOnScroll direction="up" delay={0.15} duration={0.7}>
                            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.08]">
                                {title}
                            </h1>
                        </RevealOnScroll>

                        {description && (
                            <RevealOnScroll direction="up" delay={0.3} duration={0.7}>
                                <p className="text-base md:text-lg text-foreground/70 leading-relaxed max-w-2xl">
                                    {description}
                                </p>
                            </RevealOnScroll>
                        )}

                        {(primaryCta || secondaryCta) && (
                            <RevealOnScroll direction="up" delay={0.45} duration={0.5}>
                                <div className="flex flex-wrap items-center gap-3">
                                    {primaryCta && (
                                        <Button size="lg" variant="default" asChild>
                                            <a href={primaryCta.href}>{primaryCta.text}</a>
                                        </Button>
                                    )}
                                    {secondaryCta && (
                                        <Button size="lg" variant="outline" asChild>
                                            <a href={secondaryCta.href}>{secondaryCta.text}</a>
                                        </Button>
                                    )}
                                </div>
                            </RevealOnScroll>
                        )}

                        {pointers && pointers.length > 0 && (
                            <RevealOnScroll direction="up" delay={0.55} duration={0.6}>
                                <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
                                    {pointers.map((pointer) => (
                                        <li
                                            key={pointer}
                                            className="flex items-center gap-2 text-sm font-medium text-foreground/75"
                                        >
                                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                                <Check className="h-3 w-3 text-primary" />
                                            </span>
                                            {pointer}
                                        </li>
                                    ))}
                                </ul>
                            </RevealOnScroll>
                        )}

                        {children}
                    </div>
                </div>
            </div>
        </motion.section>
    );
}
