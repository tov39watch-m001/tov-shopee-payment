"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { StarRating } from "@/components/ui/StarRating";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";

type Product = {
  id: string; name: string; slug: string;
  description: string; ingredients?: string | null; howToUse?: string | null;
  price: number; originalPrice?: number | null;
  stock: number; sold: number; images: string[];
  badge?: string | null; rating: number; reviewCount: number;
  size?: string | null;
  category: { name: string; slug: string };
};

type Tab = "description" | "howToUse" | "ingredients";

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [mainImg, setMainImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<Tab>("description");
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    fetch(`/api/products/${slug}`).then((r) => r.json()).then(setProduct);
  }, [slug]);

  if (!product) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-600">กำลังโหลด...</div>;
  }

  function handleAddToCart() {
    addItem({ id: product!.id, name: product!.name, price: product!.price, image: product!.images[0] ?? "", size: product!.size }, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  const tabs: { key: Tab; label: string; content?: string | null }[] = [
    { key: "description", label: "รายละเอียด", content: product.description },
    { key: "howToUse", label: "วิธีใช้", content: product.howToUse },
    { key: "ingredients", label: "ส่วนผสม", content: product.ingredients },
  ];

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-600 mb-6 flex items-center gap-2 flex-wrap">
        <Link href="/" className="hover:text-[#F5C842] transition-colors">หน้าหลัก</Link>
        <span>/</span>
        <Link href={`/products?category=${product.category.slug}`} className="hover:text-[#F5C842] transition-colors">{product.category.name}</Link>
        <span>/</span>
        <span className="text-gray-400 truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Gallery */}
        <div className="flex flex-col gap-3">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#1F1F1F] border border-[#2E2E2E]">
            <Image
              src={product.images[mainImg] ?? "https://placehold.co/400x400/1f1f1f/F5C842?text=TOV"}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            {product.badge && <div className="absolute top-3 left-3"><Badge badge={product.badge} /></div>}
            {discount > 0 && (
              <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">-{discount}%</div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setMainImg(i)}
                  className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${i === mainImg ? "border-[#F5C842]" : "border-[#2E2E2E] hover:border-gray-500"}`}
                >
                  <Image src={img} alt="" fill className="object-cover" sizes="64px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-white leading-snug">{product.name}</h1>
          <StarRating rating={product.rating} reviewCount={product.reviewCount} />

          {/* Price */}
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="text-3xl font-black text-[#F5C842]">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <>
                <span className="text-lg text-gray-600 line-through">{formatPrice(product.originalPrice)}</span>
                <span className="text-sm text-red-400 font-bold">ลด {discount}%</span>
              </>
            )}
          </div>

          {product.size && (
            <div className="inline-flex items-center gap-2 bg-[#1F1F1F] border border-[#2E2E2E] rounded-lg px-3 py-1.5 w-fit">
              <span className="text-xs text-gray-500">ขนาด</span>
              <span className="text-sm font-medium text-white">{product.size}</span>
            </div>
          )}

          {/* Stock */}
          <div className={`flex items-center gap-2 text-sm font-medium ${product.stock < 20 ? "text-red-400" : "text-green-400"}`}>
            <span className={`w-2 h-2 rounded-full ${product.stock < 20 ? "bg-red-400" : "bg-green-400"}`} />
            {product.stock < 20 ? `เหลือเพียง ${product.stock} ชิ้น` : `มีสินค้า ${product.stock} ชิ้น`}
          </div>

          {/* Qty */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">จำนวน</span>
            <div className="flex items-center bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl overflow-hidden">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:bg-[#2E2E2E] hover:text-white transition-colors">−</button>
              <span className="w-12 text-center font-bold text-white">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:bg-[#2E2E2E] hover:text-white transition-colors">+</button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3 mt-1">
            <button
              onClick={handleAddToCart}
              className="w-full bg-[#F5C842] hover:bg-[#e0b530] active:scale-95 text-black font-bold py-3.5 rounded-xl transition-all min-h-[44px] text-sm"
            >
              {added ? "✓ เพิ่มในตะกร้าแล้ว!" : "เพิ่มในตะกร้า"}
            </button>
            <Link
              href="/checkout"
              className="w-full bg-[#1F1F1F] hover:bg-[#2E2E2E] border border-[#2E2E2E] hover:border-[#F5C842] text-white font-bold py-3.5 rounded-xl transition-all text-center min-h-[44px] flex items-center justify-center text-sm"
            >
              สั่งซื้อทันที →
            </Link>
          </div>

          <p className="text-xs text-gray-600">ขายแล้ว {product.sold.toLocaleString()} ชิ้น</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-12">
        <div className="flex border-b border-[#2E2E2E] overflow-x-auto scrollbar-hide">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 -mb-px shrink-0 ${
                tab === t.key ? "border-[#F5C842] text-[#F5C842]" : "border-transparent text-gray-500 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="bg-[#161616] border border-t-0 border-[#2E2E2E] rounded-b-xl p-6 text-sm text-gray-400 leading-relaxed min-h-[120px]">
          {tabs.find((t) => t.key === tab)?.content ?? <span className="text-gray-600">ไม่มีข้อมูล</span>}
        </div>
      </div>
    </div>
  );
}
