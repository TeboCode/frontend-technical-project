import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/config/site";
import { baseOpenGraph, baseTwitter } from "@/lib/seo";
import { siteJsonLd } from "@/lib/structured-data";
import { DEFAULT_THEME, themeInitScript } from "@/lib/theme";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Site-wide defaults. Pages override these with pageMetadata() from lib/seo.
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: {
    ...baseOpenGraph,
    title: siteConfig.title,
    description: siteConfig.description,
  },
  twitter: {
    ...baseTwitter,
    title: siteConfig.title,
    description: siteConfig.description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // Rendered light; the inline script may switch data-theme before first
    // paint, hence suppressHydrationWarning on <html>.
    <html
      lang={siteConfig.locale}
      data-theme={DEFAULT_THEME}
      suppressHydrationWarning
      className={`${inter.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <JsonLd data={siteJsonLd()} />
        <Header />
        {/* Flex column so short pages (404, errors) can stretch to the footer. */}
        <main className="flex flex-1 flex-col">{children}</main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
