import { Metadata } from "next";

export const baseMetadata: Metadata = {
  metadataBase: new URL("https://todo-app.vercel.app"),
  title: {
    default: "Todo App — Premium Task Management",
    template: "%s | Todo App",
  },
  description:
    "A beautiful, premium-quality animated ToDo Management application that feels like a modern SaaS product. Manage tasks, projects, and folders with style.",
  keywords: [
    "todo",
    "task management",
    "productivity",
    "project management",
    "kanban",
    "calendar",
    "next.js",
  ],
  authors: [{ name: "Todo App" }],
  creator: "Todo App",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://todo-app.vercel.app",
    siteName: "Todo App",
    title: "Todo App — Premium Task Management",
    description:
      "A beautiful, premium-quality animated ToDo Management application.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Todo App",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Todo App — Premium Task Management",
    description:
      "A beautiful, premium-quality animated ToDo Management application.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};
