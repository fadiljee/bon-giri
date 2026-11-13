"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import {
  BusinessInfo,
  PACKAGE_OPTIONS,
  StorefrontVariant,
  formatRupiah,
} from "@/data/storefront";
import SubpageShell from "./SubpageShell";

interface ProductDetailClientProps {
  variant: StorefrontVariant;
  business: BusinessInfo;
}

export default function ProductDetailClient({
  variant,
  business,
}: ProductDetailClientProps) {
  const { addToCart } = useCart();
  const [activePkgIdx, setActivePkgIdx] = useState(0);
  const [bagOpen, setBagOpen] = useState(false);

  const activePkg = PACKAGE_OPTIONS[activePkgIdx] || PACKAGE_OPTIONS[0];
  const configuredPrice = variant.price * activePkg.multiplier;

  const handleAdd = () => {
    addToCart(
      {
        id: `${variant.id}__${activePkg.id}`,
        name: `${variant.shortName} (${activePkg.label} · ${activePkg.weightLabel})`,
        slug: variant.slug,
        price: configuredPrice,
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
      <div className="sf-container space-y-8">
        <div data-reveal>
          <Link
            href="/katalog"
            className="sf-footer-pill"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>Kembali ke Katalog</span>
          </Link>
        </div>

        <div className="order-grid">
          {/* Preview Panel */}
          <div data-reveal className="order-preview relative overflow-hidden flex items-center justify-center p-8">
            <div
              className="relative w-full h-full transition-transform duration-300"
              style={{
                transform: `scale(${activePkg.previewScale})`,
                transitionTimingFunction: "var(--ease-out)",
              }}
            >
              <Image
                src={variant.image}
                alt={variant.fullName}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 48vw"
                className="object-contain"
              />
            </div>
          </div>

          {/* Info & Configurator */}
          <div data-reveal className="space-y-7">
            <div className="space-y-2">
              <p className="text-xs font-mono uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>
                {variant.categoryName} · {variant.isAvailable ? "Stok Tersedia" : "Stok Habis"}
              </p>
              <h1 className="section-title" style={{ color: "var(--text-primary)" }}>
                {variant.fullName}
              </h1>
              <p className="text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {variant.description}
              </p>
            </div>

            <div className="space-y-2.5">
              <span className="block text-xs font-mono uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>
                Pilih Paket Kemasan
              </span>
              <div role="radiogroup" aria-label="Pilih paket kemasan" className="flex flex-wrap gap-2">
                {PACKAGE_OPTIONS.map((pkg, idx) => {
                  const selected = idx === activePkgIdx;
                  return (
                    <button
                      key={pkg.id}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setActivePkgIdx(idx)}
                      className="pill-option min-h-[44px] px-4 text-sm font-medium transition-colors"
                      style={{
                        borderRadius: "var(--radius-pill)",
                        backgroundColor: selected ? "var(--surface-elevated)" : "transparent",
                        border: `1px solid ${selected ? "var(--border-strong)" : "var(--border)"}`,
                        color: "var(--text-primary)",
                      }}
                    >
                      {pkg.label} ({pkg.weightLabel})
                    </button>
                  );
                })}
              </div>
            </div>

            <dl style={{ borderTop: "1px solid var(--border)" }}>
              {[
                { label: "Berat Bersih", value: activePkg.weightLabel },
                { label: "Karakter Rasa", value: variant.spiceLevel },
                { label: "Asal Produksi", value: business.address },
              ].map((spec) => (
                <div
                  key={spec.label}
                  className="flex items-center justify-between py-3 text-sm"
                  style={{ borderBottom: "1px solid var(--border)" }}
                >
                  <dt style={{ color: "var(--text-secondary)" }}>{spec.label}</dt>
                  <dd className="font-mono font-medium" style={{ color: "var(--text-primary)" }}>
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div>
                <span className="block text-xs font-mono uppercase" style={{ color: "var(--text-secondary)" }}>
                  Total Harga
                </span>
                <span className="order-price" style={{ color: "var(--text-primary)" }}>
                  {formatRupiah(configuredPrice)}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  disabled={!variant.isAvailable}
                  onClick={handleAdd}
                  className="sf-btn-primary disabled:opacity-50"
                >
                  {variant.isAvailable ? "Tambah ke Tas" : "Stok Habis"}
                </button>
                <Link href="/#order" className="sf-btn-ghost">
                  Etalase Utama
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SubpageShell>
  );
}
