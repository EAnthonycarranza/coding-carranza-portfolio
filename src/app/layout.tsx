import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AccessibilityMenu from "@/components/AccessibilityMenu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.codingcarranza.com"),
  title: {
    default: "Coding Carranza | Premium Web Development for Small Businesses",
    template: "%s | Coding Carranza"
  },
  description: "Anthony Carranza builds high-performance Next.js websites and MERN applications for small businesses. Specializing in SEO-optimized, conversion-focused web experiences.",
  keywords: ["Web Development", "Next.js", "Small Business Website", "Anthony Carranza", "Full Stack Developer", "MERN Stack", "SEO Optimization"],
  authors: [{ name: "Anthony Carranza" }],
  creator: "Anthony Carranza",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.codingcarranza.com",
    title: "Coding Carranza | Premium Web Development",
    description: "Custom web solutions that drive growth for small businesses. High-performance, SEO-optimized, and built to convert.",
    siteName: "Coding Carranza",
    images: [
      {
        url: "/images/anthony.png",
        width: 1200,
        height: 630,
        alt: "Coding Carranza Portfolio"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Coding Carranza | Premium Web Development",
    description: "Anthony Carranza builds high-performance Next.js websites for small businesses.",
    images: ["/images/anthony.png"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <AccessibilityMenu />
      </body>
    </html>
  );
}
