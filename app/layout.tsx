import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
<link rel="icon" href="/favicon.ico" sizes="any" />


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Precious Ajibola",
  description: "Happy Birthday Precious, A Birthday post wall, Birthday Wishes Social post, birthday posts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
