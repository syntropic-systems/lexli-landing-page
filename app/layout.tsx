import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import { SiteHeader } from "@/components/nav/SiteHeader";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const siteUrl = "https://lexli.ai";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Lexli — AI Legal Workspace for Indian Legal Teams",
    template: "%s | Lexli",
  },
  description:
    "Lexli is the AI legal workspace for Indian legal teams — manage cases, translate documents across Marathi, Hindi and English, and get cited answers from your own case files, all in one secure place.",
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
    title: "Lexli — AI Legal Workspace for Indian Legal Teams",
    description:
      "Manage cases, translate documents, and get cited answers from your own case files — all in one secure place.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lexli — AI Legal Workspace for Indian Legal Teams",
    description:
      "Manage cases, translate documents, and get cited answers from your own case files — all in one secure place.",
  },
  alternates: {
    canonical: siteUrl,
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
    "AI legal workspace for Indian legal teams — case management, AI case assistant with citations, legal document translation, and document scanning.",
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
    <html lang="en" suppressHydrationWarning>
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
        className={`${jakartaSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div
            className="pointer-events-none fixed inset-0 z-0 opacity-[0.15]"
            style={{
              backgroundImage:
                "radial-gradient(circle, var(--primary) 0.75px, transparent 0.75px)",
              backgroundSize: "24px 24px",
            }}
          />
          <SiteHeader />
          <main className="relative z-[1] flex-1">{children}</main>
          <div className="relative z-[1]">
            <Footer />
          </div>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
