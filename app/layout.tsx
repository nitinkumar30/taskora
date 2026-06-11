import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL("https://taskora.vercel.app"),
  title: {
    default: "Taskora — Premium Task Management",
    template: "%s | Taskora",
  },
  description: "Taskora is a stunning, premium-quality animated task management application. Manage tasks, projects, and folders with a beautiful glassmorphism UI.",
  keywords: ["taskora", "task management", "productivity", "project management", "kanban", "calendar", "todo app"],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://taskora.vercel.app",
    siteName: "Taskora",
    title: "Taskora — Premium Task Management",
    description: "A beautiful, premium-quality animated task management application with Kanban, calendar, timeline, and analytics.",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "Taskora" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Taskora — Premium Task Management",
    description: "A beautiful, premium-quality animated task management application.",
    images: ["/og-image.svg"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
