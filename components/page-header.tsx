'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Section } from "@/components/section";
import { cn } from "@/lib/utils";
import { RevealOnScroll } from "@/components/animations";

interface PageHeaderButton {
    text: string;
    href: string;
    variant?: "default" | "outline" | "ghost" | "secondary" | "link" | "destructive";
}

interface PageHeaderProps {
    title: string;
    description?: string;
    className?: string;
    button?: PageHeaderButton;
}

/**
 * Tertiary-page header (Contact, FAQ): open and edgeless. The edge hierarchy
 * runs homepage hero (full closed card) → PageHero (lighter closed edge) →
 * this — no closing edge at all, just a brand wash that fades into the page.
 * No CTAs by design: tertiary pages ARE the destination.
 */
export function PageHeader({ title, description, className, button }: PageHeaderProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            // The section following a PageHeader sits close to it — the header
            // has no closing edge (its wash fades out), so the default Section
            // pt (up to 160px) would read as the title floating detached.
            // Sibling variant beats Section's py-* without !important; pages
            // can still opt out with !pt-*.
            className="relative [&+section]:pt-8 md:[&+section]:pt-12 lg:[&+section]:pt-16"
        >
            {/* Brand-wash stage: the header itself is a variable-height sliver,
                so the wash gets its own coordinate space — a flat fall from the
                accent floor into open page, Lexli's hero surface without the
                closed edge. */}
            <div className="absolute inset-x-0 top-0 h-[max(50vh,420px)] pointer-events-none bg-gradient-to-b from-accent/60 via-accent/25 to-transparent" />
            <Section
                className={cn("relative z-10 -mt-14 !pt-21 sm:!pt-23 md:!pt-25 lg:!pt-26 !pb-0 [&>div>div>div]:!mb-0", className)}
                disableDefaultHeader
                header={
                    <div className="space-y-4 md:space-y-5 !mb-0">
                        {/* Back-button slot — reserved even when empty so the
                            h1 sits on one line with or without one (the empty
                            slot reads as top padding). h-9 matches the
                            Button's fixed height. */}
                        <div className="h-9">
                            {button && (
                                <RevealOnScroll direction="up" duration={0.5}>
                                    <Button
                                        variant={button.variant || "ghost"}
                                        className="inline-flex items-center gap-1 px-3 py-1 text-xs uppercase tracking-wide"
                                        asChild
                                    >
                                        <Link href={button.href}>
                                            <ArrowLeft className="h-3 w-3" />
                                            <span>{button.text}</span>
                                        </Link>
                                    </Button>
                                </RevealOnScroll>
                            )}
                        </div>
                        <div className="space-y-4 md:space-y-5">
                            <RevealOnScroll direction="up" delay={0.15} duration={0.7}>
                                <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.08]">
                                    {title}
                                </h1>
                            </RevealOnScroll>
                            {description && (
                                <RevealOnScroll direction="up" delay={0.3} duration={0.7}>
                                    <p className="text-base md:text-lg text-foreground/70 leading-relaxed max-w-3xl">
                                        {description}
                                    </p>
                                </RevealOnScroll>
                            )}
                        </div>
                    </div>
                }
            >
                {null}
            </Section>
        </motion.div>
    );
}
