"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { slugify } from "@/lib/utils";
import { ImageUploader } from "@/components/admin/ImageUploader";

type Category = { id: string; name: string };

const BADGES = ["", "NEW", "SALE", "HOT", "BESTSELLER"];

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", slug: "", description: "", ingredients: "", howToUse: "",
    price: "", originalPrice: "", stock: "0", size: "", badge: "",
    categoryId: "", images: [""],
  });

  useEffect(() => {
    fetch("/api/products").then((r) => r.json()).then((products) => {
      const cats = Array.from(
        new Map(products.map((p: any) => [p.category.id, p.category])).values()
      ) as Category[];
      setCategories(cats);
    });

    fetch(`/api/products`).then((r) => r.json()).then((products) => {
      const p = products.find((p: any) => p.id === id);
      if (p) {
        setForm({
          name: p.name, slug: p.slug, description: p.description,
          ingredients: p.ingredients ?? "", howToUse: p.howToUse ?? "",
          price: String(p.price), originalPrice: p.originalPrice ? String(p.originalPrice) : "",
          stock: String(p.stock), size: p.size ?? "", badge: p.badge ?? "",
          categoryId: p.categoryId, images: p.images.length ? p.images : [""],
        });
      }
    });
  }, [id]);

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch(`/api/admin/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: parseFloat(form.price),
        originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : null,
        stock: parseInt(form.stock),
        badge: form.badge || null,
        images: form.images.filter(Boolean),
      }),
    });
    router.push("/admin");
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-[#1A1A2E] mb-6">แก้ไขสินค้า</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-[#E8E8E8] p-6 flex flex-col gap-4">
        {[
          { label: "ชื่อสินค้า", field: "name", required: true },
          { label: "ขนาด (เช่น 500ml)", field: "size" },
          { label: "ราคา (฿)", field: "price", type: "number", required: true },
          { label: "ราคาเดิม (฿)", field: "originalPrice", type: "number" },
          { label: "สต็อก", field: "stock", type: "number", required: true },
        ].map(({ label, field, type = "text", required }) => (
          <div key={field}>
            <label className="text-sm font-medium text-gray-700 mb-1 block">{label}</label>
            <input
              type={type}
              value={(form as any)[field]}
              onChange={(e) => set(field, e.target.value)}
              required={required}
              className="w-full border border-[#E8E8E8] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C8860A]"
            />
          </div>
        ))}

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">หมวดหมู่</label>
          <select
            value={form.categoryId}
            onChange={(e) => set("categoryId", e.target.value)}
            required
            className="w-full border border-[#E8E8E8] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C8860A]"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">แบดจ์</label>
          <select
            value={form.badge}
            onChange={(e) => set("badge", e.target.value)}
            className="w-full border border-[#E8E8E8] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C8860A]"
          >
            {BADGES.map((b) => (
              <option key={b} value={b}>{b || "ไม่มี"}</option>
            ))}
          </select>
        </div>

        {["description", "howToUse", "ingredients"].map((field) => (
          <div key={field}>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              {field === "description" ? "รายละเอียด" : field === "howToUse" ? "วิธีใช้" : "ส่วนผสม"}
            </label>
            <textarea
              value={(form as any)[field]}
              onChange={(e) => set(field, e.target.value)}
              rows={3}
              className="w-full border border-[#E8E8E8] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C8860A] resize-none"
            />
          </div>
        ))}

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">รูปภาพสินค้า</label>
          <ImageUploader
            images={form.images}
            onChange={(urls) => setForm((f) => ({ ...f, images: urls }))}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.push("/admin")}
            className="flex-1 border border-[#E8E8E8] py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-[#C8860A] text-white font-bold py-2 rounded-lg hover:bg-[#a06c08] transition-colors text-sm disabled:opacity-50"
          >
            {loading ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
          </button>
        </div>
      </form>
    </div>
  );
}
