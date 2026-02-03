import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Mono, Syne } from "next/font/google";
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

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "600", "800"],
});

export const metadata: Metadata = {
  title: "eyecu.ai | The Retina Layer for AI Agents",
  description: "Give your AI agent real-time vision of any stream, anywhere. The retina layer for AI agents - because silicon needs sight.",
  keywords: ["AI", "vision", "agents", "live streams", "machine learning", "video API", "MCP"],
  openGraph: {
    title: "eyecu.ai - The Retina for AI Agents",
    description: "AI can't watch. You can fix that. Real-time vision for autonomous agents.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "eyecu.ai - The Retina for AI Agents",
    description: "AI can't watch. You can fix that. Real-time vision for autonomous agents.",
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
        className={`${geistSans.variable} ${geistMono.variable} ${spaceMono.variable} ${syne.variable} antialiased bg-vibe-gradient noise-overlay`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
