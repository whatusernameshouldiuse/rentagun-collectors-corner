import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Collector's Corner | Rentagun",
  description:
    "Rent rare and discontinued firearms. Colt Python, IMI UZI, HK P7M8 and more. Shipped to your FFL for 7–30 days. Free return shipping.",
  openGraph: {
    title: "Collector's Corner | Rentagun",
    description:
      "Shoot the guns you've only heard about. Rent rare firearms shipped to your FFL.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${bebasNeue.variable} ${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
