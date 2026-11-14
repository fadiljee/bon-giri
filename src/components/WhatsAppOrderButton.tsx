"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "@/context/CartContext";
import { saveOrderToHistory } from "@/lib/orderHistory";
import { formatRupiah } from "@/data/storefront";

export interface CartOrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface WhatsAppOrderButtonProps {
  productName?: string;
  productPrice?: number;
  items?: CartOrderItem[];
  totalPrice?: number;
  waNumber: string;
  variant?: "full" | "compact";
  disabled?: boolean;
}

export default function WhatsAppOrderButton({
  productName = "",
  productPrice = 0,
  items,
  totalPrice,
  waNumber,
  variant = "full",
  disabled = false,
}: WhatsAppOrderButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const [isSuccess, setIsSuccess] = useState(false);
  const [successRef, setSuccessRef] = useState<string | null>(null);
  const [successWaUrl, setSuccessWaUrl] = useState<string | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  let clearCart: (() => void) | undefined;
  try {
    const cart = useCart();
    clearCart = cart.clearCart;
  } catch {
    // optional fallback if rendered outside CartProvider
  }

  const grandTotal =
    items && items.length > 0
      ? (totalPrice ?? items.reduce((sum, i) => sum + i.price * i.quantity, 0))
      : productPrice;

  const handleClose = () => {
    if (isSuccess && clearCart) {
      clearCart();
    }
    setIsOpen(false);
    setIsSuccess(false);
    setSuccessRef(null);
    setSuccessWaUrl(null);
    setFormError(null);
  };

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    closeBtnRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  });

  const buildWaUrl = (orderRef?: string) => {
    const itemLines =
      items && items.length > 0
        ? items.map((i) => `- ${i.name} (${i.quantity}x) : ${formatRupiah(i.price * i.quantity)}`).join("\n")
        : `- ${productName} (1x) : ${formatRupiah(productPrice)}`;

    let text = `Halo Bon Giri, saya ingin memesan:\n\n`;
    if (orderRef) text += `Ref. Pesanan: ${orderRef}\n`;
    text += `Total Estimasi: ${formatRupiah(grandTotal)}\n\n`;
    text += `Rincian Pesanan:\n${itemLines}\n\n`;
    if (customerName.trim()) text += `Nama: ${customerName.trim()}\n`;
    if (customerPhone.trim()) text += `WhatsApp: ${customerPhone.trim()}\n`;
    if (customerAddress.trim()) text += `Alamat: ${customerAddress.trim()}\n`;

    return `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
  };

  const isNameValid = customerName.trim().length > 0;
  const isPhoneValid = customerPhone.trim().length >= 8;
  const isAddressValid = customerAddress.trim().length > 0;
  const canSubmit = isNameValid && isPhoneValid && isAddressValid;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isNameValid || !isPhoneValid || !isAddressValid) {
      setFormError("Mohon lengkapi nama, nomor WhatsApp (minimal 8 angka), dan alamat pengiriman.");
      return;
    }

    setFormError(null);

    const timestamp = Date.now().toString().slice(-6);
    const randomDigits = Math.floor(100 + Math.random() * 900);
    const orderRef = `BG-${timestamp}-${randomDigits}`;
    const waUrl = buildWaUrl(orderRef);

    saveOrderToHistory({
      invoiceNumber: orderRef,
      items: items && items.length > 0 ? items : [{ name: productName, price: productPrice, quantity: 1 }],
      totalAmount: grandTotal,
      paymentMethod: "WhatsApp",
      status: "PENDING",
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerAddress: customerAddress.trim(),
    });

    window.open(waUrl, "_blank", "noopener,noreferrer");

    setSuccessRef(orderRef);
    setSuccessWaUrl(waUrl);
    setIsSuccess(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        disabled={disabled}
        className={
          variant === "compact"
            ? "sf-btn-primary text-sm disabled:opacity-50"
            : "sf-btn-primary w-full disabled:opacity-50"
        }
      >
        Pesan via WhatsApp
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="wa-order-modal-title"
        >
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            aria-hidden="true"
            onClick={handleClose}
          />

          <div
            className="relative z-10 w-full sm:max-w-md p-6 space-y-5 max-h-[90dvh] overflow-y-auto"
            style={{
              backgroundColor: "var(--bg)",
              color: "var(--text-primary)",
              borderRadius: "var(--radius-card)",
              border: "1px solid var(--border-strong)",
              boxShadow: "var(--shadow-tinted)",
            }}
          >
            <div
              className="flex items-center justify-between pb-3"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <h2 id="wa-order-modal-title" className="text-base font-bold">
                {isSuccess ? "Pesanan Siap di WhatsApp" : "Data Pengiriman"}
              </h2>
              <button
                ref={closeBtnRef}
                type="button"
                onClick={handleClose}
                aria-label="Tutup formulir pemesanan"
                className="sf-icon-btn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {isSuccess ? (
              <div className="space-y-4">
                <div
                  className="p-4 space-y-2"
                  style={{
                    borderRadius: "var(--radius-card)",
                    backgroundColor: "var(--surface-elevated)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "var(--text-secondary)" }}>Ref. Pesanan</span>
                    <span className="font-mono font-bold">{successRef}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "var(--text-secondary)" }}>Total Pesanan</span>
                    <span className="font-mono font-bold">{formatRupiah(grandTotal)}</span>
                  </div>
                </div>

                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  Jika jendela WhatsApp belum terbuka otomatis, tekan tombol di bawah untuk mengirim pesanan ke admin Bon Giri.
                </p>

                {successWaUrl && (
                  <a
                    href={successWaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleClose}
                    className="sf-btn-primary w-full"
                  >
                    Buka WhatsApp
                  </a>
                )}

                <button type="button" onClick={handleClose} className="sf-btn-ghost w-full">
                  Tutup
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitOrder} className="space-y-4">
                <div
                  className="flex items-baseline justify-between p-3.5"
                  style={{
                    borderRadius: "var(--radius-card)",
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    Total Estimasi
                  </span>
                  <span className="order-price">{formatRupiah(grandTotal)}</span>
                </div>

                <div>
                  <label htmlFor="wa-order-name" className="block text-xs font-medium mb-1">
                    Nama Pemesan
                  </label>
                  <input
                    id="wa-order-name"
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Nama lengkap Anda"
                    className="w-full min-h-[44px] px-3 py-2.5 text-sm"
                    style={{
                      borderRadius: "var(--radius-card)",
                      backgroundColor: "var(--surface)",
                      border: "1px solid var(--border-strong)",
                      color: "var(--text-primary)",
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="wa-order-phone" className="block text-xs font-medium mb-1">
                    No. WhatsApp (Min. 8 angka)
                  </label>
                  <input
                    id="wa-order-phone"
                    type="tel"
                    inputMode="numeric"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="08xxxxxxxxxx"
                    className="w-full min-h-[44px] px-3 py-2.5 text-sm font-mono"
                    style={{
                      borderRadius: "var(--radius-card)",
                      backgroundColor: "var(--surface)",
                      border: "1px solid var(--border-strong)",
                      color: "var(--text-primary)",
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="wa-order-address" className="block text-xs font-medium mb-1">
                    Alamat Pengiriman
                  </label>
                  <textarea
                    id="wa-order-address"
                    rows={3}
                    required
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    placeholder="Jalan, nomor rumah, kecamatan, kota"
                    className="w-full px-3 py-2.5 text-sm"
                    style={{
                      borderRadius: "var(--radius-card)",
                      backgroundColor: "var(--surface)",
                      border: "1px solid var(--border-strong)",
                      color: "var(--text-primary)",
                    }}
                  />
                </div>

                {formError && (
                  <p role="alert" className="text-xs font-medium" style={{ color: "#b84b39" }}>
                    {formError}
                  </p>
                )}

                <div className="space-y-2 pt-1">
                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className="sf-btn-primary w-full disabled:opacity-50"
                  >
                    Kirim Pesanan ke WhatsApp
                  </button>
                  <a
                    href={buildWaUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sf-btn-ghost w-full text-center"
                  >
                    Chat Langsung Tanpa Isi Form
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
