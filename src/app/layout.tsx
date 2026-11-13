import type { Metadata } from "next";
import Script from "next/script";
import { DM_Sans, DM_Mono, Plus_Jakarta_Sans, Fraunces } from "next/font/google";
import Providers from "@/components/Providers";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: "400",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bon Giri: Stik Keju Tulang Ikan Tenggiri",
  description:
    "Camilan stik keju gurih renyah berbahan dasar keju dan tepung tulang ikan tenggiri kaya kalsium khas Pangkalpinang, Bangka Belitung.",
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
    title: "Bon Giri: Stik Keju Tulang Ikan Tenggiri",
    description:
      "Camilan stik keju gurih renyah berbahan dasar keju dan tepung tulang ikan tenggiri khas Bangka Belitung.",
    images: [{ url: "/images/logo.png" }],
    type: "website",
  },
};

const themeInitScript = `
(function() {
  try {
    var saved = localStorage.getItem('bongiri-theme');
    var theme = saved === 'dark' || saved === 'light' ? saved : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    var meta = document.querySelector('meta[name="color-scheme"]');
    if (meta) meta.setAttribute('content', theme);
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      data-theme="light"
      suppressHydrationWarning
      className={`${dmSans.variable} ${dmMono.variable} ${plusJakartaSans.variable} ${fraunces.variable} h-full antialiased`}
    >
      <head>
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className="min-h-full flex flex-col">
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <Providers>
          <SmoothScroll>{children}</SmoothScroll>
        </Providers>
      </body>
    </html>
  );
}
