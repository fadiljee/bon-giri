export interface StorefrontVariant {
  id: string;
  slug: string;
  shortName: string;
  fullName: string;
  description: string;
  price: number;
  spiceLevel: string;
  categoryName: string;
  image: string;
  swatchColor: string;
  isAvailable: boolean;
}

export interface PackageOption {
  id: string;
  label: string;
  weightLabel: string;
  multiplier: number;
  previewScale: number;
}

export interface BusinessInfo {
  whatsappNumber: string;
  address: string;
  openingHours: string;
  instagramHandle: string;
}

export const DEFAULT_BUSINESS_INFO: BusinessInfo = {
  whatsappNumber: "6288267018426",
  address: "Pangkalpinang, Kepulauan Bangka Belitung",
  openingHours: "Senin - Sabtu: 08.00 - 17.00 WIB",
  instagramHandle: "stikkeju.bongiri_",
};

export const FALLBACK_VARIANTS: StorefrontVariant[] = [
  {
    id: "stik-keju-tenggiri-original-100g",
    slug: "stik-keju-tenggiri-original-100g",
    shortName: "Original",
    fullName: "Stik Keju Ikan Tenggiri Original 100g",
    description:
      "Stik keju gurih renyah berbahan dasar keju premium dan kalsium tinggi tulang ikan tenggiri khas Bangka Belitung.",
    price: 10000,
    spiceLevel: "Original",
    categoryName: "Varian Original",
    image: "/images/products/original.webp",
    swatchColor: "#d4b46a",
    isAvailable: true,
  },
  {
    id: "stik-keju-tenggiri-pedas-balado-100g",
    slug: "stik-keju-tenggiri-pedas-balado-100g",
    shortName: "Pedas Balado",
    fullName: "Stik Keju Ikan Tenggiri Pedas Balado 100g",
    description:
      "Sensasi renyah gurih keju ikan tenggiri berpadu dengan bumbu pedas balado khas yang kaya rempah.",
    price: 10000,
    spiceLevel: "Pedas Sedang",
    categoryName: "Varian Pedas",
    image: "/images/products/balado.webp",
    swatchColor: "#b84b39",
    isAvailable: true,
  },
  {
    id: "stik-keju-tenggiri-rasa-bbq-100g",
    slug: "stik-keju-tenggiri-rasa-bbq-100g",
    shortName: "Rasa BBQ",
    fullName: "Stik Keju Ikan Tenggiri Rasa BBQ 100g",
    description:
      "Aroma asap smokey barbeque khas yang dipadukan dengan keju melimpah dan kerenyahan kalsium ikan tenggiri.",
    price: 10000,
    spiceLevel: "Original",
    categoryName: "Varian Original",
    image: "/images/products/bbq.webp",
    swatchColor: "#7c4a32",
    isAvailable: true,
  },
  {
    id: "stik-keju-tenggiri-rumput-laut-100g",
    slug: "stik-keju-tenggiri-rumput-laut-100g",
    shortName: "Rumput Laut",
    fullName: "Stik Keju Ikan Tenggiri Rumput Laut 100g",
    description:
      "Sensasi umami gurih rumput laut pilihan yang membalur stik keju renyah tinggi nutrisi kalsium.",
    price: 10000,
    spiceLevel: "Original",
    categoryName: "Spesial Aroma",
    image: "/images/products/rumput-laut.webp",
    swatchColor: "#3d5740",
    isAvailable: true,
  },
];

export const PACKAGE_OPTIONS: PackageOption[] = [
  {
    id: "pack-1",
    label: "1 Bungkus",
    weightLabel: "100 g",
    multiplier: 1,
    previewScale: 0.94,
  },
  {
    id: "pack-3",
    label: "Paket 3 Bungkus",
    weightLabel: "300 g",
    multiplier: 3,
    previewScale: 1.0,
  },
  {
    id: "pack-5",
    label: "Paket 5 Bungkus",
    weightLabel: "500 g",
    multiplier: 5,
    previewScale: 1.06,
  },
];

export const SHOWCASE_STAGES = [
  {
    id: "stage-original",
    label: "Original",
    title: "Keju Premium dan Tulang Tenggiri.",
    subtitle:
      "Tepung tulang ikan tenggiri Bangka Belitung diolah higienis menjadi stik keju renyah tanpa bau amis.",
    image: "/images/products/original.webp",
    alt: "Stik Keju Ikan Tenggiri Original 100g Bon Giri",
  },
  {
    id: "stage-balado",
    label: "Balado",
    title: "Pedas Balado Kaya Rempah.",
    subtitle:
      "Balutan bumbu balado pedas sedang di atas dasar stik keju gurih untuk penyuka rasa tegas.",
    image: "/images/products/balado.webp",
    alt: "Stik Keju Ikan Tenggiri Pedas Balado 100g Bon Giri",
  },
  {
    id: "stage-bbq",
    label: "BBQ",
    title: "Aroma Asap Barbeque.",
    subtitle:
      "Perpaduan smokey barbeque dan keju gurih dalam kemasan rapat yang menjaga kerenyahan.",
    image: "/images/products/bbq.webp",
    alt: "Stik Keju Ikan Tenggiri Rasa BBQ 100g Bon Giri",
  },
  {
    id: "stage-nori",
    label: "Rumput Laut",
    title: "Gurih Umami Rumput Laut.",
    subtitle:
      "Taburan rumput laut pilihan yang menyatu dengan kalsium alami tulang ikan tenggiri.",
    image: "/images/products/rumput-laut.webp",
    alt: "Stik Keju Ikan Tenggiri Rumput Laut 100g Bon Giri",
  },
];

export const QUALITY_POINTS = [
  "Bahan baku ikan tenggiri segar pilihan dari Bangka Belitung",
  "Proses produksi higienis dan terstandar",
  "Bebas pengawet berbahaya",
  "Kemasan rapat menjaga kerenyahan",
  "Kaya kalsium alami dari tepung tulang tenggiri",
  "Binaan Kelompok Laboratorium Kewirausahaan (KLK) Universitas Bangka Belitung",
];

export function formatRupiah(amount: number): string {
  return `Rp${amount.toLocaleString("id-ID")}`;
}
