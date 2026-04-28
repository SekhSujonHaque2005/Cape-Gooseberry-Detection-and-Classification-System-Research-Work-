import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Gooseberry AI — Precision Phenotyping",
  description:
    "A refined AI system for agricultural monitoring. Elevating the study of Physalis peruviana through advanced neural vision.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Gooseberry AI",
  },
};

export const viewport: Viewport = {
  themeColor: "#FDFCF8",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className={`font-serif antialiased bg-editorial-cream text-editorial-charcoal min-h-screen flex flex-col selection:bg-editorial-gold selection:text-white`}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
