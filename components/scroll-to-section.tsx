"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const STORAGE_KEY = "scroll-to-section";

/**
 * Store a section ID to scroll to after navigation. Used by the header's
 * dropdowns, where a link like `/platform#security` has to navigate first and
 * scroll second — the target element does not exist until the new page renders.
 */
export function setScrollTarget(sectionId: string) {
  sessionStorage.setItem(STORAGE_KEY, sectionId);
}

/** Scroll a section into view under the sticky header. */
export function scrollToId(sectionId: string) {
  const el = document.getElementById(sectionId);
  if (!el) return;
  const header = document.querySelector("header") as HTMLElement | null;
  const top = el.getBoundingClientRect().top + window.scrollY - (header?.offsetHeight ?? 0);
  window.scrollTo({ top: Math.max(top, 0), behavior: "smooth" });
}

/**
 * Consumes the stored target after navigation. Mounted once in the root layout.
 */
export function ScrollToSection() {
  const pathname = usePathname();

  useEffect(() => {
    const sectionId = sessionStorage.getItem(STORAGE_KEY);
    if (!sectionId) return;

    sessionStorage.removeItem(STORAGE_KEY);

    // Let the new page paint before measuring the target's position.
    const timeout = setTimeout(() => scrollToId(sectionId), 100);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return null;
}
