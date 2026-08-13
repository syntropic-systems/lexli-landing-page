import type { Metadata } from "next";
import { Manrope, Spectral, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import { SiteHeader } from "@/components/nav/SiteHeader";
import { Footer } from "@/components/footer";
import { ScrollToSection } from "@/components/scroll-to-section";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

// App-wide sans (Manrope — variable font). Matches the Lexli product app.
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

// Serif (Spectral) — only renders where `font-serif` is applied. Matches the product app.
// Spectral is not a variable font, so explicit weights are required.
const spectral = Spectral({
  variable: "--font-spectral",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://lexli.ai";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Lexli - AI Legal Workspace for Indian Legal Teams",
    template: "%s | Lexli",
  },
  description:
    "Lexli is the AI legal workspace for Indian legal teams: manage cases, translate documents across Marathi, Hindi and English, and get cited answers from your own case files, all in one secure place.",
  keywords: [
    "AI legal workspace",
    "legal case management India",
    "AI legal assistant",
    "legal document translation",
    "Marathi legal translation",
    "Hindi legal translation",
    "legal document scanner",
    "case management software India",
    "AI for lawyers",
    "legal research AI",
  ],
  authors: [{ name: "Lexli" }],
  creator: "Lexli",
  publisher: "Lexli",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "Lexli",
    title: "Lexli - AI Legal Workspace for Indian Legal Teams",
    description:
      "Manage cases, translate documents, and get cited answers from your own case files, all in one secure place.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lexli - AI Legal Workspace for Indian Legal Teams",
    description:
      "Manage cases, translate documents, and get cited answers from your own case files, all in one secure place.",
  },
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", type: "image/png", sizes: "96x96" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  category: "Legal Technology",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Lexli",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "AI legal workspace for Indian legal teams: case management, AI case assistant with citations, legal document translation, and document scanning.",
  url: siteUrl,
  author: {
    "@type": "Organization",
    name: "Lexli",
    url: siteUrl,
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Lexli",
  url: siteUrl,
  description:
    "Lexli is an AI legal workspace built for how Indian legal practice actually works.",
  sameAs: ["https://www.linkedin.com/company/lexli-ai"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Font variables must sit on <html>, not <body>: globals.css declares
    // --font-sans/--font-serif at :root as var(--font-manrope)/var(--font-spectral).
    // If the next/font classes are on <body>, those references are undefined at
    // :root, so the theme variables compute to invalid and inherit down empty —
    // silently dropping BOTH Manrope and Spectral site-wide.
    <html
      lang="en"
      className={`${manrope.variable} ${spectral.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body
        className="antialiased min-h-screen flex flex-col font-sans"
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ScrollToSection />
          <SiteHeader />
          {/* `relative` kept (without a z-index) purely as the containing block
              for any absolutely-positioned descendant that lacks a closer
              positioned ancestor — removing it could silently reposition them. */}
          <main className="relative flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
