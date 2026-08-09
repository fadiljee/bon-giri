import type { Metadata } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import Providers from "@/components/Providers";
import SmoothScroll from "@/components/SmoothScroll";
import GsapAnimations from "@/components/GsapAnimations";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700", "800"],
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
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
      className={`${montserrat.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-neutral-900">
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
