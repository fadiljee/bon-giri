"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import WhatsAppOrderButton from "@/components/WhatsAppOrderButton";

interface CartViewProps {
  waNumber: string;
}

export default function CartView({ waNumber }: CartViewProps) {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItems,
    totalPrice,
    isInitialized,
  } = useCart();

  if (!isInitialized) {
    return (
      <div className="flex flex-col bg-[#FFF9E6] min-h-screen pb-32 pt-6 px-4 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-gold-dark)]"></div>
      </div>
    );
  }

  const isEmpty = cart.length === 0;

  return (
    <div className="flex flex-col bg-[#FFF9E6] min-h-screen pb-36 pt-4 px-4 space-y-4">
      {/* Top action bar if cart has items */}
      {!isEmpty && (
        <div className="flex items-center justify-between px-1">
          <span className="text-[13px] font-bold text-[var(--color-charcoal-soft)]">
            Total ({totalItems} produk)
          </span>
          <button
            type="button"
            onClick={clearCart}
            className="text-[12px] font-bold text-[var(--color-error)] hover:underline flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" /> Kosongkan
          </button>
        </div>
      )}

      {/* Cart items list */}
      {!isEmpty ? (
        <div className="space-y-3">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-white p-3.5 rounded-[16px] border border-[var(--color-muted)]/15 shadow-sm flex items-center gap-3 relative transition-all"
            >
              {/* Product Image */}
              <div className="relative w-16 h-16 rounded-[12px] bg-[#FFFEF3] overflow-hidden shrink-0 border border-[var(--color-muted)]/20">
                <Image
                  src={item.image || "/images/products/original.webp"}
                  alt={item.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0 pr-2">
                <span className="text-[10px] font-bold text-[var(--color-gold-dark)] uppercase tracking-wider block truncate">
                  {item.categoryName || "Stik Keju"}
                </span>
                <Link
                  href={`/katalog/${item.slug}`}
                  className="text-[14px] font-bold text-[var(--color-charcoal)] hover:text-[var(--color-gold-dark)] transition-colors line-clamp-1 block"
                >
                  {item.name}
                </Link>
                <span className="text-[13px] font-bold text-[var(--color-charcoal)] block mt-0.5">
                  Rp {item.price.toLocaleString("id-ID")}
                </span>
              </div>

              {/* Quantity Controls & Delete */}
              <div className="flex flex-col items-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => removeFromCart(item.id)}
                  title="Hapus dari keranjang"
                  className="text-[var(--color-muted)] hover:text-[var(--color-error)] p-1 rounded-full transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2 bg-[#FFF9E6] px-2 py-1 rounded-full border border-[var(--color-muted)]/20">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[var(--color-charcoal)] hover:bg-[var(--color-gold)]/30 active:scale-95 transition-all border border-[var(--color-muted)]/20"
                    title="Kurangi jumlah"
                  >
                    <Minus className="w-3 h-3" />
                  </button>

                  <span className="text-[13px] font-bold min-w-[16px] text-center text-[var(--color-charcoal)]">
                    {item.quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[var(--color-charcoal)] hover:bg-[var(--color-gold)]/30 active:scale-95 transition-all border border-[var(--color-muted)]/20"
                    title="Tambah jumlah"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Subtotal Card */}
          <div className="bg-white p-4 rounded-[16px] border border-[var(--color-muted)]/15 shadow-sm space-y-2">
            <div className="flex justify-between items-center text-[13px] text-[var(--color-charcoal-soft)]">
              <span>Total Item:</span>
              <span className="font-bold text-[var(--color-charcoal)]">{totalItems} pcs</span>
            </div>
            <div className="flex justify-between items-center text-[15px] font-bold border-t border-[var(--color-muted)]/15 pt-2">
              <span className="text-[var(--color-charcoal)]">Total Pesanan:</span>
              <span className="text-[var(--color-gold-dark)] text-[18px]">
                Rp {totalPrice.toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-[20px] text-center space-y-4 border border-[var(--color-muted)]/15 shadow-sm my-6">
          <div className="w-16 h-16 rounded-full bg-[#FFF9E6] flex items-center justify-center mx-auto border border-[var(--color-gold)]/40">
            <ShoppingBag className="w-8 h-8 text-[var(--color-gold-dark)]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-[16px] font-bold text-[var(--color-charcoal)] font-display">
              Keranjang Anda Kosong
            </h3>
            <p className="text-[13px] text-[var(--color-charcoal-soft)] max-w-xs mx-auto">
              Yuk, jelajahi berbagai varian rasa stik keju Bon Giri dan tambahkan ke keranjang!
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

      {/* Suggestion CTA */}
      <div className="bg-[#FFFEF3] p-4 rounded-[16px] border border-[var(--color-gold)]/30">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h4 className="text-[13px] font-bold text-[var(--color-charcoal)]">
              Ingin tambah varian rasa lain?
            </h4>
            <p className="text-[11px] text-[var(--color-charcoal-soft)]">
              Cek varian Original, Balado, BBQ, dan Rumput Laut
            </p>
          </div>
          <Link
            href="/katalog"
            className="text-[12px] font-bold text-[var(--color-navy)] flex items-center gap-1 hover:underline shrink-0"
          >
            Katalog <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Sticky Bottom Checkout Action */}
      {!isEmpty && (
        <div className="fixed bottom-[72px] left-1/2 -translate-x-1/2 w-full max-w-[480px] px-4 pb-4 z-40 bg-gradient-to-t from-[#FFF9E6] via-[#FFF9E6]/95 to-transparent pt-4">
          <WhatsAppOrderButton
            items={cart.map((i) => ({
              name: i.name,
              quantity: i.quantity,
              price: i.price,
            }))}
            totalPrice={totalPrice}
            waNumber={waNumber}
            variant="full"
          />
        </div>
      )}
    </div>
  );
}
