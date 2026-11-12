import type { Metadata } from "next";
import "./globals.css";
import "@/lib/env";

export const metadata: Metadata = {
  title: "Onyxify",
  description: "Streaming musik berlisensi dengan pengalaman audio modern.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="bg-background text-foreground min-h-full font-sans">
        {children}
      </body>
    </html>
  );
}
