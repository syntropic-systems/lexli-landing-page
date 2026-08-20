"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowRight, Menu as MenuIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { ThemeAwareImage } from "@/components/theme-aware-image";
import {
    Menu as NavbarMenu,
    MenuItem as NavbarMenuItem,
    HoveredLink,
    ProductItem,
} from "@/components/ui/navbar-menu";
import { scrollToId, setScrollTarget } from "@/components/scroll-to-section";
import { cn } from "@/lib/utils";
import { APP_URL, CTA, DEMO_HREF } from "@/lib/site";
import { allTools, companyLinks, platformSections, solutions } from "@/data/navigation";
import { motion } from "framer-motion";

type DropdownHighlight = {
    title: string;
    description?: string;
    href: string;
    icon?: React.ReactNode;
};

type DropdownLink = { label: string; href: string };

type DropdownSection = { title?: string; links: DropdownLink[] };

type NavDropdown = {
    highlights?: DropdownHighlight[];
    /** Highlight-card columns; defaults to 2 (the Tools grid). */
    highlightColumns?: 1 | 2;
    /** Kicker over the highlight cards (only Solutions needs one — its
     * cards sit under a plain link list, so the group earns a label). */
    highlightsTitle?: string;
    sections?: DropdownSection[];
    footer?: { label: string; href: string };
};

type NavItem = {
    href: string;
    label: string;
    dropdown?: NavDropdown;
};


const navItems: NavItem[] = [
    {
        href: "/platform",
        label: "Platform",
        dropdown: {
            // One page, seven sections: Overview leads the list (the footer's
            // Platform column does the same) and there is no bottom link, since
            // it would only repeat the trigger. Columns split 4+4, even.
            sections: [
                {
                    links: [
                        { label: "Overview", href: "/platform" },
                        ...platformSections.slice(0, 3).map(({ label, href }) => ({ label, href })),
                    ],
                },
                { links: platformSections.slice(3).map(({ label, href }) => ({ label, href })) },
            ],
        },
    },
    {
        href: "/tools",
        label: "Tools",
        dropdown: {
            highlights: allTools.map((tool) => ({
                title: tool.label,
                description: tool.description,
                href: tool.href,
                icon: tool.icon ? <tool.icon className="h-7 w-7 text-primary" /> : undefined,
            })),
            footer: { label: "All six tools", href: "/tools" },
        },
    },
    {
        href: "/solutions",
        label: "Solutions",
        dropdown: {
            // Mixed on purpose: the index page's own items lead as a plain
            // Platform-style list (Overview stands in for a footer link),
            // then the three persona pages get the Tools treatment — cards
            // with descriptions, in one column so the doors read as a list,
            // under the group's own kicker.
            sections: [
                {
                    links: [
                        { label: "Overview", href: "/solutions" },
                        { label: "Accounts and profiles", href: "/solutions#accounts" },
                    ],
                },
            ],
            highlightsTitle: "Who you are",
            highlightColumns: 1,
            highlights: solutions.map((solution) => ({
                title: solution.label,
                description: solution.description,
                href: solution.href,
                icon: solution.icon ? (
                    <solution.icon className="h-7 w-7 text-primary" />
                ) : undefined,
            })),
        },
    },
    {
        href: "/company",
        label: "Company",
        dropdown: {
            // companyLinks already opens with About Lexli, so no footer link.
            sections: [{ links: companyLinks.map(({ label, href }) => ({ label, href })) }],
        },
    },
    // Top-level, not nested under Company: the FAQ answers buying questions,
    // and burying it a hover deep costs it the traffic it exists for.
    { href: "/faq", label: "FAQ" },
];

/** Split "/platform#security" into the route and the section to scroll to. */
function parseScrollHref(href: string): { cleanHref: string; sectionId: string | null } {
    const hashIndex = href.indexOf("#");
    if (hashIndex === -1) return { cleanHref: href, sectionId: null };
    return { cleanHref: href.slice(0, hashIndex), sectionId: href.slice(hashIndex + 1) };
}

