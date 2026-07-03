import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ui/ProductCard";

const CATS = [
  { name: "แชมพู", slug: "shampoo", icon: "🧴" },
  { name: "ครีมนวด", slug: "conditioner", icon: "💆" },
  { name: "ทรีทเมนต์", slug: "treatment", icon: "✨" },
  { name: "สีผม", slug: "hair-color", icon: "🎨" },
  { name: "สไตลิ่ง", slug: "styling", icon: "💅" },
];

export default async function HomePage() {
  const [bestsellers, newProducts, saleProducts] = await Promise.all([
    prisma.product.findMany({ where: { isActive: true, badge: "BESTSELLER" }, orderBy: { sold: "desc" }, take: 10 }),
    prisma.product.findMany({ where: { isActive: true, badge: "NEW" }, orderBy: { createdAt: "desc" }, take: 10 }),
    prisma.product.findMany({ where: { isActive: true, badge: "SALE" }, orderBy: { sold: "desc" }, take: 10 }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-3 py-3 flex flex-col gap-4">

      {/* Hero — compact */}
      <div className="bg-gradient-to-r from-[#1a1a1a] to-[#0d0d0d] border border-[#222] rounded-lg px-5 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <p className="text-[10px] text-[#F5C842] uppercase tracking-widest mb-1">Factory Direct · Professional</p>
          <h1 className="text-xl font-black text-white leading-tight">ผลิตภัณฑ์ซาลอน<br /><span className="text-[#F5C842]">ราคาโรงงาน</span></h1>
          <p className="text-xs text-gray-500 mt-1">ส่งตรงจากโรงงาน คุณภาพมืออาชีพ</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Link href="/products" className="bg-[#F5C842] text-black text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#e0b530] transition-colors">ดูสินค้า</Link>
          <Link href="/products?badge=SALE" className="border border-[#333] text-white text-xs font-medium px-4 py-2 rounded-lg hover:border-[#F5C842] transition-colors">ลดราคา 🏷️</Link>
        </div>
      </div>

      {/* USP */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { icon: "🏭", t: "ผลิตเอง" },
          { icon: "🚚", t: "ส่งด่วน 1-2 วัน" },
          { icon: "✅", t: "รับประกัน 7 วัน" },
        ].map(u => (
          <div key={u.t} className="bg-[#161616] border border-[#222] rounded-lg py-2 flex flex-col items-center gap-0.5">
            <span className="text-base">{u.icon}</span>
            <span className="text-[10px] text-gray-400 font-medium">{u.t}</span>
          </div>
        ))}
      </div>

      {/* Categories */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-white">หมวดหมู่</span>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {CATS.map(cat => (
            <Link key={cat.slug} href={`/products?category=${cat.slug}`}
              className="bg-[#161616] border border-[#222] rounded-lg py-2.5 flex flex-col items-center gap-1 hover:border-[#F5C842] transition-colors group">
              <span className="text-xl">{cat.icon}</span>
              <span className="text-[10px] text-gray-400 group-hover:text-[#F5C842] transition-colors">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Bestsellers */}
      {bestsellers.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-white">🔥 ขายดี</span>
            <Link href="/products?badge=BESTSELLER" className="text-[10px] text-[#F5C842]">ดูทั้งหมด →</Link>
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {bestsellers.map(p => (
              <div key={p.id} className="shrink-0 w-36">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New */}
      {newProducts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-white">✨ สินค้าใหม่</span>
            <Link href="/products?badge=NEW" className="text-[10px] text-[#F5C842]">ดูทั้งหมด →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {newProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}

      {/* Sale */}
      {saleProducts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-white">🏷️ ลดราคา</span>
            <Link href="/products?badge=SALE" className="text-[10px] text-[#F5C842]">ดูทั้งหมด →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {saleProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}
