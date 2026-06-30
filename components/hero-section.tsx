'use client';

import { ReactNode, useRef, useEffect } from 'react';
import Aurora from './Aurora';
import { Button } from './ui/button';
import { RevealOnScroll } from '@/components/animations';

interface HeroSectionProps {
    title: string;
    description?: string;
    badge?: string;
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

export function HeroSection({
    title,
    description,
    badge,
    children,
    primaryCta,
    secondaryCta,
}: HeroSectionProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const hasForcedScroll = useRef(false);
    const isAutoScrolling = useRef(false);
    const touchStartY = useRef<number | null>(null);
    const timeoutRef = useRef<number | null>(null);

    useEffect(() => {
        const hero = sectionRef.current;
        if (!hero) return;

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        // Skip on touch-first / mobile devices
        const isMobile = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
        if (isMobile) return;

        const scrollToNext = () => {
            const next = hero.nextElementSibling as HTMLElement | null;
            if (!next) {
                hasForcedScroll.current = false;
                return;
            }

            const header = document.querySelector('header') as HTMLElement | null;
            const headerHeight = header?.offsetHeight ?? 0;

            isAutoScrolling.current = true;
            touchStartY.current = null;

            // Stop where hero bottom aligns with header bottom
            const heroRect = hero.getBoundingClientRect();
            const heroBottom = heroRect.bottom + window.scrollY;
            const targetTop = heroBottom - headerHeight;

            window.scrollTo({
                top: Math.max(targetTop, 0),
                behavior: 'smooth',
            });

            if (timeoutRef.current !== null) {
                window.clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = window.setTimeout(() => {
                isAutoScrolling.current = false;
            }, 900);
        };

        const isWithinHero = () => {
            const heroRect = hero.getBoundingClientRect();
            const heroTop = heroRect.top + window.scrollY;
            const heroBottom = heroTop + heroRect.height;
            const scrollY = window.scrollY;
            return scrollY >= heroTop - 2 && scrollY < heroBottom - 2;
        };

        const handleWheel = (event: WheelEvent) => {
            if (event.deltaY <= 0) return;

            if (isAutoScrolling.current) {
                if (event.cancelable) event.preventDefault();
                return;
            }

            if (hasForcedScroll.current) return;
            if (!isWithinHero()) return;

            if (event.cancelable) event.preventDefault();

            hasForcedScroll.current = true;
            scrollToNext();
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (!['Space', 'PageDown', 'ArrowDown'].includes(event.code)) return;

            const target = event.target as HTMLElement | null;
            if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
                return;
            }

            if (isAutoScrolling.current) {
                event.preventDefault();
                return;
            }

            if (hasForcedScroll.current) return;
            if (!isWithinHero()) return;

            event.preventDefault();
            hasForcedScroll.current = true;
            scrollToNext();
        };

        const handleTouchStart = (event: TouchEvent) => {
            touchStartY.current = event.touches[0]?.clientY ?? null;
        };

        const handleTouchMove = (event: TouchEvent) => {
            if (isAutoScrolling.current) {
                if (event.cancelable) event.preventDefault();
                return;
            }

            if (hasForcedScroll.current) return;
            if (touchStartY.current === null) return;

            const currentY = event.touches[0]?.clientY ?? null;
            if (currentY === null) return;

            const delta = touchStartY.current - currentY;
            if (delta <= 32) return;
            if (!isWithinHero()) return;

            if (event.cancelable) event.preventDefault();

            hasForcedScroll.current = true;
            scrollToNext();
        };

        const handleTouchEnd = () => {
            touchStartY.current = null;
        };

        const handleScroll = () => {
            // Reset forced scroll flag when user scrolls back near top
            if (window.scrollY <= hero.offsetHeight * 0.25) {
                hasForcedScroll.current = false;
            }
        };

        hero.addEventListener('wheel', handleWheel, { passive: false });
        hero.addEventListener('touchstart', handleTouchStart, { passive: true });
        hero.addEventListener('touchmove', handleTouchMove, { passive: false });
        hero.addEventListener('touchend', handleTouchEnd);
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            hero.removeEventListener('wheel', handleWheel);
            hero.removeEventListener('touchstart', handleTouchStart);
            hero.removeEventListener('touchmove', handleTouchMove);
            hero.removeEventListener('touchend', handleTouchEnd);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('scroll', handleScroll);
            if (timeoutRef.current !== null) {
                window.clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (
        <section ref={sectionRef} className="relative h-[100vh] flex items-center -mt-14 pt-14 mb-20 md:mb-28 lg:mb-32 overflow-hidden rounded-b-3xl shadow-primary/30 shadow-2xl bg-background bg-gradient-to-t from-card to-transparent">
            <div className="absolute inset-0">
                <Aurora
                    amplitude={1.0}
                    blend={0.8}
                    colorStops={['var(--primary)', 'var(--accent)', 'var(--primary)']}
                    lightSettings={{
                        bias: 0.3,
                        midPoint: 0.45,
                        intensityScale: 0.5,
                        baseColor: '#ffffff',
                        baseStrength: 1.0
                    }}
                    darkSettings={{
                        bias: 0,
                        midPoint: 0.2,
                        intensityScale: 0.6,
                        baseStrength: 0
                    }}
                />
            </div>
            <div className="container relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="max-w-4xl text-left space-y-6 lg:space-y-10">
                        {badge && (
                            <RevealOnScroll direction="up" duration={0.6}>
                                <span className="inline-flex items-center px-3 py-1 rounded-full border border-primary/70 bg-accent/60 text-accent-foreground text-[11px] md:text-sm font-semibold tracking-wider backdrop-blur uppercase">
                                    {badge}
                                </span>
                            </RevealOnScroll>
                        )}
                        <RevealOnScroll direction="up" delay={0.15} duration={0.7}>
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight">
                                {title}
                            </h1>
                        </RevealOnScroll>
                        {description && (
                            <RevealOnScroll direction="up" delay={0.3} duration={0.7}>
                                <p className="text-lg md:text-xl text-foreground/70">
                                    {description}
                                </p>
                            </RevealOnScroll>
                        )}
                        {(primaryCta || secondaryCta) && (
                            <RevealOnScroll direction="up" delay={0.45} duration={0.5}>
                                <div className="flex flex-wrap gap-4">
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
                        {children}
                    </div>
                </div>
            </div>
        </section>
    );
}
