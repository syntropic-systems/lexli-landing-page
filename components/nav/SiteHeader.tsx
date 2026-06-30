"use client";

import * as React from "react";
import Link from "next/link";
import { Menu as MenuIcon, X } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const APP_URL = "https://app.lexli.ai";

type NavItem = { href: string; label: string };

const navItems: NavItem[] = [
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How it works" },
    { href: "#who-its-for", label: "Who it’s for" },
];

/**
 * Smooth-scroll to an in-page anchor, accounting for the sticky header height.
 */
function scrollToHash(hash: string) {
    const id = hash.replace(/^#/, "");
    const el = document.getElementById(id);
    if (!el) return;
    const header = document.querySelector("header") as HTMLElement | null;
    const headerHeight = header?.offsetHeight ?? 0;
    const top = el.getBoundingClientRect().top + window.scrollY - headerHeight;
    window.scrollTo({ top: Math.max(top, 0), behavior: "smooth" });
}

export function SiteHeader() {
    const [isOpen, setIsOpen] = React.useState(false);
    const [isNearTop, setIsNearTop] = React.useState(true);

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

    const handleNavClick = React.useCallback(
        (href: string, close?: () => void) => (e: React.MouseEvent) => {
            if (href.startsWith("#")) {
                e.preventDefault();
                scrollToHash(href);
            }
            close?.();
        },
        []
    );

    const headerClassName = cn(
        "sticky top-0 z-50 w-full backdrop-blur-md supports-[backdrop-filter]:bg-card/50 transition-all duration-300 border-b",
        !isNearTop ? "border-border shadow-sm" : "border-transparent"
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
                    <div className="flex items-center gap-6">
                        {/* Logo / wordmark */}
                        <Link
                            href="/"
                            className="flex items-center text-xl font-semibold tracking-tight transition-transform duration-200 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                            aria-label="Lexli home"
                        >
                            Lexli
                        </Link>

                        {/* Desktop nav */}
                        <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
                            {navItems.map((item) => (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    onClick={handleNavClick(item.href)}
                                    className="px-3 py-2 text-sm font-medium text-foreground/80 rounded-md transition-colors hover:text-foreground hover:bg-accent"
                                >
                                    {item.label}
                                </a>
                            ))}
                        </nav>
                    </div>

                    {/* Right side actions */}
                    <div className="flex items-center gap-2">
                        <div className="hidden lg:flex items-center gap-2">
                            <Button variant="default" asChild>
                                <a href="#contact" onClick={handleNavClick("#contact")}>
                                    Book a Demo
                                </a>
                            </Button>
                            <Button variant="secondary" asChild>
                                <a href={APP_URL} target="_blank" rel="noopener noreferrer">
                                    Sign In
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
                                    className="flex flex-col gap-2 flex-1 overflow-y-auto"
                                    aria-label="Mobile navigation"
                                >
                                    {navItems.map((item) => (
                                        <a
                                            key={item.href}
                                            href={item.href}
                                            onClick={handleNavClick(item.href, () => setIsOpen(false))}
                                            className="py-2 px-3 text-base font-medium rounded-md transition-colors text-foreground hover:bg-accent hover:text-accent-foreground"
                                        >
                                            {item.label}
                                        </a>
                                    ))}
                                </nav>
                                <SheetFooter className="border-t pt-4 flex flex-col gap-2">
                                    <Button variant="secondary" className="w-full justify-center" asChild>
                                        <a
                                            href={APP_URL}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Sign In
                                        </a>
                                    </Button>
                                    <Button className="w-full justify-center" asChild>
                                        <a href="#contact" onClick={handleNavClick("#contact", () => setIsOpen(false))}>
                                            Book a Demo
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
