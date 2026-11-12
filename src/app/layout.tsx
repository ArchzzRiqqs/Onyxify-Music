import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@/lib/env";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/components/shared/query-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-onyxify",
});

export const metadata: Metadata = {
  title: "Onyxify",
  description: "Streaming musik berlisensi dengan pengalaman audio modern.",
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
