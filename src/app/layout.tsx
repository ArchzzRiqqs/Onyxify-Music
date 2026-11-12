import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { env } from "@/lib/env";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/components/shared/query-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-onyxify",
});

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: {
    default: "Onyxify — Streaming Musik Berlisensi",
    template: "%s | Onyxify",
  },
  description: "Streaming musik berlisensi dengan pengalaman audio modern.",
  applicationName: "Onyxify",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Onyxify",
    title: "Onyxify — Streaming Musik Berlisensi",
    description: "Temukan dan dengarkan musik berlisensi di Onyxify.",
  },
  twitter: {
    card: "summary",
    title: "Onyxify — Streaming Musik Berlisensi",
    description: "Temukan dan dengarkan musik berlisensi di Onyxify.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`}>
      <body className="bg-background text-foreground min-h-full font-sans">
        <TooltipProvider>
          <QueryProvider>
            {children}
            <Toaster />
          </QueryProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
