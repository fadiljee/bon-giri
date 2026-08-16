"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Plus, Minus, ShoppingBag, Check } from "lucide-react";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    image?: string;
    categoryName?: string;
  };
  variant?: "card-icon" | "detail-action";
  disabled?: boolean;
}

export default function AddToCartButton({
  product,
  variant = "card-icon",
  disabled = false,
}: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;

    addToCart(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image: product.image || "/images/products/original.webp",
        categoryName: product.categoryName || "Stik Keju",
      },
      variant === "detail-action" ? quantity : 1
    );

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  if (variant === "card-icon") {
    return (
      <button
        onClick={handleAdd}
        disabled={disabled}
        type="button"
        title="Tambah ke Keranjang"
        className={`absolute bottom-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
          disabled
            ? "bg-[var(--color-muted)]/20 text-[var(--color-muted)] cursor-not-allowed"
            : isAdded
            ? "bg-[var(--color-success)] text-white scale-110"
            : "bg-[var(--color-muted)]/10 text-[var(--color-charcoal)] hover:bg-[var(--color-gold)] active:scale-95"
        }`}
      >
        {isAdded ? (
          <Check className="w-4 h-4" />
        ) : (
          <span className="text-[18px] font-medium leading-none mb-0.5">+</span>
        )}
      </button>
    );
  }

  // Detail Page Action with Quantity Controls
  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Quantity picker */}
      <div className="flex items-center justify-between bg-[var(--color-cream-soft)] p-2.5 rounded-[14px] border border-[var(--color-gold)]/40">
        <span className="text-[13px] font-bold text-[var(--color-charcoal)] pl-2">
          Jumlah Pesanan:
        </span>
        <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-full border border-[var(--color-muted)]/20 shadow-sm">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={disabled || quantity <= 1}
            className="w-7 h-7 rounded-full flex items-center justify-center text-[var(--color-charcoal)] hover:bg-[var(--color-gold)]/20 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="text-[14px] font-bold text-[var(--color-charcoal)] min-w-[20px] text-center">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            disabled={disabled}
            className="w-7 h-7 rounded-full flex items-center justify-center text-[var(--color-charcoal)] hover:bg-[var(--color-gold)]/20 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Add to Cart button */}
      <button
        type="button"
        onClick={handleAdd}
        disabled={disabled}
        className={`w-full py-3.5 px-4 rounded-full font-bold text-[14px] flex items-center justify-center gap-2 border-2 border-[var(--color-gold)] text-[var(--color-charcoal)] hover:bg-[var(--color-gold)] transition-all shadow-sm active:scale-[0.99] ${
          disabled
            ? "opacity-40 cursor-not-allowed hover:bg-transparent"
            : isAdded
            ? "bg-[var(--color-success)] border-[var(--color-success)] text-white"
            : "bg-white hover:bg-[var(--color-gold)]"
        }`}
      >
        {isAdded ? (
          <>
            <Check className="w-5 h-5" />
            Ditambahkan ({quantity}x)
          </>
        ) : (
          <>
            <ShoppingBag className="w-5 h-5" />
            + Tambah ke Keranjang ({quantity}x)
          </>
        )}
      </button>
    </div>
  );
}
