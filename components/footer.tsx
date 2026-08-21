'use client';

import Link from 'next/link';
import { Linkedin } from 'lucide-react';
import { RevealOnScroll, StaggerChildren, StaggerItem } from '@/components/animations';
import { ScrollLink } from '@/components/scroll-link';
import { ThemeAwareImage } from '@/components/theme-aware-image';
import { allTools, companyLinks, platformSections, solutions } from '@/data/navigation';
import { APP_URL, CTA, DEMO_HREF, LINKEDIN_URL } from '@/lib/site';

type FooterLink = { name: string; href: string };

const footerSections: { title: string; links: FooterLink[] }[] = [
    {
        title: 'Platform',
        links: [
            { name: 'Overview', href: '/platform' },
            ...platformSections.map((section) => ({ name: section.label, href: section.href })),
        ],
    },
    {
        title: 'Tools',
        links: [
            { name: 'All tools', href: '/tools' },
            ...allTools.map((tool) => ({ name: tool.label, href: tool.href })),
        ],
    },
    {
        // Same order as the header dropdown: index items first, then personas.
        title: 'Solutions',
        links: [
            { name: 'Overview', href: '/solutions' },
            { name: 'Accounts and profiles', href: '/solutions#accounts' },
            ...solutions.map((solution) => ({ name: solution.label, href: solution.href })),
        ],
    },
    {
        // companyLinks already carries About Lexli and Contact — no manual
        // additions, or the column doubles them.
        title: 'Company',
        links: companyLinks.map((link) => ({ name: link.label, href: link.href })),
    },
    {
        title: 'Get started',
        links: [
            { name: CTA.startFree, href: APP_URL },
            { name: CTA.signIn, href: APP_URL },
            { name: CTA.bookDemo, href: DEMO_HREF },
            { name: 'FAQ', href: '/faq' },
        ],
    },
];

const socialLinks = [{ name: 'LinkedIn', href: LINKEDIN_URL, icon: Linkedin }];

export function Footer() {
    return (
        <footer className="border-t bg-background">
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
                                The AI workspace for Indian legal practice. Cases, files, hearings, and
                                research in one place, with every Lexli tool working from the same record.
                            </p>
                        </div>
                    </RevealOnScroll>

                    <StaggerChildren
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-8"
                        stagger={0.08}
                    >
                        {footerSections.map((group) => (
                            <StaggerItem key={group.title}>
                                <div>
                                    <span className="font-semibold mb-3 block">{group.title}</span>
                                    <ul className="space-y-2">
                                        {group.links.map((link) => (
                                            <li key={`${group.title}-${link.name}`}>
                                                {/* Internal links go through ScrollLink so section
                                                    anchors scroll under the header without a # in
                                                    the URL; external ones stay plain anchors. */}
                                                {link.href.startsWith('/') ? (
                                                    <ScrollLink
                                                        href={link.href}
                                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                                    >
                                                        {link.name}
                                                    </ScrollLink>
                                                ) : (
                                                    <a
                                                        href={link.href}
                                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                                    >
                                                        {link.name}
                                                    </a>
                                                )}
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
