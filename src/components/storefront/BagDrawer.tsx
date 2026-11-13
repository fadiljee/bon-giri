"use client";

import { useEffect, useRef, useState, ChangeEvent } from "react";
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

type DrawerStep = "bag" | "checkout" | "success";

export default function BagDrawer({
  isOpen,
  onClose,
  waNumber,
  onExploreOrder,
}: BagDrawerProps) {
  const { cart, updateQuantity, removeFromCart, clearCart, totalPrice, totalItems } = useCart();
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  const [step, setStep] = useState<DrawerStep>("bag");
  const [paymentMethod, setPaymentMethod] = useState<"qris" | "cod">("qris");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");

  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmedInvoice, setConfirmedInvoice] = useState<string | null>(null);
  const [confirmedWaUrl, setConfirmedWaUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
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
  }, [isOpen, onClose]);

  const handleClose = () => {
    if (step === "success") {
      setStep("bag");
      setConfirmedInvoice(null);
      setConfirmedWaUrl(null);
      setProofPreview(null);
      setUploadedUrl(null);
      setSubmitError(null);
    }
    onClose();
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProofPreview(URL.createObjectURL(file));
    setUploadError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setUploadedUrl(data.url);
      } else {
        setUploadError(data.error || "Gagal mengunggah bukti pembayaran.");
      }
    } catch {
      setUploadError("Terjadi gangguan jaringan saat mengunggah gambar.");
    } finally {
      setIsUploading(false);
    }
  };

  const buildWaMessageUrl = (invoiceNumber?: string) => {
    const lines = cart
      .map((item) => `- ${item.name} (${item.quantity}x) : ${formatRupiah(item.price * item.quantity)}`)
      .join("\n");

    let text = `Halo Bon Giri, saya ingin konfirmasi pesanan:\n\n`;
    if (invoiceNumber) text += `No. Faktur: ${invoiceNumber}\n`;
    text += `Metode: ${paymentMethod === "cod" ? "COD (Bayar di Tempat)" : "QRIS / Transfer"}\n`;
    text += `Total: ${formatRupiah(totalPrice)}\n\n`;
    text += `Rincian:\n${lines}\n\n`;
    if (customerName.trim()) text += `Nama: ${customerName.trim()}\n`;
    if (customerPhone.trim()) text += `WhatsApp: ${customerPhone.trim()}\n`;
    if (customerAddress.trim()) text += `Alamat: ${customerAddress.trim()}\n`;
    if (uploadedUrl && typeof window !== "undefined") {
      text += `Bukti Transfer: ${window.location.origin}${uploadedUrl}\n`;
    }

    return `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
  };

  const isNameValid = customerName.trim().length > 0;
  const isPhoneValid = customerPhone.trim().length >= 8;
  const isAddressValid = customerAddress.trim().length > 0;
  const isProofValid = paymentMethod === "cod" || (paymentMethod === "qris" && Boolean(proofPreview) && !isUploading);
  const canSubmit = isNameValid && isPhoneValid && isAddressValid && isProofValid && cart.length > 0;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          customerAddress: customerAddress.trim(),
          paymentMethod,
          proofUrl: uploadedUrl,
          items: cart.map((item) => ({
            productId: item.id.split("__")[0],
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setSubmitError(data.error || "Gagal menyimpan pesanan ke sistem.");
        setIsSubmitting(false);
        return;
      }

      const invoiceNumber = data.invoiceNumber || "INV-BONGIRI";
      saveOrderToHistory({
        invoiceNumber,
        items: cart.map((i) => ({ name: i.name, price: i.price, quantity: i.quantity })),
        totalAmount: totalPrice,
        paymentMethod: paymentMethod === "cod" ? "COD" : "QRIS",
        status: "PENDING",
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerAddress: customerAddress.trim(),
        proofUrl: uploadedUrl,
      });

      const waUrl = buildWaMessageUrl(invoiceNumber);
      setConfirmedInvoice(invoiceNumber);
      setConfirmedWaUrl(waUrl);
      clearCart();
      setStep("success");
    } catch {
      setSubmitError("Terjadi gangguan jaringan saat mengirim pesanan.");
    } finally {
      setIsSubmitting(false);
    }
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
                : step === "checkout"
                ? "Pembayaran & Pengiriman"
                : "Pesanan Diterima"}
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
        <div className="flex-1 overflow-y-auto px-6 py-5">
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
                  Order Confirmed
                </p>
                <div className="flex justify-between text-sm py-1.5" style={{ borderTop: "1px solid var(--border)" }}>
                  <span style={{ color: "var(--text-secondary)" }}>No. Faktur</span>
                  <span className="font-mono font-medium" style={{ color: "var(--text-primary)" }}>
                    {confirmedInvoice}
                  </span>
                </div>
                <div className="flex justify-between text-sm py-1.5" style={{ borderTop: "1px solid var(--border)" }}>
                  <span style={{ color: "var(--text-secondary)" }}>Metode</span>
                  <span style={{ color: "var(--text-primary)" }}>
                    {paymentMethod === "cod" ? "COD (Bayar di Tempat)" : "QRIS / Transfer"}
                  </span>
                </div>
              </div>

              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Pesanan Anda telah tercatat. Lanjutkan konfirmasi ke WhatsApp admin Bon Giri agar segera diproses.
              </p>

              {confirmedWaUrl && (
                <a
                  href={confirmedWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleClose}
                  className="sf-btn-primary w-full"
                >
                  Konfirmasi via WhatsApp
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
                        className="text-xs underline py-2 px-2"
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
            <form id="drawer-checkout-form" onSubmit={handleSubmitOrder} className="space-y-4">
              <button
                type="button"
                onClick={() => setStep("bag")}
                className="text-xs font-medium underline py-1"
                style={{ color: "var(--text-secondary)" }}
              >
                Kembali ke Daftar Tas
              </button>

              <div>
                <span className="block text-xs font-mono uppercase tracking-wider mb-2" style={{ color: "var(--text-secondary)" }}>
                  Metode Pembayaran
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("qris")}
                    className="pill-option min-h-[44px] px-3 py-2 text-sm font-medium transition-colors"
                    style={{
                      borderRadius: "var(--radius-card)",
                      backgroundColor: paymentMethod === "qris" ? "var(--surface-elevated)" : "transparent",
                      border: `1px solid ${paymentMethod === "qris" ? "var(--border-strong)" : "var(--border)"}`,
                      color: "var(--text-primary)",
                    }}
                  >
                    QRIS / Transfer
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cod")}
                    className="pill-option min-h-[44px] px-3 py-2 text-sm font-medium transition-colors"
                    style={{
                      borderRadius: "var(--radius-card)",
                      backgroundColor: paymentMethod === "cod" ? "var(--surface-elevated)" : "transparent",
                      border: `1px solid ${paymentMethod === "cod" ? "var(--border-strong)" : "var(--border)"}`,
                      color: "var(--text-primary)",
                    }}
                  >
                    COD (Di Tempat)
                  </button>
                </div>
              </div>

              {paymentMethod === "qris" && (
                <div
                  className="p-3.5 space-y-3"
                  style={{
                    borderRadius: "var(--radius-card)",
                    backgroundColor: "var(--surface-elevated)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    Scan QRIS Bon Giri untuk membayar <strong style={{ color: "var(--text-primary)" }}>{formatRupiah(totalPrice)}</strong>, lalu unggah bukti transfer.
                  </p>
                  <div className="relative w-40 h-40 mx-auto bg-white p-2" style={{ borderRadius: "var(--radius-card)" }}>
                    <Image
                      src="/images/qris.png"
                      alt="QRIS Bon Giri"
                      fill
                      sizes="160px"
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="qris-proof-input"
                      className="block text-xs font-medium mb-1.5"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Bukti Pembayaran (JPG, PNG, WEBP)
                    </label>
                    <input
                      id="qris-proof-input"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="block w-full text-xs"
                      style={{ color: "var(--text-secondary)" }}
                    />
                    {isUploading && (
                      <p className="text-xs mt-1 font-mono" style={{ color: "var(--text-secondary)" }}>
                        Mengunggah bukti...
                      </p>
                    )}
                    {proofPreview && !isUploading && (
                      <p className="text-xs mt-1 font-mono" style={{ color: "var(--text-primary)" }}>
                        Bukti siap dilampirkan.
                      </p>
                    )}
                    {uploadError && (
                      <p className="text-xs mt-1 font-medium" role="alert" style={{ color: "#b84b39" }}>
                        Error: {uploadError}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="checkout-name" className="block text-xs font-medium mb-1" style={{ color: "var(--text-primary)" }}>
                  Nama Pemesan
                </label>
                <input
                  id="checkout-name"
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Nama lengkap Anda"
                  className="w-full px-3 py-2.5 text-sm"
                  style={{
                    borderRadius: "var(--radius-card)",
                    backgroundColor: "var(--bg)",
                    border: "1px solid var(--border-strong)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>

              <div>
                <label htmlFor="checkout-phone" className="block text-xs font-medium mb-1" style={{ color: "var(--text-primary)" }}>
                  No. WhatsApp (Min. 8 angka)
                </label>
                <input
                  id="checkout-phone"
                  type="tel"
                  inputMode="numeric"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="08xxxxxxxxxx"
                  className="w-full px-3 py-2.5 text-sm font-mono"
                  style={{
                    borderRadius: "var(--radius-card)",
                    backgroundColor: "var(--bg)",
                    border: "1px solid var(--border-strong)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>

              <div>
                <label htmlFor="checkout-address" className="block text-xs font-medium mb-1" style={{ color: "var(--text-primary)" }}>
                  Alamat Pengiriman
                </label>
                <textarea
                  id="checkout-address"
                  rows={2}
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

              {submitError && (
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
                  Gagal mengirim pesanan: {submitError}
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
                Total Pembayaran
              </span>
              <span className="order-price" style={{ color: "var(--text-primary)" }}>
                {formatRupiah(totalPrice)}
              </span>
            </div>

            {step === "bag" ? (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setStep("checkout")}
                  className="sf-btn-primary w-full"
                >
                  Checkout Sekarang
                </button>
                <a
                  href={buildWaMessageUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sf-btn-ghost w-full text-center"
                >
                  Pesan Langsung via WhatsApp
                </a>
              </div>
            ) : (
              <button
                type="submit"
                form="drawer-checkout-form"
                disabled={!canSubmit || isSubmitting}
                className="sf-btn-primary w-full disabled:opacity-50"
              >
                {isSubmitting ? "Menyimpan Pesanan..." : "Konfirmasi Pesanan"}
              </button>
            )}
          </div>
        )}
      </aside>
    </div>
  );
}
