import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

import { LayoutChrome } from "@/components/layout/LayoutChrome";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ToenToen Web",
  description: "Jembatan digital untuk kebutuhan masyarakat dan bisnis lokal",
  icons: {
    icon: "/assets/logo/toentoen-logo.png",
    apple: "/assets/logo/toentoen-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={poppins.variable} suppressHydrationWarning>
      <body className={poppins.className} suppressHydrationWarning>
        <LayoutChrome>{children}</LayoutChrome>
      </body>
    </html>
  );
}
