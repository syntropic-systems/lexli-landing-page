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

export function PageHeader({ title, description, className, button }: PageHeaderProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
            <Section
                className={cn("-mt-14 bg-gradient-to-b from-primary/20 to-transparent !pt-28 md:!pt-36 lg:!pt-40 !pb-0 [&>div>div>div]:!mb-0", className)}
                disableDefaultHeader
                header={
                    <div className="space-y-4 !mb-0">
                        {button && (
                            <RevealOnScroll direction="up" duration={0.5}>
                                <div>
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
                                </div>
                            </RevealOnScroll>
                        )}
                        <div className="space-y-3">
                            <RevealOnScroll direction="up" delay={0.15} duration={0.7}>
                                <h1 className="text-4xl font-semibold tracking-tight lg:text-5xl">
                                    {title}
                                </h1>
                            </RevealOnScroll>
                            {description && (
                                <RevealOnScroll direction="up" delay={0.3} duration={0.7}>
                                    <p className="text-xl text-muted-foreground max-w-3xl">
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
