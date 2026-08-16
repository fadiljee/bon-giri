"use client";

import { useState, ChangeEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageSquare, X, Upload, CheckCircle2, QrCode, Banknote, AlertCircle, Loader2, ReceiptText } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { saveOrderToHistory } from "@/lib/orderHistory";

export interface CartCheckoutItem {
  name: string;
  quantity: number;
  price: number;
}

interface QrisCheckoutButtonProps {
  productName?: string;
  productPrice?: number;
  items?: CartCheckoutItem[];
  totalPrice?: number;
  waNumber: string;
  variant?: "full" | "compact";
  disabled?: boolean;
}

export default function QrisCheckoutButton({
  productName = "",
  productPrice = 0,
  items,
  totalPrice,
  waNumber,
  variant = "full",
  disabled = false,
}: QrisCheckoutButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"qris" | "cod">("qris");
  
  // Proof upload state
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Customer info state
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");

  // Order submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Success state
  const [isSuccess, setIsSuccess] = useState(false);
  const [successInvoice, setSuccessInvoice] = useState<string | null>(null);
  const [successWaUrl, setSuccessWaUrl] = useState<string | null>(null);

  // Cart context (for clearing cart after user finishes checkout)
  let clearCart: (() => void) | undefined;
  try {
    const cart = useCart();
    clearCart = cart.clearCart;
  } catch (e) {
    // optional fallback if outside CartProvider
  }

  const grandTotal = items && items.length > 0
    ? (totalPrice ?? items.reduce((sum, i) => sum + i.price * i.quantity, 0))
    : productPrice;

  const handleClose = () => {
    if (isSuccess && clearCart) {
      clearCart();
    }
    setIsOpen(false);
    setTimeout(() => {
      setIsSuccess(false);
      setSuccessInvoice(null);
      setSuccessWaUrl(null);
      setProofPreview(null);
      setUploadedUrl(null);
      setSubmitError(null);
    }, 200);
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Local preview
    const previewUrl = URL.createObjectURL(file);
    setProofPreview(previewUrl);
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
        setUploadError(data.error || "Gagal mengunggah bukti pembayaran");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setUploadError("Terjadi kesalahan saat mengunggah gambar.");
    } finally {
      setIsUploading(false);
    }
  };

  const buildWaUrl = (invoiceNumber?: string) => {
    let itemLines = "";
    if (items && items.length > 0) {
      itemLines = items
        .map((i) => `• ${i.name} (${i.quantity}x) - Rp ${(i.price * i.quantity).toLocaleString("id-ID")}`)
        .join("\n");
    } else {
      itemLines = `• ${productName} (1x) - Rp ${productPrice.toLocaleString("id-ID")}`;
    }

    let messageBody = "";

    if (paymentMethod === "qris") {
      messageBody = `Halo Bon Giri, saya telah memesan & membayar via website!\n\n`;
      if (invoiceNumber) messageBody += `No. Faktur: ${invoiceNumber}\n`;
      messageBody += `Total Pembayaran: Rp ${grandTotal.toLocaleString("id-ID")}\nMetode Pembayaran: QRIS / Transfer Bank\n\n`;
      messageBody += `Rincian Pesanan:\n${itemLines}\n\n`;
      
      if (customerName.trim()) messageBody += `Nama Pemesan: ${customerName.trim()}\n`;
      if (customerPhone.trim()) messageBody += `No. Telepon/WA: ${customerPhone.trim()}\n`;
      if (customerAddress.trim()) messageBody += `Alamat Pengiriman: ${customerAddress.trim()}\n`;

      if (uploadedUrl) {
        const fullProofUrl = typeof window !== "undefined" ? `${window.location.origin}${uploadedUrl}` : uploadedUrl;
        messageBody += `Bukti Transfer (Uploaded System): ${fullProofUrl}\n`;
      }

      messageBody += `\nPesanan telah tersimpan di sistem. Mohon segera diproses, terima kasih!`;
    } else {
      messageBody = `Halo Bon Giri, saya telah memesan via COD di website!\n\n`;
      if (invoiceNumber) messageBody += `No. Faktur: ${invoiceNumber}\n`;
      messageBody += `Total Pembayaran: Rp ${grandTotal.toLocaleString("id-ID")}\nMetode Pembayaran: COD (Bayar di Tempat)\n\n`;
      messageBody += `Rincian Pesanan:\n${itemLines}\n\n`;
      
      if (customerName.trim()) messageBody += `Nama Penerima: ${customerName.trim()}\n`;
      if (customerPhone.trim()) messageBody += `No. Telepon/WA: ${customerPhone.trim()}\n`;
      if (customerAddress.trim()) messageBody += `Alamat Pengiriman: ${customerAddress.trim()}\n`;

      messageBody += `\nPesanan COD telah tersimpan di sistem. Mohon konfirmasi jadwal pengirimannya, terima kasih!`;
    }

    const waMessage = encodeURIComponent(messageBody);
    return `https://wa.me/${waNumber}?text=${waMessage}`;
  };

  const isNameValid = customerName.trim().length > 0;
  const isPhoneValid = customerPhone.trim().length >= 8;
  const isAddressValid = customerAddress.trim().length > 0;
  const isProofValid = paymentMethod === "cod" || (paymentMethod === "qris" && !!proofPreview && !isUploading);

  const canSubmit = isNameValid && isPhoneValid && isAddressValid && isProofValid;

  const handleSubmitOrder = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!canSubmit || isSubmitting) return;

    if (!isNameValid || !isPhoneValid || !isAddressValid) {
      setSubmitError("Mohon lengkapi semua data pemesan (Nama, No. WA, dan Alamat).");
      return;
    }

    if (paymentMethod === "qris" && !proofPreview) {
      alert("Silakan unggah foto bukti pembayaran QRIS terlebih dahulu!");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        customerName,
        customerPhone,
        customerAddress,
        paymentMethod,
        proofUrl: uploadedUrl,
        items: items && items.length > 0 ? items : [
          { productName, price: productPrice, quantity: 1 }
        ],
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setSubmitError(data.error || "Gagal menyimpan pesanan ke sistem.");
        setIsSubmitting(false);
        return;
      }

      const invoiceNumber = data.invoiceNumber || "INV-SUCCESS";

      // Save order to LocalStorage history
      saveOrderToHistory({
        invoiceNumber,
        items: items && items.length > 0 ? items : [{ name: productName, price: productPrice, quantity: 1 }],
        totalAmount: grandTotal,
        paymentMethod: paymentMethod === "cod" ? "COD" : "QRIS",
        status: "PENDING",
        customerName,
        customerPhone,
        customerAddress,
        proofUrl: uploadedUrl,
      });

      const waUrl = buildWaUrl(invoiceNumber);

      // Transition to Success Screen inside the modal (DO NOT clear cart yet!)
      setSuccessInvoice(invoiceNumber);
      setSuccessWaUrl(waUrl);
      setIsSuccess(true);
    } catch (err) {
      console.error("Order submission error:", err);
      setSubmitError("Terjadi kesalahan jaringan saat menyimpan pesanan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      {variant === "full" ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          disabled={disabled}
          className={`wa-btn w-full text-[15px] py-3.5 justify-center shadow-md hover:shadow-lg ${
            disabled
              ? "bg-[var(--color-muted)]/30 text-[var(--color-muted)] cursor-not-allowed hover:transform-none hover:shadow-none"
              : ""
          }`}
        >
          <MessageSquare
            className={`w-5 h-5 ${
              disabled ? "stroke-[var(--color-muted)]" : "fill-[var(--color-charcoal)]"
            }`}
          />
          {disabled ? "Stok Sedang Habis" : "Pilih Pembayaran & Pesan"}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          disabled={disabled}
          className={`wa-btn py-2 px-3 text-[12px] font-bold ${
            disabled
              ? "bg-[var(--color-muted)]/30 text-[var(--color-muted)] cursor-not-allowed hover:transform-none hover:shadow-none"
              : ""
          }`}
        >
          {disabled ? null : <MessageSquare className="w-3.5 h-3.5 fill-[var(--color-charcoal)]" />}
          {disabled ? "Habis" : "Pesan"}
        </button>
      )}

      {/* Overlay & Bottom Sheet Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center p-0 sm:p-4 transition-opacity">
          <div className="w-full sm:max-w-md bg-[var(--color-white)] rounded-t-[24px] sm:rounded-[24px] overflow-hidden flex flex-col max-h-[92vh] shadow-2xl relative animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
            
            {/* SUCCESS SCREEN */}
            {isSuccess ? (
              <div className="p-6 flex flex-col items-center text-center space-y-5 my-auto animate-in zoom-in-95 duration-200">
                <div className="w-20 h-20 rounded-full bg-[var(--color-success)]/15 flex items-center justify-center border-2 border-[var(--color-success)]/30 text-[var(--color-success)]">
                  <CheckCircle2 className="w-12 h-12" />
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-[20px] font-bold text-[var(--color-charcoal)] font-display">
                    Pembayaran & Pesanan Berhasil!
                  </h3>
                  <p className="text-[13px] text-[var(--color-charcoal-soft)] max-w-xs mx-auto">
                    Pesanan Anda telah berhasil tersimpan di sistem & tercatat di Riwayat Pesanan.
                  </p>
                </div>

                {/* Order Ref Box */}
                <div className="w-full bg-[#FFF9E6] border border-[var(--color-gold)]/40 rounded-[16px] p-4 text-left space-y-2">
                  <div className="flex justify-between items-center text-[12px] text-[var(--color-charcoal-soft)] font-medium">
                    <span>No. Faktur:</span>
                    <span className="font-mono font-bold text-[var(--color-charcoal)]">{successInvoice}</span>
                  </div>
                  <div className="flex justify-between items-center text-[12px] text-[var(--color-charcoal-soft)] font-medium">
                    <span>Metode Pembayaran:</span>
                    <span className="font-bold text-[var(--color-charcoal)]">
                      {paymentMethod === "cod" ? "COD (Bayar di Tempat)" : "QRIS / Transfer"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[14px] font-bold text-[var(--color-charcoal)] border-t border-[var(--color-gold)]/30 pt-2">
                    <span>Total Pembayaran:</span>
                    <span className="text-[var(--color-gold-dark)] text-[16px]">
                      Rp {grandTotal.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="w-full space-y-2.5 pt-2">
                  {successWaUrl && (
                    <a
                      href={successWaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleClose}
                      className="w-full py-3.5 bg-[#25D366] hover:bg-[#1ebd59] text-white font-bold text-[14px] rounded-full flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
                    >
                      <MessageSquare className="w-5 h-5 fill-white" />
                      Konfirmasi Pesanan ke WhatsApp
                    </a>
                  )}

                  <Link
                    href="/pesanan"
                    onClick={handleClose}
                    className="w-full py-3 bg-[var(--color-cream-soft)] hover:bg-[var(--color-gold)]/20 border border-[var(--color-gold)] text-[var(--color-charcoal)] font-bold text-[13px] rounded-full flex items-center justify-center gap-1.5 transition-all"
                  >
                    <ReceiptText className="w-4 h-4 text-[var(--color-gold-dark)]" />
                    Lihat Riwayat Pesanan
                  </Link>

                  <button
                    type="button"
                    onClick={handleClose}
                    className="text-[12px] text-[var(--color-charcoal-soft)] hover:text-[var(--color-charcoal)] font-bold block mx-auto pt-1 hover:underline"
                  >
                    Selesai & Belanja Lagi
                  </button>
                </div>
              </div>
            ) : (
              /* REGULAR CHECKOUT FORM */
              <>
                {/* Header */}
                <div className="relative pt-3 pb-3 px-5 border-b border-[var(--color-muted)]/20 bg-[#FFF9E6]">
                  <div className="w-10 h-1.5 bg-[var(--color-muted)]/40 rounded-full mx-auto mb-3 sm:hidden"></div>
                  <h3 className="text-[17px] font-bold text-[var(--color-charcoal)] text-center font-display">
                    Opsi Pembayaran & Pesanan
                  </h3>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="absolute top-3 sm:top-4 right-4 p-1.5 text-[var(--color-charcoal-soft)] hover:text-[var(--color-charcoal)] hover:bg-black/5 rounded-full transition-colors"
                    aria-label="Tutup"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Scrollable Body */}
                <div className="overflow-y-auto p-4 sm:p-5 space-y-4">
                  
                  {/* Order Summary Box */}
                  <div className="bg-[var(--color-cream-soft)] border border-[var(--color-gold)]/40 rounded-[14px] p-3.5">
                    <p className="text-[11px] font-bold text-[var(--color-charcoal-soft)] mb-2 uppercase tracking-wide">
                      Ringkasan Pesanan
                    </p>
                    {items && items.length > 0 ? (
                      <div className="space-y-1.5">
                        {items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-[13px]">
                            <span className="font-medium text-[var(--color-charcoal)]">
                              {item.name} <span className="font-bold text-[var(--color-gold-dark)]">x{item.quantity}</span>
                            </span>
                            <span className="font-bold text-[var(--color-charcoal)]">
                              Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                            </span>
                          </div>
                        ))}
                        <div className="pt-2 border-t border-[var(--color-gold)]/30 flex justify-between items-center font-bold">
                          <span className="text-[13px] text-[var(--color-charcoal)]">Total Pembayaran</span>
                          <span className="text-[16px] text-[var(--color-gold-dark)]">
                            Rp {grandTotal.toLocaleString("id-ID")}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <p className="text-[14px] font-bold text-[var(--color-charcoal)]">
                          {productName} × 1
                        </p>
                        <p className="text-[15px] font-bold text-[var(--color-gold-dark)]">
                          Rp {productPrice.toLocaleString("id-ID")}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Payment Method Selector Tabs */}
                  <div>
                    <label className="block text-[12px] font-bold text-[var(--color-charcoal-soft)] uppercase tracking-wide mb-2">
                      Pilih Metode Pembayaran:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("qris")}
                        className={`flex items-center gap-2.5 p-3 rounded-[14px] border text-left transition-all ${
                          paymentMethod === "qris"
                            ? "border-[var(--color-gold-dark)] bg-[var(--color-cream-soft)] ring-2 ring-[var(--color-gold)]/40"
                            : "border-[var(--color-muted)]/20 bg-white hover:border-[var(--color-gold)]/50"
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          paymentMethod === "qris" ? "bg-[var(--color-gold)] text-[var(--color-charcoal)]" : "bg-gray-100 text-gray-500"
                        }`}>
                          <QrCode className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-[13px] font-bold text-[var(--color-charcoal)]">QRIS / Transfer</div>
                          <div className="text-[10px] text-[var(--color-charcoal-soft)]">E-Wallet & M-Banking</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod("cod")}
                        className={`flex items-center gap-2.5 p-3 rounded-[14px] border text-left transition-all ${
                          paymentMethod === "cod"
                            ? "border-[var(--color-gold-dark)] bg-[var(--color-cream-soft)] ring-2 ring-[var(--color-gold)]/40"
                            : "border-[var(--color-muted)]/20 bg-white hover:border-[var(--color-gold)]/50"
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          paymentMethod === "cod" ? "bg-[var(--color-gold)] text-[var(--color-charcoal)]" : "bg-gray-100 text-gray-500"
                        }`}>
                          <Banknote className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-[13px] font-bold text-[var(--color-charcoal)]">COD</div>
                          <div className="text-[10px] text-[var(--color-charcoal-soft)]">Bayar di Tempat</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* QRIS SECTION */}
                  {paymentMethod === "qris" && (
                    <div className="space-y-3.5 bg-white p-3.5 rounded-[16px] border border-[var(--color-muted)]/20 shadow-sm animate-in fade-in duration-150">
                      <div className="text-center space-y-1">
                        <p className="text-[12px] font-bold text-[var(--color-charcoal)]">
                          Scan QRIS di bawah ini untuk membayar Rp {grandTotal.toLocaleString("id-ID")}
                        </p>
                        <div className="flex justify-center bg-white border border-[var(--color-muted)]/20 rounded-[12px] p-2 max-w-[200px] mx-auto shadow-sm">
                          <div className="relative w-full aspect-square">
                            <Image
                              src="/images/qris.png"
                              alt="QRIS DANA Bisnis Bon Giri"
                              fill
                              sizes="200px"
                              className="object-contain"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Upload Bukti Pembayaran Section */}
                      <div className="pt-2 border-t border-[var(--color-muted)]/20 space-y-2">
                        <label className="block text-[12px] font-bold text-[var(--color-charcoal)]">
                          Unggah Bukti Pembayaran (Wajib untuk QRIS):
                        </label>

                        {proofPreview ? (
                          <div className="relative bg-[#FFF9E6] border border-[var(--color-gold)]/50 rounded-[12px] p-2 flex items-center gap-3">
                            <div className="relative w-14 h-14 rounded-[8px] overflow-hidden bg-black/10 shrink-0">
                              <Image
                                src={proofPreview}
                                alt="Bukti Transfer"
                                fill
                                sizes="56px"
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-[12px] font-bold text-[var(--color-success)] flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                {isUploading ? "Mengunggah..." : "Bukti Siap Dilampirkan"}
                              </span>
                              <p className="text-[10px] text-[var(--color-charcoal-soft)] truncate">
                                Foto bukti pembayaran telah dipilih
                              </p>
                            </div>
                            <label className="cursor-pointer text-[11px] font-bold text-[var(--color-navy)] hover:underline px-2 py-1 bg-white rounded-full border border-[var(--color-muted)]/20">
                              Ganti
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                              />
                            </label>
                          </div>
                        ) : (
                          <label className="border-2 border-dashed border-[var(--color-gold)]/60 bg-[var(--color-cream-soft)] hover:bg-[var(--color-gold)]/10 rounded-[14px] p-4 flex flex-col items-center justify-center cursor-pointer transition-colors text-center group">
                            <Upload className="w-6 h-6 text-[var(--color-gold-dark)] mb-1 group-hover:scale-110 transition-transform" />
                            <span className="text-[13px] font-bold text-[var(--color-charcoal)]">
                              Klik untuk Unggah Bukti Transfer
                            </span>
                            <span className="text-[10px] text-[var(--color-charcoal-soft)] mt-0.5">
                              Format JPG, PNG, atau WEBP (Screenshot resi bank/e-wallet)
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                          </label>
                        )}

                        {uploadError && (
                          <p className="text-[11px] text-[var(--color-error)] font-bold flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> {uploadError}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* COD SECTION */}
                  {paymentMethod === "cod" && (
                    <div className="bg-[var(--color-cream-soft)] border border-[var(--color-gold)]/50 p-3.5 rounded-[16px] space-y-2 animate-in fade-in duration-150">
                      <div className="flex items-center gap-2 text-[var(--color-gold-dark)] font-bold text-[13px]">
                        <Banknote className="w-4 h-4" /> Bayar Tunai di Tempat (COD)
                      </div>
                      <p className="text-[12px] text-[var(--color-charcoal)] leading-relaxed">
                        Pembayaran sebesar <span className="font-bold text-[var(--color-gold-dark)]">Rp {grandTotal.toLocaleString("id-ID")}</span> dilakukan secara langsung kepada kurir/tim saat produk diterima.
                      </p>
                    </div>
                  )}

                  {/* Customer Name, Phone & Address Inputs */}
                  <div className="space-y-2.5 pt-1">
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--color-charcoal-soft)] uppercase tracking-wide mb-1">
                        Nama Pemesan / Penerima <span className="text-[var(--color-error)]">*</span>:
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Contoh: Budi Santoso"
                        className="w-full px-3 py-2 text-[13px] bg-white border border-[var(--color-muted)]/20 rounded-[12px] focus:outline-none focus:border-[var(--color-gold)]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--color-charcoal-soft)] uppercase tracking-wide mb-1">
                        No. Telepon / WhatsApp <span className="text-[var(--color-error)]">* (Hanya Angka)</span>:
                      </label>
                      <input
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value.replace(/[^0-9]/g, ""))}
                        placeholder="Contoh: 081234567890"
                        className="w-full px-3 py-2 text-[13px] bg-white border border-[var(--color-muted)]/20 rounded-[12px] focus:outline-none focus:border-[var(--color-gold)] font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--color-charcoal-soft)] uppercase tracking-wide mb-1">
                        Alamat Lengkap / Catatan Pengiriman <span className="text-[var(--color-error)]">*</span>:
                      </label>
                      <textarea
                        rows={2}
                        required
                        value={customerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                        placeholder="Contoh: Jl. Merdeka No. 12, Pangkalpinang (Depan Toko A)"
                        className="w-full px-3 py-2 text-[13px] bg-white border border-[var(--color-muted)]/20 rounded-[12px] focus:outline-none focus:border-[var(--color-gold)]"
                      />
                    </div>
                  </div>

                  {submitError && (
                    <div className="p-3 bg-[var(--color-error)]/10 border border-[var(--color-error)]/30 rounded-[12px] text-[12px] font-bold text-[var(--color-error)] flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                </div>

                {/* Sticky Action Footer */}
                <div className="p-4 border-t border-[var(--color-muted)]/20 bg-white">
                  <button
                    type="button"
                    onClick={handleSubmitOrder}
                    disabled={!canSubmit || isSubmitting}
                    className={`btn-primary w-full py-3.5 text-[14px] font-bold flex justify-center items-center gap-2 rounded-full shadow-md transition-all ${
                      canSubmit && !isSubmitting
                        ? "bg-[var(--color-gold)] hover:bg-[var(--color-gold-dark)] text-[var(--color-charcoal)] active:scale-[0.99]"
                        : "bg-[var(--color-muted)]/30 text-[var(--color-muted)] cursor-not-allowed shadow-none"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Menyimpan Pesanan...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 fill-current" />
                        {!isNameValid
                          ? "Wajib Isi Nama Pemesan"
                          : !isPhoneValid
                          ? "Wajib Isi No. WhatsApp (Min. 8 Angka)"
                          : !isAddressValid
                          ? "Wajib Isi Alamat Pengiriman"
                          : paymentMethod === "qris" && isUploading
                          ? "Mengunggah Bukti..."
                          : paymentMethod === "qris" && !proofPreview
                          ? "Wajib Unggah Bukti Transfer"
                          : "Konfirmasi & Selesaikan Pesanan"}
                      </>
                    )}
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      )}
    </>
  );
}
