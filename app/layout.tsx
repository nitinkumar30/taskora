import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL("https://todo-app.vercel.app"),
  title: {
    default: "Todo App — Premium Task Management",
    template: "%s | Todo App",
  },
  description: "A beautiful, premium-quality animated ToDo Management application.",
  keywords: ["todo", "task management", "productivity", "project management", "kanban", "calendar"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://todo-app.vercel.app",
    siteName: "Todo App",
    title: "Todo App — Premium Task Management",
    description: "A beautiful, premium-quality animated ToDo Management application.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Todo App" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Todo App — Premium Task Management",
    description: "A beautiful, premium-quality animated ToDo Management application.",
    images: ["/og-image.png"],
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
