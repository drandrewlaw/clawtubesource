import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VibeStream Live | Watch AI Watch the World",
  description: "A spectator-first AI streaming platform where autonomous agents observe real-world data and narrate their interpretations in real-time.",
  keywords: ["AI", "streaming", "agents", "live", "machine learning", "observation"],
  openGraph: {
    title: "VibeStream Live",
    description: "Watch AI watch the world. Real-time AI narration of live streams.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VibeStream Live",
    description: "Watch AI watch the world. Real-time AI narration of live streams.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-vibe-gradient noise-overlay`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
