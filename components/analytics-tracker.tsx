"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { capture } from "@/lib/analytics";
import { APP_URL, DEMO_HREF, WAITLIST_HREF } from "@/lib/site";

/** Which call to action a link is, judged by where it goes; null for other links. */
function ctaTarget(url: URL): string | null {
  if (url.href.startsWith(APP_URL)) return "app";
  if (url.origin !== window.location.origin) return null;
  if (url.pathname === WAITLIST_HREF) return "waitlist";
  if (url.pathname === DEMO_HREF) return "contact";
  return null;
}

/** A section's name: its id, or else its first heading (most sections on the home page have no id). */
function sectionName(el: Element): string | null {
  if (el.id) return el.id;
  const heading = el.querySelector("h1, h2")?.textContent?.replace(/\s+/g, " ").trim();
  return heading ? heading.slice(0, 60) : null;
}

function locationOf(el: Element): string {
  if (el.closest("header")) return "header";
  if (el.closest("[role='dialog']")) return "mobile_menu";
  if (el.closest("footer")) return "footer";
  const section = el.closest("main section");
  return (section && sectionName(section)) ?? "page";
}

/**
 * PostHog events the SDK can't infer, for every page:
 * - section_viewed: a <main> section reaches the middle of the screen (once per page view), named by
 *   its id or its heading, so renaming a heading renames its event
 * - cta_clicked: a link to the app, the waitlist or the contact page
 * - email_clicked / outbound_clicked: mailto links and links to other sites
 * Nothing is sent when PostHog has no key (see lib/analytics.ts).
 */
export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // A zero-height band at the middle of the viewport, so sections taller than the screen still count.
    const seen = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const section = sectionName(entry.target);
          if (!section || seen.has(section)) continue;
          seen.add(section);
          capture("section_viewed", { section, path: pathname });
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    document.querySelectorAll("main section").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.("a");
      const href = link?.getAttribute("href");
      if (!link || !href) return;
      const path = window.location.pathname;
      const location = locationOf(link);

      if (href.startsWith("mailto:")) {
        capture("email_clicked", { location, path });
        return;
      }
      const url = new URL(href, window.location.href);
      const target = ctaTarget(url);
      if (target) {
        capture("cta_clicked", { target, label: link.textContent?.trim().slice(0, 60), location, path });
      } else if (url.origin !== window.location.origin) {
        capture("outbound_clicked", { destination: url.hostname.replace(/^www\./, ""), location, path });
      }
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
