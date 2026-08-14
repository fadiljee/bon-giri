import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Fraunces } from "next/font/google";
import Providers from "@/components/Providers";
import SmoothScroll from "@/components/SmoothScroll";
import GsapAnimations from "@/components/GsapAnimations";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bon Giri",
  description:
    "Camilan gurih renyah stik keju asli berbahan dasar tulang ikan tenggiri kaya kalsium dari Bangka Belitung. Pesan langsung via WhatsApp!",
  icons: {
    icon: [
      { url: "/images/logo.png" },
      { url: "/images/logo.png", type: "image/png" },
    ],
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
  keywords: [
    "Bon Giri",
    "Stik Keju Ikan Tenggiri",
    "Oleh-oleh Bangka Belitung",
    "Camilan Tulang Ikan Tenggiri",
    "Stik Keju Gurih",
  ],
  authors: [{ name: "Bon Giri Team" }],
  openGraph: {
    title: "Bon Giri — Stik Keju Tulang Ikan Tenggiri",
    description:
      "Camilan gurih renyah stik keju asli berbahan dasar tulang ikan tenggiri khas Bangka Belitung.",
    images: [{ url: "/images/logo.png" }],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${plusJakartaSans.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FFFDD0] text-[#1A1A1A]">
        <Providers>
          <SmoothScroll>
            <GsapAnimations />
            {children}
          </SmoothScroll>
        </Providers>
      </body>
    </html>
  );
}
