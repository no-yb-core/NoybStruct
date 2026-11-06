import type { Metadata, Viewport } from "next";
import { EB_Garamond, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const serifFont = EB_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600", "700"],
});

const codeFont = JetBrains_Mono({
  variable: "--font-code",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Noyb Struct",
    template: "%s | Noyb Struct",
  },
  description: "Learn design patterns by solving real challenges.",
  applicationName: "Noyb Struct",
  icons: {
    icon: [
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/logo-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/logo-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: { url: "/icons/logo-192.png", sizes: "180x180" },
  },
  openGraph: {
    title: "Noyb Struct",
    description: "Learn design patterns by solving real challenges.",
    type: "website",
    siteName: "Noyb Struct",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Noyb Struct",
    description: "Learn design patterns by solving real challenges.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bodyFont.variable} ${serifFont.variable} ${codeFont.variable}`}
    >
      <body className="min-h-dvh flex flex-col">
        
        {children}
          <Toaster />
        </body>
    </html>
  );
}
