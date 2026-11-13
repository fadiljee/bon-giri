"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { BusinessInfo, StorefrontVariant, formatRupiah } from "@/data/storefront";
import SubpageShell from "./SubpageShell";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
}

interface KatalogClientProps {
  variants: StorefrontVariant[];
  categories: CategoryItem[];
  business: BusinessInfo;
  initialCategory?: string;
  initialQuery?: string;
}

export default function KatalogClient({
  variants,
  categories,
  business,
  initialCategory = "",
  initialQuery = "",
}: KatalogClientProps) {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [bagOpen, setBagOpen] = useState(false);

  const filteredVariants = useMemo(() => {
    return variants.filter((item) => {
      const matchesCat =
        !selectedCategory ||
        item.categoryName.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        item.slug.toLowerCase().includes(selectedCategory.toLowerCase());
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        item.fullName.toLowerCase().includes(q) ||
        item.shortName.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [variants, selectedCategory, searchQuery]);

  const handleQuickAdd = (variant: StorefrontVariant) => {
    addToCart(
      {
        id: `${variant.id}__pack-1`,
        name: `${variant.shortName} (1 Bungkus · 100 g)`,
        slug: variant.slug,
        price: variant.price,
        image: variant.image,
        categoryName: variant.categoryName,
      },
      1
    );
    setBagOpen(true);
  };

  return (
    <SubpageShell
      business={business}
      externalBagOpen={bagOpen}
      onExternalBagClose={() => setBagOpen(false)}
    >
      <div className="sf-container space-y-10">
        {/* Page Header */}
        <div data-reveal className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <h1 className="section-title" style={{ color: "var(--text-primary)" }}>
              Katalog Varian.
            </h1>
            <p className="text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Seluruh varian Stik Keju Ikan Tenggiri Bon Giri kemasan 100 g. Pilih rasa, lihat detail komposisi, atau tambahkan langsung ke tas belanja.
            </p>
          </div>

          <div className="w-full md:w-80">
            <label htmlFor="katalog-search" className="sr-only">
              Cari varian stik keju
            </label>
            <input
              id="katalog-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari varian rasa..."
              className="w-full px-4 py-3 text-sm"
              style={{
                borderRadius: "var(--radius-card)",
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border-strong)",
                color: "var(--text-primary)",
              }}
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div
          role="tablist"
          aria-label="Filter kategori produk"
          className="flex flex-wrap items-center gap-2"
        >
          <button
            type="button"
            role="tab"
            aria-selected={selectedCategory === ""}
            onClick={() => setSelectedCategory("")}
            className="pill-option min-h-[44px] px-4 text-sm font-medium transition-colors"
            style={{
              borderRadius: "var(--radius-pill)",
              backgroundColor: selectedCategory === "" ? "var(--accent)" : "var(--surface)",
              border: `1px solid ${selectedCategory === "" ? "var(--accent)" : "var(--border)"}`,
              color: selectedCategory === "" ? "var(--accent-text)" : "var(--text-primary)",
            }}
          >
            Semua Varian
          </button>

          {categories.map((cat) => {
            const active = selectedCategory === cat.name || selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedCategory(cat.name)}
                className="pill-option min-h-[44px] px-4 text-sm font-medium transition-colors"
                style={{
                  borderRadius: "var(--radius-pill)",
                  backgroundColor: active ? "var(--accent)" : "var(--surface)",
                  border: `1px solid ${active ? "var(--accent)" : "var(--border)"}`,
                  color: active ? "var(--accent-text)" : "var(--text-primary)",
                }}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Product Grid */}
        {filteredVariants.length === 0 ? (
          <div
            className="p-10 space-y-4"
            style={{
              borderRadius: "var(--radius-card)",
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            <p className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
              Varian tidak ditemukan.
            </p>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Tidak ada produk yang cocok dengan kata kunci atau kategori yang dipilih.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("");
                setSearchQuery("");
              }}
              className="sf-btn-ghost"
            >
              Tampilkan Semua Varian
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredVariants.map((variant) => (
              <article
                key={variant.id}
                data-reveal
                className="flex flex-col justify-between p-5 gap-5"
                style={{
                  borderRadius: "var(--radius-card)",
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                }}
              >
                <div className="space-y-4">
                  <Link
                    href={`/katalog/${variant.slug}`}
                    className="block relative aspect-[4/5] w-full overflow-hidden"
                    style={{
                      borderRadius: "var(--radius-card)",
                      backgroundColor: "var(--surface-elevated)",
                    }}
                  >
                    <Image
                      src={variant.image}
                      alt={variant.fullName}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-contain p-4 transition-transform duration-300 hover:scale-105"
                    />
                  </Link>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2 text-xs font-mono" style={{ color: "var(--text-secondary)" }}>
                      <span>{variant.spiceLevel}</span>
                      <span>100 g</span>
                    </div>

                    <Link
                      href={`/katalog/${variant.slug}`}
                      className="block text-base font-bold leading-snug hover:underline"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {variant.fullName}
                    </Link>

                    <p className="text-sm line-clamp-2 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {variant.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
                  <div className="flex items-baseline justify-between">
                    <span className="order-price text-xl" style={{ color: "var(--text-primary)" }}>
                      {formatRupiah(variant.price)}
                    </span>
                    <span className="text-xs font-mono" style={{ color: "var(--text-secondary)" }}>
                      {variant.isAvailable ? "Tersedia" : "Habis"}
                    </span>
                  </div>

                  <button
                    type="button"
                    disabled={!variant.isAvailable}
                    onClick={() => handleQuickAdd(variant)}
                    className="sf-btn-primary w-full disabled:opacity-50"
                  >
                    {variant.isAvailable ? "Tambah ke Tas" : "Stok Habis"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </SubpageShell>
  );
}
