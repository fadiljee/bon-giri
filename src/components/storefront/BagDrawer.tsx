"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { formatRupiah } from "@/data/storefront";
import { saveOrderToHistory } from "@/lib/orderHistory";

interface BagDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  waNumber: string;
  onExploreOrder: () => void;
}

type DrawerStep = "bag" | "order" | "success";

export default function BagDrawer({
  isOpen,
  onClose,
  waNumber,
  onExploreOrder,
}: BagDrawerProps) {
  const { cart, updateQuantity, removeFromCart, clearCart, totalPrice, totalItems } = useCart();
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  const [step, setStep] = useState<DrawerStep>("bag");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const [confirmedRef, setConfirmedRef] = useState<string | null>(null);
  const [confirmedWaUrl, setConfirmedWaUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (step === "success") {
          setStep("bag");
          setConfirmedRef(null);
          setConfirmedWaUrl(null);
          setFormError(null);
        }
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose, step]);

  const handleClose = () => {
    if (step === "success") {
      setStep("bag");
      setConfirmedRef(null);
      setConfirmedWaUrl(null);
      setFormError(null);
    }
    onClose();
  };

  const buildWaMessageUrl = (orderRef?: string) => {
    const lines = cart
      .map((item) => `- ${item.name} (${item.quantity}x) : ${formatRupiah(item.price * item.quantity)}`)
      .join("\n");

    let text = `Halo Bon Giri, saya ingin memesan:\n\n`;
    if (orderRef) text += `Ref. Pesanan: ${orderRef}\n`;
    text += `Total Estimasi: ${formatRupiah(totalPrice)}\n\n`;
    text += `Rincian Pesanan:\n${lines}\n\n`;
    if (customerName.trim()) text += `Nama: ${customerName.trim()}\n`;
    if (customerPhone.trim()) text += `WhatsApp: ${customerPhone.trim()}\n`;
    if (customerAddress.trim()) text += `Alamat: ${customerAddress.trim()}\n`;

    return `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
  };

  const isNameValid = customerName.trim().length > 0;
  const isPhoneValid = customerPhone.trim().length >= 8;
  const isAddressValid = customerAddress.trim().length > 0;
  const canSubmit = isNameValid && isPhoneValid && isAddressValid && cart.length > 0;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (!isNameValid || !isPhoneValid || !isAddressValid) {
      setFormError("Mohon lengkapi nama, nomor WhatsApp (minimal 8 angka), dan alamat pengiriman.");
      return;
    }

    setFormError(null);

    const timestamp = Date.now().toString().slice(-6);
    const randomDigits = Math.floor(100 + Math.random() * 900);
    const orderRef = `BG-${timestamp}-${randomDigits}`;
    const waUrl = buildWaMessageUrl(orderRef);

    saveOrderToHistory({
      invoiceNumber: orderRef,
      items: cart.map((i) => ({ name: i.name, price: i.price, quantity: i.quantity })),
      totalAmount: totalPrice,
      paymentMethod: "WhatsApp",
      status: "PENDING",
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerAddress: customerAddress.trim(),
    });

    window.open(waUrl, "_blank", "noopener,noreferrer");

    setConfirmedRef(orderRef);
    setConfirmedWaUrl(waUrl);
    clearCart();
    setStep("success");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      <div
        className="bag-backdrop"
        aria-hidden="true"
        onClick={handleClose}
      />

      <aside
        id="bag-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="bag-drawer-title"
        className="bag-drawer"
      >
        {/* Drawer Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div>
            <h2
              id="bag-drawer-title"
              className="text-base font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              {step === "bag"
                ? `Tas Belanja (${totalItems})`
                : step === "order"
                ? "Data Pengiriman"
                : "Pesanan Siap di WhatsApp"}
            </h2>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={handleClose}
            aria-label="Tutup tas belanja"
            className="sf-icon-btn"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Drawer Body */}
        <div data-lenis-prevent className="flex-1 overflow-y-auto px-6 py-5">
          {step === "success" ? (
            <div className="flex flex-col justify-center h-full gap-5 py-4">
              <div
                className="p-4"
                style={{
                  borderRadius: "var(--radius-card)",
                  backgroundColor: "var(--surface-elevated)",
                  border: "1px solid var(--border-strong)",
                }}
              >
                <p className="text-xs font-mono uppercase tracking-wider mb-1" style={{ color: "var(--text-secondary)" }}>
                  Status Pesanan
                </p>
                <p className="text-lg font-bold mb-3" style={{ color: "var(--text-primary)" }}>
                  Diteruskan ke WhatsApp
                </p>
                <div className="flex justify-between text-sm py-1.5" style={{ borderTop: "1px solid var(--border)" }}>
                  <span style={{ color: "var(--text-secondary)" }}>Ref. Pesanan</span>
                  <span className="font-mono font-medium" style={{ color: "var(--text-primary)" }}>
                    {confirmedRef}
                  </span>
                </div>
                <div className="flex justify-between text-sm py-1.5" style={{ borderTop: "1px solid var(--border)" }}>
                  <span style={{ color: "var(--text-secondary)" }}>Pemesanan</span>
                  <span style={{ color: "var(--text-primary)" }}>
                    Langsung via WhatsApp
                  </span>
                </div>
              </div>

              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Jika jendela WhatsApp belum terbuka otomatis, tekan tombol di bawah untuk mengirim rincian pesanan ke admin Bon Giri.
              </p>

              {confirmedWaUrl && (
                <a
                  href={confirmedWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleClose}
                  className="sf-btn-primary w-full"
                >
                  Buka WhatsApp
                </a>
              )}

              <button
                type="button"
                onClick={handleClose}
                className="sf-btn-ghost w-full"
              >
                Kembali ke Etalase
              </button>
            </div>
          ) : cart.length === 0 ? (
            <div className="flex flex-col items-start justify-center h-full gap-4 py-8">
              <p className="text-base font-medium" style={{ color: "var(--text-primary)" }}>
                Tas belanja Anda masih kosong.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Pilih varian rasa dan ukuran kemasan Stik Keju Ikan Tenggiri Bon Giri terlebih dahulu.
              </p>
              <button
                type="button"
                onClick={() => {
                  handleClose();
                  onExploreOrder();
                }}
                className="sf-btn-primary"
              >
                Pilih Varian Produk
              </button>
            </div>
          ) : step === "bag" ? (
            <ul className="space-y-4">
              {cart.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-4 pb-4"
                  style={{ borderBottom: "1px solid var(--border)" }}
                >
                  <div
                    className="relative w-20 h-20 shrink-0 overflow-hidden"
                    style={{
                      borderRadius: "var(--radius-card)",
                      backgroundColor: "var(--surface-elevated)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <p className="text-sm font-bold leading-snug" style={{ color: "var(--text-primary)" }}>
                        {item.name}
                      </p>
                      <p className="text-xs font-mono mt-1" style={{ color: "var(--text-secondary)" }}>
                        {formatRupiah(item.price)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div
                        className="inline-flex items-center"
                        style={{
                          border: "1px solid var(--border-strong)",
                          borderRadius: "var(--radius-pill)",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label={`Kurangi jumlah ${item.name}`}
                          className="min-w-[44px] min-h-[44px] flex items-center justify-center text-sm font-medium"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-mono font-medium" aria-live="polite">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label={`Tambah jumlah ${item.name}`}
                          className="min-w-[44px] min-h-[44px] flex items-center justify-center text-sm font-medium"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="text-xs underline py-2 px-2 min-h-[44px]"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <form id="drawer-order-form" onSubmit={handleSubmitOrder} className="space-y-4">
              <button
                type="button"
                onClick={() => {
                  setFormError(null);
                  setStep("bag");
                }}
                className="sf-footer-pill"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                <span>Kembali ke Daftar Tas</span>
              </button>

              <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Isi data pengiriman di bawah. Rincian pesanan akan langsung dikirim ke WhatsApp admin Bon Giri untuk diproses.
              </p>

              <div>
                <label htmlFor="order-name" className="block text-xs font-medium mb-1" style={{ color: "var(--text-primary)" }}>
                  Nama Pemesan
                </label>
                <input
                  id="order-name"
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Nama lengkap Anda"
                  className="w-full min-h-[44px] px-3 py-2.5 text-sm"
                  style={{
                    borderRadius: "var(--radius-card)",
                    backgroundColor: "var(--bg)",
                    border: "1px solid var(--border-strong)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>

              <div>
                <label htmlFor="order-phone" className="block text-xs font-medium mb-1" style={{ color: "var(--text-primary)" }}>
                  No. WhatsApp (Min. 8 angka)
                </label>
                <input
                  id="order-phone"
                  type="tel"
                  inputMode="numeric"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="08xxxxxxxxxx"
                  className="w-full min-h-[44px] px-3 py-2.5 text-sm font-mono"
                  style={{
                    borderRadius: "var(--radius-card)",
                    backgroundColor: "var(--bg)",
                    border: "1px solid var(--border-strong)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>

              <div>
                <label htmlFor="order-address" className="block text-xs font-medium mb-1" style={{ color: "var(--text-primary)" }}>
                  Alamat Pengiriman
                </label>
                <textarea
                  id="order-address"
                  rows={3}
                  required
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="Jalan, nomor rumah, kecamatan, kota"
                  className="w-full px-3 py-2.5 text-sm"
                  style={{
                    borderRadius: "var(--radius-card)",
                    backgroundColor: "var(--bg)",
                    border: "1px solid var(--border-strong)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>

              {formError && (
                <p
                  role="alert"
                  className="text-xs p-3 font-medium"
                  style={{
                    borderRadius: "var(--radius-card)",
                    backgroundColor: "var(--surface-elevated)",
                    border: "1px solid var(--border-strong)",
                    color: "#b84b39",
                  }}
                >
                  {formError}
                </p>
              )}
            </form>
          )}
        </div>

        {/* Drawer Footer */}
        {cart.length > 0 && step !== "success" && (
          <div
            className="px-6 py-4 space-y-3"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            <div className="flex items-baseline justify-between">
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Total Pesanan
              </span>
              <span className="order-price" style={{ color: "var(--text-primary)" }}>
                {formatRupiah(totalPrice)}
              </span>
            </div>

            {step === "bag" ? (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setStep("order")}
                  className="sf-btn-primary w-full"
                >
                  Lanjut Pesan via WhatsApp
                </button>
                <a
                  href={buildWaMessageUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sf-btn-ghost w-full text-center"
                >
                  Chat Langsung via WhatsApp
                </a>
              </div>
            ) : (
              <button
                type="submit"
                form="drawer-order-form"
                disabled={!canSubmit}
                className="sf-btn-primary w-full disabled:opacity-50"
              >
                Kirim Pesanan ke WhatsApp
              </button>
            )}
          </div>
        )}
      </aside>
    </div>
  );
}
