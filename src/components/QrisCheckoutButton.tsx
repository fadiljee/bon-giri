"use client";

import { useState } from "react";
import Image from "next/image";
import { MessageSquare, X } from "lucide-react";

interface QrisCheckoutButtonProps {
  productName: string;
  productPrice: number;
  waNumber: string;
  variant?: "full" | "compact";
  disabled?: boolean;
}

export default function QrisCheckoutButton({
  productName,
  productPrice,
  waNumber,
  variant = "full",
  disabled = false,
}: QrisCheckoutButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const waMessage = encodeURIComponent(
    `Halo Bon Giri, saya ingin memesan ${productName}. Total Rp${productPrice.toLocaleString("id-ID")}. Saya sudah melakukan pembayaran via QRIS, berikut bukti pembayarannya: [Mohon lampirkan bukti/foto transfer Anda di sini].`
  );

  const waUrl = `https://wa.me/${waNumber}?text=${waMessage}`;

  return (
    <>
      {/* Trigger Button */}
      {variant === "full" ? (
        <button
          onClick={() => setIsOpen(true)}
          disabled={disabled}
          className={`wa-btn w-full text-[15px] py-3.5 justify-center shadow-md hover:shadow-lg ${
            disabled ? "bg-[var(--color-muted)]/30 text-[var(--color-muted)] cursor-not-allowed hover:transform-none hover:shadow-none" : ""
          }`}
        >
          <MessageSquare className={`w-5 h-5 ${disabled ? "stroke-[var(--color-muted)]" : "fill-[var(--color-charcoal)]"}`} />
          {disabled ? "Stok Sedang Habis" : "Pesan Sekarang via WhatsApp"}
        </button>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          disabled={disabled}
          className={`wa-btn py-2 px-3 text-[12px] font-bold ${
            disabled ? "bg-[var(--color-muted)]/30 text-[var(--color-muted)] cursor-not-allowed hover:transform-none hover:shadow-none" : ""
          }`}
        >
          {disabled ? null : <MessageSquare className="w-3.5 h-3.5 fill-[var(--color-charcoal)]" />}
          {disabled ? "Habis" : "Pesan"}
        </button>
      )}

      {/* Overlay & Bottom Sheet Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center p-0 sm:p-4 transition-opacity">
          <div 
            className="w-full sm:max-w-md bg-[var(--color-white)] rounded-t-[20px] sm:rounded-[20px] overflow-hidden flex flex-col max-h-[90vh] shadow-2xl relative animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-250"
          >
            {/* Drag Handle (Mobile) & Header */}
            <div className="relative pt-3 pb-4 px-5 border-b border-[var(--color-muted)]/30">
              <div className="w-10 h-1.5 bg-[var(--color-muted)]/50 rounded-full mx-auto mb-4 sm:hidden"></div>
              <h3 className="text-[18px] font-bold text-[var(--color-charcoal)] text-center font-display">
                Pembayaran via QRIS
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 sm:top-5 right-4 p-1.5 text-[var(--color-charcoal-soft)] hover:text-[var(--color-charcoal)] hover:bg-[var(--color-cream-soft)] rounded-full transition-colors"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto p-5 space-y-5">
              {/* Order Summary */}
              <div className="bg-[var(--color-cream-soft)] border border-[var(--color-gold)]/40 rounded-[12px] p-4">
                <p className="text-[12px] font-bold text-[var(--color-charcoal-soft)] mb-1 uppercase tracking-wide">Ringkasan Pesanan</p>
                <div className="flex justify-between items-start gap-3">
                  <p className="text-[15px] font-bold text-[var(--color-charcoal)] leading-tight">
                    {productName} × 1
                  </p>
                  <p className="text-[16px] font-bold text-[var(--color-gold-dark)] whitespace-nowrap">
                    Rp {productPrice.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>

              {/* QRIS Image */}
              <div className="flex justify-center bg-[var(--color-white)] border border-[var(--color-muted)]/30 rounded-[12px] p-3 shadow-sm">
                <div className="relative w-full max-w-[240px] aspect-square">
                  <Image
                    src="/images/qris-placeholder.svg"
                    alt="QRIS DANA Bisnis"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              <p className="text-center text-[12px] font-bold text-[var(--color-muted)] mt-[-8px]">
                (Tap dan tahan gambar untuk simpan)
              </p>

              {/* Instructions */}
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-[var(--color-charcoal)] text-[var(--color-white)] flex items-center justify-center text-[12px] font-bold shrink-0">1</div>
                  <p className="text-[14px] text-[var(--color-charcoal)] leading-snug pt-0.5">
                    Scan QRIS di atas dan bayar sesuai nominal total.
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-[var(--color-charcoal)] text-[var(--color-white)] flex items-center justify-center text-[12px] font-bold shrink-0">2</div>
                  <p className="text-[14px] text-[var(--color-charcoal)] leading-snug pt-0.5">
                    Setelah berhasil, simpan/screenshot bukti transfer.
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-[var(--color-charcoal)] text-[var(--color-white)] flex items-center justify-center text-[12px] font-bold shrink-0">3</div>
                  <p className="text-[14px] text-[var(--color-charcoal)] leading-snug pt-0.5">
                    Klik tombol di bawah untuk mengirim bukti transfer via WhatsApp.
                  </p>
                </div>
              </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="p-5 pt-3 border-t border-[var(--color-muted)]/30 bg-[var(--color-white)]">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="btn-primary w-full py-3.5 bg-[var(--color-gold)] hover:bg-[var(--color-gold-dark)] text-[var(--color-charcoal)] shadow-md hover:shadow-lg transition-all"
              >
                Sudah Bayar, Kirim Bukti ke WA
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
