"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { useCartStore } from "@/store/cartStore";

const CATEGORIES = [
  { name: "ทั้งหมด", slug: "" },
  { name: "แชมพู", slug: "shampoo" },
  { name: "ครีมนวด", slug: "conditioner" },
  { name: "ทรีทเมนต์", slug: "treatment" },
  { name: "สีผม", slug: "hair-color" },
  { name: "สไตลิ่ง", slug: "styling" },
];

function SearchBar() {
  const router = useRouter();
  const [q, setQ] = useState("");
  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (q.trim()) router.push(`/products?search=${encodeURIComponent(q.trim())}`);
  }
  return (
    <form onSubmit={handleSearch} className="flex-1 max-w-md hidden sm:flex h-8">
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="ค้นหาสินค้า..."
        className="w-full px-3 py-1 text-xs bg-[#1a1a1a] border border-[#333] rounded-l-md text-white placeholder-gray-600 focus:outline-none focus:border-[#F5C842]"
      />
      <button type="submit" className="px-3 bg-[#F5C842] text-black rounded-r-md hover:bg-[#e0b530] transition-colors">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </form>
  );
}

function CartButton() {
  const totalItems = useCartStore((s) => s.totalItems());
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <Link href="/cart" className="relative flex items-center justify-center w-9 h-9">
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      {mounted && totalItems > 0 && (
        <span className="absolute -top-0.5 -right-0.5 bg-[#F5C842] text-black text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center leading-none">
          {totalItems > 9 ? "9+" : totalItems}
        </span>
      )}
    </Link>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[#111] border-b border-[#222]">
      {/* Top bar */}
      <div className="max-w-7xl mx-auto px-3 h-11 flex items-center gap-3">
        <Link href="/" className="shrink-0 flex items-center gap-1.5">
          <span className="text-lg font-black text-[#F5C842] tracking-widest leading-none">TOV</span>
        </Link>
        <Suspense fallback={null}><SearchBar /></Suspense>
        <div className="ml-auto flex items-center gap-1">
          <Link href="/admin" className="text-[10px] text-gray-600 hover:text-white px-2 py-1 hidden sm:block transition-colors">แอดมิน</Link>
          <CartButton />
        </div>
      </div>

      {/* Category bar */}
      <div className="bg-[#0d0d0d] border-t border-[#222] overflow-x-auto scrollbar-hide">
        <div className="max-w-7xl mx-auto px-3 flex h-8">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={cat.slug ? `/products?category=${cat.slug}` : "/products"}
              className="shrink-0 px-3 text-xs text-gray-400 hover:text-[#F5C842] flex items-center whitespace-nowrap border-b-2 border-transparent hover:border-[#F5C842] transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
