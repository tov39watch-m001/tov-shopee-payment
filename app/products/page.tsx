import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ui/ProductCard";
import Link from "next/link";

const CATEGORIES = [
  { name: "ทั้งหมด", slug: "" },
  { name: "แชมพู", slug: "shampoo" },
  { name: "ครีมนวด", slug: "conditioner" },
  { name: "ทรีทเมนต์", slug: "treatment" },
  { name: "สีผม", slug: "hair-color" },
  { name: "สไตลิ่ง", slug: "styling" },
];

const BADGES = [
  { label: "ทั้งหมด", value: "" },
  { label: "ขายดี", value: "BESTSELLER" },
  { label: "ใหม่", value: "NEW" },
  { label: "ลดราคา", value: "SALE" },
  { label: "Hot", value: "HOT" },
];

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string; badge?: string };
}) {
  const { category, search, badge } = searchParams;

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(category && { category: { slug: category } }),
      ...(search && { name: { contains: search, mode: "insensitive" } }),
      ...(badge && { badge }),
    },
    include: { category: true },
    orderBy: { sold: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-3 py-3">
      {/* Filters */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-2 mb-2">
        {CATEGORIES.map(cat => (
          <Link key={cat.slug}
            href={cat.slug ? `/products?category=${cat.slug}` : "/products"}
            className={`shrink-0 px-3 py-1 rounded text-xs font-medium border transition-colors ${
              category === cat.slug || (!category && !cat.slug && !badge && !search)
                ? "bg-[#F5C842] text-black border-[#F5C842]"
                : "bg-[#161616] text-gray-400 border-[#222] hover:border-[#F5C842] hover:text-white"
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>
      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-2 mb-3">
        {BADGES.map(b => (
          <Link key={b.value}
            href={b.value ? `/products?badge=${b.value}` : "/products"}
            className={`shrink-0 px-3 py-0.5 rounded text-[10px] font-medium border transition-colors ${
              badge === b.value || (!badge && !b.value && !category && !search)
                ? "bg-white text-black border-white"
                : "bg-transparent text-gray-500 border-[#333] hover:text-white"
            }`}
          >
            {b.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-white">
          {search ? `ผลการค้นหา "${search}"` : "สินค้าทั้งหมด"}
        </span>
        <span className="text-[10px] text-gray-600">{products.length} รายการ</span>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16 text-gray-600">
          <p className="text-3xl mb-2">🔍</p>
          <p className="text-sm text-gray-500 mb-3">ไม่พบสินค้า</p>
          <Link href="/products" className="text-xs text-[#F5C842] hover:underline">ดูสินค้าทั้งหมด</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
