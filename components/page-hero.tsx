'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { RevealOnScroll } from '@/components/animations';
import { ScrollLink } from '@/components/scroll-link';

/** Anchor CTAs ("#how-it-works") scroll via ScrollLink — no # in the URL,
 * header offset respected. Everything else is a plain anchor. */
function CtaLink({ href, children, ...rest }: { href: string; children: ReactNode }) {
    return href.includes('#') ? (
        <ScrollLink href={href} {...rest}>
            {children}
        </ScrollLink>
    ) : (
        <a href={href} {...rest}>
            {children}
        </a>
    );
}

interface PageHeroProps {
    title: ReactNode;
    description?: ReactNode;
    /** Small uppercase label above the title — "Daily Board · Free on Lexli". */
    eyebrow?: string;
    primaryCta?: { text: string; href: string };
    secondaryCta?: { text: string; href: string };
    /** Fills the right column at md+. Without one, the copy column stands alone. */
    visual?: ReactNode;
    children?: ReactNode;
}

/**
 * Interior-page hero. Lighter than the homepage hero by design — a shorter
 * stage and a flat brand wash, so sub-pages read as staged without competing
 * with the front door.
 */
export function PageHero({
    title,
    description,
    eyebrow,
    primaryCta,
    secondaryCta,
    visual,
    children,
}: PageHeroProps) {
    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            // -mt-14/pt-* cancels the sticky header's height so the hero starts
            // under it. The [&+section] trim keeps the hero's mb from stacking
            // with the next Section's full top padding.
            className="relative -mt-14 pt-24 sm:pt-26 md:pt-28 lg:pt-14 pb-20 sm:pb-22 md:pb-24 lg:pb-14 lg:min-h-[max(75vh,560px)] lg:flex lg:flex-col lg:justify-center mb-20 [&+section]:pt-8 md:[&+section]:pt-12 lg:[&+section]:pt-16 overflow-hidden rounded-b-xl shadow-primary/10 shadow-lg bg-gradient-to-b from-background via-background to-accent/70"
        >
            <div className="container relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div
                        className={
                            visual
                                ? 'grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-10 lg:gap-12 items-center'
                                : 'grid grid-cols-1'
                        }
                    >
                        <div className={`text-left space-y-5 md:space-y-6 xl:space-y-7 ${visual ? 'max-w-xl' : 'max-w-3xl'}`}>
                            {eyebrow && (
                                <RevealOnScroll direction="up" duration={0.6}>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full border border-primary/40 bg-primary/5 text-primary font-semibold tracking-wider uppercase text-[11px] md:text-xs">
                                        {eyebrow}
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
                                    <p className="text-base md:text-lg text-foreground/70 leading-relaxed">
                                        {description}
                                    </p>
                                </RevealOnScroll>
                            )}

                            {(primaryCta || secondaryCta) && (
                                <RevealOnScroll direction="up" delay={0.45} duration={0.5}>
                                    <div className="flex flex-wrap items-center gap-3">
                                        {primaryCta && (
                                            <Button size="lg" variant="default" asChild>
                                                <CtaLink href={primaryCta.href}>{primaryCta.text}</CtaLink>
                                            </Button>
                                        )}
                                        {secondaryCta && (
                                            <Button size="lg" variant="outline" asChild>
                                                <CtaLink href={secondaryCta.href}>{secondaryCta.text}</CtaLink>
                                            </Button>
                                        )}
                                    </div>
                                </RevealOnScroll>
                            )}

                            {children}
                        </div>

                        {/* Phones stay copy-only: a stacked visual would re-inflate
                            the mobile hero. hidden wrapper sits OUTSIDE
                            RevealOnScroll so the grid row collapses cleanly. */}
                        {visual && (
                            <div className="hidden md:block">
                                <RevealOnScroll direction="up" delay={0.35} duration={0.7}>
                                    {visual}
                                </RevealOnScroll>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.section>
    );
}
