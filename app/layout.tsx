import type { Metadata } from "next";
import { ClerkProvider,  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton, } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";
<link rel="icon" href="/favicon.ico" sizes="any" />


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "The Wall",
  description: "A Birthday post wall, Birthday Wishes Social post, birthday posts",
};

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

   if (!publishableKey) {
    throw new Error('Missing Clerk publishableKey');
  }
  return (
    <ClerkProvider>
    <html lang="en">
      <header className="flex justify-end items-center p-4 gap-4 h-16">
              <SignedOut>
                <SignInButton>
                  
                </SignInButton>
                <SignUpButton>
                  
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </header>
      <body className={inter.className}>{children}</body>
    </html>
    </ClerkProvider>
  );
}
