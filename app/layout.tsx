import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  // ── Basic SEO ──
  title: {
    default: "BirthdaySpace — Celebrate Everyone You Love",
    template: "%s | BirthdaySpace",
  },
  description:
    "BirthdaySpace is a birthday social wall where you can post wishes, share memories, and celebrate birthdays with the people you love.",
  keywords: [
    "birthday wishes",
    "birthday social media",
    "birthday wall",
    "celebrate birthdays",
    "birthday posts",
    "birthday reminders",
  ],

  // ── Open Graph (Facebook, WhatsApp, Discord, LinkedIn) ──
  openGraph: {
    type: "website",
    url: "https://the-birthday-wall.netlify.app/", // 🔁 replace with your real URL
    siteName: "BirthdaySpace",
    title: "BirthdaySpace — Celebrate Everyone You Love 🎂",
    description:
      "A birthday social wall to post wishes, share memories, and celebrate the people you love.",
    images: [
      {
        url: "https://your-site-url.com/og-image.png", // 🔁 add a 1200x630 image in /public
        width: 1200,
        height: 630,
        alt: "BirthdaySpace — Birthday Social Wall",
      },
    ],
  },

  // ── Twitter / X Card ──
  twitter: {
    card: "summary_large_image",
    site: "@yourhandle", // 🔁 replace or remove if no Twitter
    title: "BirthdaySpace — Celebrate Everyone You Love 🎂",
    description:
      "A birthday social wall to post wishes, share memories, and celebrate the people you love.",
    images: ["https://your-site-url.com/og-image.png"], // 🔁 same image as OG
  },

  // ── Favicon ──
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png", // optional: add a 180x180 png to /public
  },

  // ── Canonical URL ──
  metadataBase: new URL("https://the-birthday-wall.netlify.app/"), // 🔁 replace with your real URL
};

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (!publishableKey) {
    throw new Error("Missing Clerk publishableKey");
  }

  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}