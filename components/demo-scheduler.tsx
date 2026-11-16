"use client";

import { useEffect, useSyncExternalStore } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";
import { useTheme } from "next-themes";
import { capture } from "@/lib/analytics";
import { CAL_LINK } from "@/lib/site";

/** Namespaces with the demo_booked listener; cal("on") adds one per call, so each gets it once. */
const listening = new Set<string>();

/**
 * Our tokens from styles/globals.css, as hex, on Cal.com's colour variables.
 * The booker is an iframe on Cal.com's origin, so it cannot read our CSS
 * variables; keep these in step with the tokens if they change.
 */
const CAL_COLORS = {
  light: {
    "cal-brand": "#a45007", // --primary
    "cal-brand-text": "#ffffff", // --primary-foreground
    "cal-bg": "#ffffff", // --card
    "cal-bg-emphasis": "#eee0d3", // --accent: available dates
    "cal-border": "#e7e5e2", // --border
    "cal-border-subtle": "#e7e5e2",
    "cal-border-booker": "#e7e5e2",
    "cal-text": "#242424", // --foreground
    "cal-text-emphasis": "#4a2c16", // --accent-foreground: date numbers (and headings) on --accent
    "cal-text-subtle": "#737373", // --muted-foreground
    "cal-text-muted": "#737373",
  },
  dark: {
    "cal-brand": "#af5608",
    "cal-brand-text": "#ffffff",
    "cal-bg": "#141414",
    "cal-bg-emphasis": "#2a211b",
    "cal-border": "#262626",
    "cal-border-subtle": "#262626",
    "cal-border-booker": "#262626",
    "cal-text": "#f5f5f5",
    "cal-text-emphasis": "#f5eee8",
    "cal-text-subtle": "#a3a09c",
    "cal-text-muted": "#a3a09c",
  },
};

const noSubscribe = () => () => {};

/**
 * Cal.com's booker, inline, in the site's theme and colours. Each theme gets its own namespace: Cal.com keeps settings per
 * namespace, and reusing one across a theme switch left the old theme's
 * background behind the booker.
 *
 * A booking is sent to PostHog as demo_booked, with no invitee details.
 */
export function DemoScheduler() {
  // The theme is only known in the browser, so the server render leaves the space empty.
  const mounted = useSyncExternalStore(noSubscribe, () => true, () => false);
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "dark" ? "dark" : "light";
  const namespace = `demo-${theme}`;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const cal = await getCalApi({ namespace });
      if (cancelled) return;
      cal("ui", {
        theme,
        cssVarsPerTheme: CAL_COLORS,
        layout: "month_view",
      });
      if (!listening.has(namespace)) {
        listening.add(namespace);
        cal("on", { action: "bookingSuccessfulV2", callback: () => capture("demo_booked") });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [namespace, theme]);

  return (
    <div className="mx-auto min-h-[700px] w-full max-w-6xl">
      {mounted && (
        <Cal
          key={namespace}
          namespace={namespace}
          calLink={CAL_LINK}
          config={{ layout: "month_view", theme }}
          style={{ width: "100%", height: "100%", minHeight: 700 }}
        />
      )}
    </div>
  );
}
