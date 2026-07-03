"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  sold: number;
  badge?: string | null;
  images: string[];
  category: { name: string };
};

const PASSWORD = "admin1234";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (authed) fetchProducts();
  }, [authed]);

  async function fetchProducts() {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  }

  async function handleDelete(id: string) {
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    setDeleteId(null);
    fetchProducts();
  }

  if (!authed) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-white rounded-xl border border-[#E8E8E8] p-8 w-full max-w-sm flex flex-col gap-4">
          <h1 className="text-xl font-bold text-[#1A1A2E] text-center">Admin Login</h1>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && pw === PASSWORD && setAuthed(true)}
            placeholder="รหัสผ่าน"
            className="border border-[#E8E8E8] rounded-lg px-4 py-2 focus:outline-none focus:border-[#F5C842] text-black bg-white"
          />
          <button
            onClick={() => pw === PASSWORD ? setAuthed(true) : alert("รหัสผ่านผิด")}
            className="bg-[#C8860A] text-white font-bold py-2 rounded-lg hover:bg-[#a06c08] transition-colors"
          >
            เข้าสู่ระบบ
          </button>
        </div>
      </div>
    );
  }

  const lowStock = products.filter((p) => p.stock < 10).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1A1A2E]">Admin Dashboard</h1>
        <div className="flex gap-2">
          <Link href="/admin/images" className="border border-[#F5C842] text-[#F5C842] text-sm font-bold px-4 py-2 rounded-lg hover:bg-[#F5C842]/10 transition-colors">
            🖼️ จัดการรูป
          </Link>
          <Link href="/admin/products/new" className="bg-[#F5C842] text-black font-bold px-4 py-2 rounded-lg hover:bg-[#e0b530] transition-colors text-sm">
            + เพิ่มสินค้า
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "สินค้าทั้งหมด", value: products.length, color: "text-[#1A1A2E]" },
          { label: "สินค้าใกล้หมด (< 10)", value: lowStock, color: "text-[#EE4D2D]" },
          { label: "ยอดขายรวม", value: products.reduce((s, p) => s + p.sold, 0).toLocaleString() + " ชิ้น", color: "text-green-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-lg border border-[#E8E8E8] p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-[#E8E8E8] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F5F5F5] border-b border-[#E8E8E8]">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">สินค้า</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">หมวด</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">ราคา</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">สต็อก</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">แบดจ์</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-[#E8E8E8] hover:bg-[#FFF8EC] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-[#FFF8EC] shrink-0">
                        <Image
                          src={p.images[0] ?? "https://placehold.co/400x400/f8f0e8/333?text=Product"}
                          alt={p.name}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                      <span className="font-medium text-[#1A1A2E] line-clamp-1">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{p.category.name}</td>
                  <td className="px-4 py-3 text-right font-medium">{formatPrice(p.price)}</td>
                  <td className={`px-4 py-3 text-right font-medium ${p.stock < 10 ? "text-[#EE4D2D]" : "text-[#1A1A2E]"}`}>
                    {p.stock}
                  </td>
                  <td className="px-4 py-3">
                    {p.badge ? <Badge badge={p.badge} /> : <span className="text-gray-400">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={`/admin/products/${p.id}/edit`}
                        className="text-xs px-3 py-1 border border-[#C8860A] text-[#C8860A] rounded-lg hover:bg-[#FFF8EC] transition-colors"
                      >
                        แก้ไข
                      </Link>
                      <button
                        onClick={() => setDeleteId(p.id)}
                        className="text-xs px-3 py-1 border border-[#EE4D2D] text-[#EE4D2D] rounded-lg hover:bg-red-50 transition-colors"
                      >
                        ลบ
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete confirm dialog */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4">
            <h3 className="font-bold text-[#1A1A2E] mb-2">ยืนยันการลบสินค้า</h3>
            <p className="text-sm text-gray-500 mb-6">การลบไม่สามารถย้อนกลับได้</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 border border-[#E8E8E8] py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 bg-[#EE4D2D] text-white font-bold py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                ลบ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
