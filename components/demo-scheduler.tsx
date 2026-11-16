"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { capture } from "@/lib/analytics";
import { CALENDLY_URL } from "@/lib/site";

const CALENDLY_ORIGIN = "https://calendly.com";
const MIN_HEIGHT = 700;

const noSubscribe = () => () => {};

function calendlySrc(host: string) {
  const url = new URL(CALENDLY_URL);
  url.searchParams.set("embed_domain", host);
  url.searchParams.set("embed_type", "Inline");
  url.searchParams.set("hide_gdpr_banner", "1");
  return url.toString();
}

/**
 * Calendly's booking page, embedded inline. A plain iframe rather than
 * Calendly's widget.js: the embed_domain/embed_type params are what make
 * Calendly post its events to us, and that is all widget.js adds that we use.
 *
 * - calendly.page_height: resize to the page Calendly is showing, so there is
 *   no scrollbar inside a scrollbar
 * - calendly.event_scheduled: a demo was booked; sent to PostHog as demo_booked
 *   (no invitee details: Calendly sends only URIs, and we keep it that way)
 */
export function DemoScheduler() {
  // The src needs the page's host, which the server render does not have.
  const host = useSyncExternalStore(noSubscribe, () => window.location.host, () => null);
  const src = host ? calendlySrc(host) : null;
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
    <div
      className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm"
      style={{ height }}
    >
      {src ? (
        <iframe
          src={src}
          title="Book a demo with Lexli"
          className="h-full w-full"
          loading="lazy"
        />
      ) : (
        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
          Loading the calendar…
        </div>
      )}
    </div>
  );
}
