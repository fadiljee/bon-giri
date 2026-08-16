"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getOrderHistory, clearOrderHistory, OrderRecord } from "@/lib/orderHistory";
import { ReceiptText, ArrowRight, MessageSquare, Trash2, Calendar, CheckCircle2, QrCode, Banknote, ExternalLink } from "lucide-react";

interface OrderHistoryViewProps {
  waNumber: string;
}

export default function OrderHistoryView({ waNumber }: OrderHistoryViewProps) {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setOrders(getOrderHistory());
    setIsLoaded(true);
  }, []);

  const handleClear = () => {
    if (confirm("Apakah Anda yakin ingin menghapus seluruh riwayat pesanan lokal?")) {
      clearOrderHistory();
      setOrders([]);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex flex-col bg-[#FFF9E6] min-h-screen pb-24 pt-6 px-4 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-gold-dark)]"></div>
      </div>
    );
  }

  const isEmpty = orders.length === 0;

  return (
    <div className="flex flex-col bg-[#FFF9E6] min-h-screen pb-24 pt-4 px-4 space-y-4">
      {/* Top Header info & Clear button */}
      {!isEmpty && (
        <div className="flex items-center justify-between px-1">
          <span className="text-[13px] font-bold text-[var(--color-charcoal-soft)]">
            Total {orders.length} Pesanan Tersimpan
          </span>
          <button
            type="button"
            onClick={handleClear}
            className="text-[12px] font-bold text-[var(--color-error)] hover:underline flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" /> Hapus Riwayat
          </button>
        </div>
      )}

      {/* Orders List */}
      {!isEmpty ? (
        <div className="space-y-4">
          {orders.map((order) => {
            const formattedDate = new Date(order.date).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            const waInquiryMessage = encodeURIComponent(
              `Halo Admin Bon Giri, saya ingin menanyakan status pesanan saya dengan No. Faktur: ${order.invoiceNumber}. Total: Rp ${order.totalAmount.toLocaleString("id-ID")}.`
            );

            return (
              <div
                key={order.id}
                className="bg-white rounded-[18px] border border-[var(--color-muted)]/15 shadow-sm p-4 space-y-3 relative overflow-hidden transition-all"
              >
                {/* Header: Invoice Number & Date */}
                <div className="flex items-center justify-between border-b border-[var(--color-muted)]/10 pb-2.5">
                  <div className="space-y-0.5">
                    <span className="text-[13px] font-bold text-[var(--color-charcoal)] font-mono block">
                      {order.invoiceNumber}
                    </span>
                    <span className="text-[11px] text-[var(--color-muted)] flex items-center gap-1 font-medium">
                      <Calendar className="w-3 h-3" /> {formattedDate} WIB
                    </span>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                      order.paymentMethod === "QRIS"
                        ? "bg-[var(--color-gold)]/20 text-[var(--color-gold-dark)]"
                        : "bg-blue-50 text-blue-700"
                    }`}
                  >
                    {order.paymentMethod === "QRIS" ? (
                      <>
                        <QrCode className="w-3 h-3" /> QRIS
                      </>
                    ) : (
                      <>
                        <Banknote className="w-3 h-3" /> COD
                      </>
                    )}
                  </span>
                </div>

                {/* Items List */}
                <div className="space-y-1.5 pt-1">
                  <p className="text-[11px] font-bold text-[var(--color-charcoal-soft)] uppercase tracking-wide">
                    Rincian Produk:
                  </p>
                  <div className="bg-[var(--color-cream-soft)]/50 rounded-[12px] p-2.5 space-y-1 border border-[var(--color-gold)]/20">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-[13px]">
                        <span className="font-medium text-[var(--color-charcoal)]">
                          • {item.name} <span className="font-bold text-[var(--color-gold-dark)]">({item.quantity}x)</span>
                        </span>
                        <span className="font-bold text-[var(--color-charcoal)]">
                          Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total & Customer Details */}
                <div className="flex justify-between items-center border-t border-[var(--color-muted)]/10 pt-2.5">
                  <span className="text-[13px] font-bold text-[var(--color-charcoal)]">Total Pembayaran:</span>
                  <span className="text-[16px] font-bold text-[var(--color-gold-dark)]">
                    Rp {order.totalAmount.toLocaleString("id-ID")}
                  </span>
                </div>

                {/* Delivery Note & Proof Link if available */}
                {(order.customerAddress || order.proofUrl) && (
                  <div className="text-[11px] text-[var(--color-charcoal-soft)] bg-gray-50 p-2.5 rounded-[10px] space-y-1">
                    {order.customerName && (
                      <p><strong className="text-[var(--color-charcoal)]">Penerima:</strong> {order.customerName}</p>
                    )}
                    {order.customerAddress && (
                      <p><strong className="text-[var(--color-charcoal)]">Alamat:</strong> {order.customerAddress}</p>
                    )}
                    {order.proofUrl && (
                      <a
                        href={order.proofUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[var(--color-navy)] font-bold hover:underline mt-0.5"
                      >
                        <ExternalLink className="w-3 h-3" /> Lihat Bukti Transfer
                      </a>
                    )}
                  </div>
                )}

                {/* Action WA Button */}
                <div className="pt-1">
                  <a
                    href={`https://wa.me/${waNumber}?text=${waInquiryMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-white hover:bg-[var(--color-gold)]/20 border border-[var(--color-gold)] text-[var(--color-charcoal)] font-bold text-[12px] rounded-full flex items-center justify-center gap-1.5 transition-all shadow-sm"
                  >
                    <MessageSquare className="w-3.5 h-3.5 fill-[var(--color-gold-dark)]" />
                    Tanya Admin WA mengenai Faktur ini
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-[20px] text-center space-y-4 border border-[var(--color-muted)]/15 shadow-sm my-4">
          <div className="w-16 h-16 rounded-full bg-[#FFF9E6] flex items-center justify-center mx-auto border border-[var(--color-gold)]/40">
            <ReceiptText className="w-8 h-8 text-[var(--color-gold-dark)]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-[16px] font-bold text-[var(--color-charcoal)] font-display">
              Belum Ada Riwayat Pesanan
            </h3>
            <p className="text-[13px] text-[var(--color-charcoal-soft)] max-w-xs mx-auto">
              Pesanan stik keju Bon Giri yang Anda buat akan tersimpan dan dapat dipantau di halaman ini.
            </p>
          </div>
          <Link
            href="/katalog"
            className="btn-primary inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-gold)] hover:bg-[var(--color-gold-dark)] text-[var(--color-charcoal)] font-bold text-[14px] rounded-full shadow-md transition-all"
          >
            Lihat Katalog Produk <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
