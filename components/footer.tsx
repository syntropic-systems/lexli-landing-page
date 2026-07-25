'use client';

import Link from 'next/link';
import { Linkedin } from 'lucide-react';
import { RevealOnScroll, StaggerChildren, StaggerItem } from '@/components/animations';
import { ThemeAwareImage } from '@/components/theme-aware-image';

type FooterLink = { name: string; href: string };

const footerSections: { title: string; links: FooterLink[] }[] = [
    {
        title: 'Product',
        links: [
            { name: 'Features', href: '#features' },
            { name: 'How it works', href: '#how-it-works' },
            { name: 'Who it’s for', href: '#who-its-for' },
        ],
    },
    {
        title: 'Company',
        links: [
            { name: 'Book a Demo', href: '#contact' },
            { name: 'Sign In', href: 'https://dev-app.lexli.ai/' },
        ],
    },
];

const socialLinks = [
    { name: 'LinkedIn', href: 'https://www.linkedin.com/company/lexli-ai', icon: Linkedin },
];

export function Footer() {
    return (
        <footer className="border-t bg-card">
            <div className="container pt-12 md:pt-16 lg:pt-20">
                <div className="max-w-7xl mx-auto">
                    <RevealOnScroll direction="up" duration={0.6}>
                        <div className="flex flex-col gap-4 mb-10">
                            <Link href="/" className="flex items-center" aria-label="Lexli home">
                                <ThemeAwareImage
                                    src="/logos/light_lg.svg"
                                    srcDark="/logos/dark_lg.svg"
                                    alt="Lexli"
                                    width={128}
                                    height={28}
                                    className="h-7 w-auto"
                                />
                            </Link>
                            <p className="text-sm text-muted-foreground max-w-2xl">
                                Lexli is the AI legal workspace for Indian legal teams — manage cases,
                                translate documents, and get cited answers from your case files, all in
                                one secure place.
                            </p>
                        </div>
                    </RevealOnScroll>

                    <StaggerChildren className="grid grid-cols-2 gap-8 mb-8" stagger={0.08}>
                        {footerSections.map((group) => (
                            <StaggerItem key={group.title}>
                                <div>
                                    <span className="font-semibold mb-3 block">{group.title}</span>
                                    <ul className="space-y-2">
                                        {group.links.map((link) => (
                                            <li key={link.name}>
                                                <a
                                                    href={link.href}
                                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                                >
                                                    {link.name}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </StaggerItem>
                        ))}
                    </StaggerChildren>

                    <div className="py-3 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            {socialLinks.map(({ name, href, icon: Icon }) => (
                                <Link
                                    key={name}
                                    href={href}
                                    aria-label={name}
                                    className="text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    <Icon className="h-4 w-4" style={{ fill: 'currentColor', stroke: 'none' }} />
                                </Link>
                            ))}
                        </div>
                        <p className="text-sm text-muted-foreground">
                            © {new Date().getFullYear()} Lexli. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
