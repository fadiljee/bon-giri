"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { getOrderHistory, clearOrderHistory, OrderRecord } from "@/lib/orderHistory";
import { formatRupiah } from "@/data/storefront";

const emptySubscribe = () => () => {};

interface OrderHistoryViewProps {
  waNumber: string;
}

export default function OrderHistoryView({ waNumber }: OrderHistoryViewProps) {
  const isLoaded = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const [clearedOrders, setClearedOrders] = useState<OrderRecord[] | null>(null);
  const orders = clearedOrders ?? (isLoaded ? getOrderHistory() : []);

  const handleClear = () => {
    if (confirm("Hapus seluruh riwayat pesanan lokal di perangkat ini?")) {
      clearOrderHistory();
      setClearedOrders([]);
    }
  };

  if (!isLoaded) {
    return (
      <div className="sf-container py-16">
        <p className="text-sm font-mono" style={{ color: "var(--text-secondary)" }}>
          Memuat riwayat pesanan...
        </p>
      </div>
    );
  }

  const isEmpty = orders.length === 0;

  return (
    <div className="sf-container space-y-8">
      <div data-reveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="section-title" style={{ color: "var(--text-primary)" }}>
            Riwayat Pesanan.
          </h1>
          <p className="text-base" style={{ color: "var(--text-secondary)" }}>
            Daftar pesanan yang pernah Anda buat dari perangkat ini beserta nomor faktur untuk konfirmasi ke admin.
          </p>
        </div>

        {!isEmpty && (
          <button
            type="button"
            onClick={handleClear}
            className="sf-btn-ghost self-start sm:self-end"
          >
            Hapus Riwayat ({orders.length})
          </button>
        )}
      </div>

      {isEmpty ? (
        <div
          className="p-8 sm:p-12 space-y-4 max-w-xl"
          style={{
            borderRadius: "var(--radius-card)",
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
          }}
        >
          <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
            Belum ada riwayat pesanan.
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Setelah Anda menyelesaikan checkout QRIS atau COD di tas belanja, nomor faktur dan rincian pesanan akan otomatis tersimpan di sini.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/katalog" className="sf-btn-primary">
              Lihat Katalog Varian
            </Link>
            <Link href="/#order" className="sf-btn-ghost">
              Ke Konfigurator
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {orders.map((order) => {
            const formattedDate = new Date(order.date).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            const waInquiryMessage = encodeURIComponent(
              `Halo Admin Bon Giri, saya ingin menanyakan status pesanan dengan No. Faktur: ${order.invoiceNumber}. Total: ${formatRupiah(order.totalAmount)}.`
            );

            return (
              <article
                key={order.id}
                data-reveal
                className="p-6 flex flex-col justify-between gap-5"
                style={{
                  borderRadius: "var(--radius-card)",
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                }}
              >
                <div className="space-y-4">
                  <div
                    className="flex items-start justify-between gap-4 pb-4"
                    style={{ borderBottom: "1px solid var(--border)" }}
                  >
                    <div>
                      <p className="font-mono text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                        {order.invoiceNumber}
                      </p>
                      <p className="text-xs font-mono mt-1" style={{ color: "var(--text-secondary)" }}>
                        {formattedDate} WIB
                      </p>
                    </div>

                    <span
                      className="px-3 py-1 text-xs font-mono font-medium"
                      style={{
                        borderRadius: "var(--radius-pill)",
                        backgroundColor: "var(--surface-elevated)",
                        border: "1px solid var(--border-strong)",
                        color: "var(--text-primary)",
                      }}
                    >
                      {order.paymentMethod}
                    </span>
                  </div>

                  <ul className="space-y-2 text-sm">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="flex justify-between gap-4">
                        <span style={{ color: "var(--text-primary)" }}>
                          {item.name} × {item.quantity}
                        </span>
                        <span className="font-mono shrink-0" style={{ color: "var(--text-secondary)" }}>
                          {formatRupiah(item.price * item.quantity)}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {(order.customerName || order.customerAddress || order.proofUrl) && (
                    <div
                      className="p-3.5 text-xs space-y-1"
                      style={{
                        borderRadius: "var(--radius-card)",
                        backgroundColor: "var(--surface-elevated)",
                        border: "1px solid var(--border)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {order.customerName && (
                        <p>
                          Penerima: <span style={{ color: "var(--text-primary)" }}>{order.customerName}</span>
                        </p>
                      )}
                      {order.customerAddress && (
                        <p>
                          Alamat: <span style={{ color: "var(--text-primary)" }}>{order.customerAddress}</span>
                        </p>
                      )}
                      {order.proofUrl && (
                        <a
                          href={order.proofUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block underline pt-1 font-medium"
                          style={{ color: "var(--text-primary)" }}
                        >
                          Lihat Bukti Pembayaran
                        </a>
                      )}
                    </div>
                  )}
                </div>

                <div
                  className="pt-4 space-y-3"
                  style={{ borderTop: "1px solid var(--border)" }}
                >
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                      Total Pembayaran
                    </span>
                    <span className="order-price" style={{ color: "var(--text-primary)" }}>
                      {formatRupiah(order.totalAmount)}
                    </span>
                  </div>

                  <a
                    href={`https://wa.me/${waNumber}?text=${waInquiryMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sf-btn-ghost w-full"
                  >
                    Tanya Admin via WhatsApp
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