function DropdownContent({
    dropdown,
    onNavigate,
}: {
    dropdown: NavDropdown;
    onNavigate: () => void;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const sectionCount = dropdown.sections?.length ?? 0;

    // An anchor link either scrolls (already on the page) or stores the target
    // and navigates — the element does not exist yet on the other route.
    const handleScrollLink = React.useCallback(
        (href: string) => {
            const { cleanHref, sectionId } = parseScrollHref(href);
            onNavigate();

            if (sectionId) {
                if (pathname === cleanHref) {
                    scrollToId(sectionId);
                    return;
                }
                setScrollTarget(sectionId);
            } else if (pathname === cleanHref) {
                // A page link clicked on its own page (Overview, About Lexli):
                // Next treats same-route navigation as a no-op, so scroll to
                // the top instead — the link still visibly does something.
                window.scrollTo({ top: 0, behavior: "smooth" });
                return;
            }
            router.push(cleanHref || "/");
        },
        [onNavigate, pathname, router]
    );

    return (
        <div className="flex flex-col gap-3">
            {sectionCount > 0 ? (
                <div
                    className={cn("grid gap-4", sectionCount === 1 ? "grid-cols-1" : "grid-cols-2")}
                    style={{ minWidth: sectionCount === 1 ? "220px" : "420px" }}
                >
                    {dropdown.sections?.map((section, index) => (
                        <div key={section.title ?? `section-${index}`} className="flex flex-col gap-2">
                            {section.title ? (
                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground pt-1 pl-3">
                                    {section.title}
                                </p>
                            ) : null}
                            <div className="flex flex-col gap-1">
                                {section.links.map((link) => {
                                    const { cleanHref, sectionId } = parseScrollHref(link.href);
                                    // Buttons, not links, for anything the handler must
                                    // drive itself: section anchors, and a page link
                                    // clicked on its own page (scroll-to-top).
                                    return sectionId || pathname === cleanHref ? (
                                        <button
                                            key={link.href}
                                            type="button"
                                            className="block w-full text-left rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                                            onClick={() => handleScrollLink(link.href)}
                                        >
                                            {link.label}
                                        </button>
                                    ) : (
                                        <HoveredLink
                                            key={link.href}
                                            href={link.href}
                                            className="block rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                                            onClick={onNavigate}
                                        >
                                            {link.label}
                                        </HoveredLink>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            ) : null}
            {dropdown.highlights?.length ? (
                <div className="flex flex-col gap-2">
                    {dropdown.highlightsTitle ? (
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground pt-1 pl-3">
                            {dropdown.highlightsTitle}
                        </p>
                    ) : null}
                    <div
                        className={cn(
                            "grid grid-cols-1 gap-2",
                            dropdown.highlightColumns !== 1 && "sm:grid-cols-2"
                        )}
                        style={{ maxWidth: dropdown.highlightColumns === 1 ? "360px" : "640px" }}
                    >
                        {dropdown.highlights.map((highlight) => (
                            <ProductItem
                                key={highlight.href}
                                title={highlight.title}
                                description={highlight.description}
                                href={highlight.href}
                                icon={highlight.icon}
                                onClick={onNavigate}
                                showArrow
                            />
                        ))}
                    </div>
                </div>
            ) : null}
            {dropdown.footer ? (
                <HoveredLink
                    href={dropdown.footer.href}
                    className="inline-flex items-center gap-1 border-t pt-2 text-xs font-semibold text-primary hover:text-primary/80"
                    onClick={onNavigate}
                >
                    <span>{dropdown.footer.label}</span>
                    <ArrowRight className="h-3 w-3" />
                </HoveredLink>
            ) : null}
        </div>
    );
}

export function SiteHeader() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = React.useState(false);
    const [isNearTop, setIsNearTop] = React.useState(true);
    const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (typeof window === "undefined") return;

        let frame: number | null = null;
        const updateState = () => {
            setIsNearTop(window.scrollY <= 10);
            frame = null;
        };
        const handleScroll = () => {
            if (frame === null) frame = window.requestAnimationFrame(updateState);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        updateState();
        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (frame !== null) window.cancelAnimationFrame(frame);
        };
    }, []);

    const closeMobile = React.useCallback(() => setIsOpen(false), []);

    const handleMobileLink = React.useCallback(
        (href: string) => () => {
            closeMobile();
            const { cleanHref, sectionId } = parseScrollHref(href);
            if (pathname === cleanHref) {
                // Wait for the sheet's close animation before scrolling. A
                // page link on its own page scrolls to the top (same-route
                // navigation is otherwise a no-op).
                setTimeout(
                    () =>
                        sectionId
                            ? scrollToId(sectionId)
                            : window.scrollTo({ top: 0, behavior: "smooth" }),
                    300
                );
                return;
            }
            if (sectionId) setScrollTarget(sectionId);
        },
        [closeMobile, pathname]
    );

    const headerClassName = cn(
        "sticky top-0 z-50 w-full backdrop-blur-md transition-all duration-300",
        !isNearTop ? "shadow-sm supports-[backdrop-filter]:bg-card/50" : ""
    );

    return (
        <motion.header
            className={headerClassName}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
            <div className="container">
                <div className="max-w-7xl mx-auto flex h-14 items-center justify-between">
                    <div className="flex items-center gap-4">
                        {/* Logo / wordmark */}
                        <Link
                            href="/"
                            className="flex items-center shrink-0 transition-transform duration-200 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                            aria-label="Lexli home"
                        >
                            <ThemeAwareImage
                                src="/logos/light_lg.svg"
                                srcDark="/logos/dark_lg.svg"
                                alt="Lexli"
                                width={110}
                                height={24}
                                priority
                                className="h-6 w-auto"
                            />
                        </Link>

                        {/* Desktop nav */}
                        <NavbarMenu
                            aria-label="Main navigation"
                            setActive={setActiveDropdown}
                            className="hidden lg:relative lg:flex lg:items-center lg:gap-1"
                        >
                            {navItems.map((item) => (
                                <NavbarMenuItem
                                    key={item.href}
                                    item={item.label}
                                    href={item.href}
                                    setActive={setActiveDropdown}
                                    active={activeDropdown}
                                    isRouteActive={pathname.startsWith(item.href)}
                                    onNavigate={() => setActiveDropdown(null)}
                                >
                                    {item.dropdown ? (
                                        <DropdownContent
                                            dropdown={item.dropdown}
                                            onNavigate={() => setActiveDropdown(null)}
                                        />
                                    ) : null}
                                </NavbarMenuItem>
                            ))}
                        </NavbarMenu>
                    </div>

                    {/* Right side actions */}
                    <div className="flex items-center gap-2">
                        <div className="hidden lg:flex items-center gap-2">
                            <Button variant="secondary" asChild>
                                <a href={DEMO_HREF}>
                                    {CTA.bookDemo}
                                </a>
                            </Button>
                            <Button variant="default" asChild>
                                <a href={APP_URL} target="_blank" rel="noopener noreferrer">
                                    {CTA.startFreeShort}
                                </a>
                            </Button>
                        </div>
                        <ThemeToggle />

                        {/* Mobile menu */}
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="lg:hidden h-9 w-9"
                                    aria-label="Open menu"
                                >
                                    <MenuIcon className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent
                                side="right"
                                className="w-[300px] sm:w-[400px] flex flex-col backdrop-blur-md bg-card/80 border-border/50"
                            >
                                <SheetHeader className="flex flex-row items-center justify-between pb-2 border-b">
                                    <SheetTitle>Menu</SheetTitle>
                                    <SheetClose className="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                                        <X className="h-4 w-4" />
                                        <span className="sr-only">Close</span>
                                    </SheetClose>
                                </SheetHeader>
                                <nav
                                    className="flex flex-col gap-1 flex-1 overflow-y-auto py-2"
                                    aria-label="Mobile navigation"
                                >
                                    <Link
                                        href="/"
                                        onClick={closeMobile}
                                        className="py-2 px-3 text-base font-medium rounded-md transition-colors text-foreground hover:bg-accent hover:text-accent-foreground"
                                    >
                                        Home
                                    </Link>
                                    {navItems.map((item) => (
                                        <div key={item.href} className="flex flex-col">
                                            <Link
                                                href={item.href}
                                                onClick={closeMobile}
                                                className={cn(
                                                    "py-2 px-3 text-base font-medium rounded-md transition-colors",
                                                    pathname === item.href
                                                        ? "bg-secondary text-secondary-foreground"
                                                        : "text-foreground hover:bg-accent hover:text-accent-foreground"
                                                )}
                                                aria-current={pathname === item.href ? "page" : undefined}
                                            >
                                                {item.label}
                                            </Link>
                                            <div className="pl-3 pb-2 flex flex-col">
                                                {item.dropdown?.sections?.flatMap((section) =>
                                                    section.links.map((link) => {
                                                        const { cleanHref, sectionId } = parseScrollHref(link.href);
                                                        return (
                                                            <Link
                                                                key={link.href}
                                                                href={sectionId ? cleanHref || "/" : link.href}
                                                                onClick={handleMobileLink(link.href)}
                                                                className="px-4 py-2 text-sm rounded-md text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
                                                            >
                                                                {link.label}
                                                            </Link>
                                                        );
                                                    })
                                                )}
                                                {item.dropdown?.highlights?.map((highlight) => (
                                                    <Link
                                                        key={highlight.href}
                                                        href={highlight.href}
                                                        onClick={closeMobile}
                                                        className="px-4 py-2 text-sm rounded-md text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
                                                    >
                                                        {highlight.title}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </nav>
                                <SheetFooter className="border-t pt-4 flex flex-col gap-2">
                                    <Button variant="secondary" className="w-full justify-center" asChild>
                                        <a
                                            href={DEMO_HREF}
                                            onClick={closeMobile}
                                        >
                                            {CTA.bookDemo}
                                        </a>
                                    </Button>
                                    <Button className="w-full justify-center" asChild>
                                        <a
                                            href={APP_URL}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={closeMobile}
                                        >
                                            {CTA.startFreeShort}
                                        </a>
                                    </Button>
                                </SheetFooter>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </motion.header>
    );
}
