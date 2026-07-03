"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";

type Product = {
  id: string; name: string; slug: string;
  price: number; originalPrice?: number | null;
  images: string[]; badge?: string | null;
  rating: number; reviewCount: number;
  size?: string | null; sold: number;
};

const BADGE_STYLE: Record<string, string> = {
  SALE: "bg-red-500", HOT: "bg-orange-500", NEW: "bg-blue-500", BESTSELLER: "bg-[#F5C842] text-black",
};

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    addItem({ id: product.id, name: product.name, price: product.price, image: product.images[0] ?? "", size: product.size });
  }

  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  return (
    <Link href={`/products/${product.slug}`} className="group block bg-[#161616] border border-[#222] rounded-lg overflow-hidden hover:border-[#F5C842]/40 transition-colors">
      {/* Image */}
      <div className="relative aspect-square bg-[#1a1a1a] overflow-hidden">
        <Image
          src={product.images[0] || "https://placehold.co/400x400/1a1a1a/F5C842?text=TOV"}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />
        {product.badge && (
          <span className={`absolute top-1.5 left-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded text-white ${BADGE_STYLE[product.badge] ?? "bg-gray-600"}`}>
            {product.badge}
          </span>
        )}
        {discount > 0 && (
          <span className="absolute top-1.5 right-1.5 text-[9px] font-bold bg-red-500 text-white px-1 py-0.5 rounded">
            -{discount}%
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-2">
        <p className="text-xs text-white line-clamp-2 leading-tight mb-1 min-h-[2.5rem]">{product.name}</p>

        <div className="flex items-center gap-1 mb-1">
          <div className="flex">
            {[1,2,3,4,5].map(s => (
              <svg key={s} className={`w-2.5 h-2.5 ${s <= Math.round(product.rating) ? "text-[#F5C842]" : "text-gray-700"}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-[10px] text-gray-600">({product.reviewCount})</span>
        </div>

        <div className="flex items-baseline gap-1 mb-0.5">
          <span className="text-sm font-bold text-[#F5C842]">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-[10px] text-gray-600 line-through">{formatPrice(product.originalPrice)}</span>
          )}
        </div>

        <p className="text-[10px] text-gray-600 mb-1.5">ขายแล้ว {product.sold.toLocaleString()}</p>

        <button
          onClick={handleAdd}
          className="w-full bg-[#F5C842] hover:bg-[#e0b530] text-black text-xs font-bold py-1.5 rounded transition-colors active:scale-95"
        >
          + ตะกร้า
        </button>
      </div>
    </Link>
  );
}
