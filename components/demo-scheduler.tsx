"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { capture } from "@/lib/analytics";
import { CALENDLY_URL } from "@/lib/site";

const CALENDLY_ORIGIN = "https://calendly.com";
const MIN_HEIGHT = 700;

/**
 * --background, --foreground and --primary from styles/globals.css, as the hex
 * Calendly's URL params take. Keep in step with the tokens if they change.
 */
const COLORS = {
  light: { background: "fafafa", text: "242424", primary: "a45007" },
  dark: { background: "0c0c0c", text: "f5f5f5", primary: "af5608" },
};

const noSubscribe = () => () => {};

function calendlySrc(host: string, theme: keyof typeof COLORS) {
  const colors = COLORS[theme];
  const url = new URL(CALENDLY_URL);
  url.searchParams.set("embed_domain", host);
  url.searchParams.set("embed_type", "Inline");
  url.searchParams.set("hide_gdpr_banner", "1");
  url.searchParams.set("background_color", colors.background);
  url.searchParams.set("text_color", colors.text);
  url.searchParams.set("primary_color", colors.primary);
  return url.toString();
}

/**
 * Calendly's booking page, embedded inline in the site's own colours. A plain
 * iframe rather than Calendly's widget.js: the embed_domain/embed_type params
 * are what make Calendly post its events to us, and that is all widget.js adds
 * that we use. The colours follow the theme; switching theme reloads the frame.
 *
 * - calendly.page_height: resize to the page Calendly is showing, so there is
 *   no scrollbar inside a scrollbar
 * - calendly.event_scheduled: a demo was booked; sent to PostHog as demo_booked
 *   (no invitee details: Calendly sends only URIs, and we keep it that way)
 */
export function DemoScheduler() {
  // The src needs the page's host and the resolved theme; the server render has neither.
  const host = useSyncExternalStore(noSubscribe, () => window.location.host, () => null);
  const { resolvedTheme } = useTheme();
  const src = host && resolvedTheme ? calendlySrc(host, resolvedTheme === "dark" ? "dark" : "light") : null;
  const [height, setHeight] = useState(MIN_HEIGHT);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== CALENDLY_ORIGIN) return;
      const data = event.data as { event?: string; payload?: { height?: string } } | null;
      if (data?.event === "calendly.page_height") {
        const next = parseInt(data.payload?.height ?? "", 10);
        if (next > 0) setHeight(Math.max(next, MIN_HEIGHT));
      } else if (data?.event === "calendly.event_scheduled") {
        capture("demo_booked");
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <div className="mx-auto max-w-4xl" style={{ height }}>
      {src && (
        <iframe
          key={src}
          src={src}
          title="Book a demo with Lexli"
          className="h-full w-full border-0 bg-background"
          loading="lazy"
        />
      )}
    </div>
  );
}
