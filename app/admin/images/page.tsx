"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Product = { id: string; name: string; images: string[]; };

export default function ImagePickerPage() {
  const [images, setImages] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [targetId, setTargetId] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/assets").then(r => r.json()).then(setImages);
    fetch("/api/products").then(r => r.json()).then(setProducts);
  }, []);

  function toggle(img: string) {
    setSelected(s => s.includes(img) ? s.filter(x => x !== img) : [...s, img]);
  }

  async function save() {
    if (!targetId || selected.length === 0) return;
    setSaving(true);
    await fetch(`/api/admin/products/${targetId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ images: selected }),
    });
    setSaving(false);
    setDone(true);
    setSelected([]);
    setTimeout(() => setDone(false), 2000);
    fetch("/api/products").then(r => r.json()).then(setProducts);
  }

  const filtered = search
    ? images.filter(img => img.toLowerCase().includes(search.toLowerCase()))
    : images;

  const currentProduct = products.find(p => p.id === targetId);

  return (
    <div className="max-w-7xl mx-auto px-3 py-4">
      <h1 className="text-sm font-bold text-white mb-4">🖼️ Image Picker — เลือกรูปให้สินค้า</h1>

      {/* Controls */}
      <div className="bg-[#161616] border border-[#222] rounded-lg p-3 mb-4 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-48">
          <label className="text-[10px] text-gray-500 uppercase mb-1 block">เลือกสินค้า</label>
          <select
            value={targetId}
            onChange={e => { setTargetId(e.target.value); setSelected([]); }}
            className="w-full bg-[#0d0d0d] border border-[#333] rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[#F5C842]"
          >
            <option value="">-- เลือกสินค้า --</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-40">
          <label className="text-[10px] text-gray-500 uppercase mb-1 block">ค้นหารูป</label>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="ชื่อไฟล์..."
            className="w-full bg-[#0d0d0d] border border-[#333] rounded px-2 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#F5C842]"
          />
        </div>

        <div className="flex items-center gap-2">
          {selected.length > 0 && (
            <span className="text-[10px] text-[#F5C842]">เลือก {selected.length} รูป</span>
          )}
          <button
            onClick={save}
            disabled={!targetId || selected.length === 0 || saving}
            className="bg-[#F5C842] disabled:opacity-30 hover:bg-[#e0b530] text-black text-xs font-bold px-4 py-1.5 rounded transition-colors"
          >
            {saving ? "กำลังบันทึก..." : done ? "✓ บันทึกแล้ว" : "บันทึก"}
          </button>
          <button onClick={() => setSelected([])} className="text-[10px] text-gray-600 hover:text-white">ล้าง</button>
        </div>
      </div>

      {/* Current product images */}
      {currentProduct && currentProduct.images.length > 0 && (
        <div className="mb-3">
          <p className="text-[10px] text-gray-500 mb-1">รูปปัจจุบันของ "{currentProduct.name}"</p>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {currentProduct.images.map((img, i) => (
              <div key={i} className="relative shrink-0 w-14 h-14 rounded border border-[#F5C842]/40 overflow-hidden bg-[#1a1a1a]">
                <Image src={img} alt="" fill className="object-cover" sizes="56px" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <p className="text-[10px] text-gray-600 mb-2">{filtered.length} รูป</p>

      {/* Image grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-1.5">
        {filtered.map((img) => {
          const isSelected = selected.includes(img);
          const idx = selected.indexOf(img);
          return (
            <button
              key={img}
              onClick={() => toggle(img)}
              className={`relative aspect-square rounded overflow-hidden border-2 transition-all ${
                isSelected ? "border-[#F5C842] scale-95" : "border-transparent hover:border-[#555]"
              }`}
            >
              <Image src={img} alt="" fill className="object-cover" sizes="10vw" />
              {isSelected && (
                <div className="absolute inset-0 bg-[#F5C842]/20 flex items-center justify-center">
                  <span className="bg-[#F5C842] text-black text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                    {idx + 1}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
