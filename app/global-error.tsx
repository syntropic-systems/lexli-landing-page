'use client';

/**
 * Root-level error boundary. Replaces Next's implicit `_global-error` page,
 * which cannot be prerendered once the root layout renders client components
 * that read routing state (the header, the scroll-target consumer).
 *
 * This renders its own <html>/<body> — it replaces the root layout entirely.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
          {/* No font-serif here on purpose: this boundary replaces the root
              layout, so the --font-spectral variable is not in scope and the
              class would resolve to the generic Georgia fallback. */}
          <h1 className="text-2xl font-semibold tracking-tight">Something went wrong</h1>
          <p className="max-w-md text-sm text-neutral-500">
            The page could not be loaded. Try again, or return to the homepage.
          </p>
          {error.digest && (
            <p className="text-xs text-neutral-400">Reference: {error.digest}</p>
          )}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={reset}
              className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Try again
            </button>
            {/* Deliberately a hard navigation, not next/link: this boundary
                replaces the root layout after a crash, and a full reload is the
                only way to guarantee a clean router state. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-neutral-100"
            >
              Go home
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
