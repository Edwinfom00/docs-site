import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Edwin Packages — Documentation",
    template: "%s | Edwin Packages",
  },
  description: "Official documentation for open-source packages by Edwin Fom — @edwinfom/ai-guard and more.",
  keywords: ["documentation", "ai-guard", "pii", "llm", "security", "middleware", "typescript"],
  authors: [{ name: "Edwin Fom" }],
  creator: "Edwin Fom",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://packages.edwinfom.dev",
    title: "Edwin Packages — Documentation",
    description: "Official documentation for open-source packages by Edwin Fom.",
    siteName: "Edwin Packages",
  },
  twitter: {
    card: "summary_large_image",
    title: "Edwin Packages — Documentation",
    description: "Official documentation for open-source packages by Edwin Fom.",
    creator: "@edwinfom",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
