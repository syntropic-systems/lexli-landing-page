"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { scrollToId, setScrollTarget } from "@/components/scroll-to-section";

/**
 * A link that may carry a `#section` — navigates on the clean route and
 * scrolls via the header's scroll-target machinery, so the hash never lands
 * in the URL (the site's convention). Hash-less hrefs behave as plain links.
 */
export function ScrollLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const hashIndex = href.indexOf("#");
  const sectionId = hashIndex === -1 ? null : href.slice(hashIndex + 1);
  // A bare "#section" href scrolls on the current page.
  const cleanHref =
    hashIndex === -1 ? href : hashIndex === 0 ? pathname : href.slice(0, hashIndex) || "/";

  return (
    <Link
      href={cleanHref}
      className={className}
      onClick={(event) => {
        if (!sectionId) return;
        event.preventDefault();
        if (pathname === cleanHref) {
          scrollToId(sectionId);
          return;
        }
        setScrollTarget(sectionId);
        router.push(cleanHref);
      }}
    >
      {children}
    </Link>
  );
}
