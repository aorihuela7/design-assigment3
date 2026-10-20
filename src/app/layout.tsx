import type { Metadata } from "next";
import { B612, B612_Mono, Barlow_Condensed } from "next/font/google";
import "./globals.css";

// Self-hosted by next/font: downloaded at build time, served from this app.
const b612 = B612({
  variable: "--font-b612",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const b612Mono = B612_Mono({
  variable: "--font-b612-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  weight: "600",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pack Again",
  description: "Packing lists for trips you repeat.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${b612.variable} ${b612Mono.variable} ${barlowCondensed.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
