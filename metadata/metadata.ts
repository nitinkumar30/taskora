import { Metadata } from "next";

export const baseMetadata: Metadata = {
  metadataBase: new URL("https://taskora-mgr.vercel.app"),
  title: {
    default: "Taskora — Premium Task Management",
    template: "%s | Taskora",
  },
  description:
    "Taskora is a stunning, premium-quality animated task management application that feels like a modern SaaS product. Manage tasks, projects, and folders with a beautiful glassmorphism UI.",
  keywords: [
    "taskora",
    "task management",
    "productivity",
    "project management",
    "kanban",
    "calendar",
    "analytics",
    "next.js",
  ],
  authors: [{ name: "Nitin Kumar", url: "https://www.linkedin.com/in/nitin30kumar/" }],
  creator: "Nitin Kumar",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://taskora-mgr.vercel.app",
    siteName: "Taskora",
    title: "Taskora — Premium Task Management",
    description:
      "A stunning, premium-quality animated task management application with Kanban, calendar, timeline, and analytics.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Taskora",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Taskora — Premium Task Management",
    description:
      "A stunning, premium-quality animated task management application.",
    images: ["/og-image.svg"],
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
