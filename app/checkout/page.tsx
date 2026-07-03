"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";

const SHIPPING_THRESHOLD = 500;
const SHIPPING_FEE = 50;

const FIELDS = [
  { label: "ชื่อ-นามสกุล", field: "name", placeholder: "สมชาย ใจดี" },
  { label: "เบอร์โทรศัพท์", field: "phone", placeholder: "08X-XXX-XXXX", type: "tel" },
  { label: "ที่อยู่", field: "address", placeholder: "บ้านเลขที่ ซอย ถนน" },
  { label: "แขวง/ตำบล", field: "district", placeholder: "แขวง/ตำบล" },
  { label: "เขต/จังหวัด", field: "province", placeholder: "กรุงเทพมหานคร" },
  { label: "รหัสไปรษณีย์", field: "postalCode", placeholder: "10110" },
] as const;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice } = useCartStore();
  const subtotal = totalPrice();
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  const [form, setForm] = useState({ name: "", phone: "", address: "", district: "", province: "", postalCode: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams({ ...form, total: String(total) });
    router.push(`/payment?${params.toString()}`);
  }

  if (items.length === 0) { router.replace("/cart"); return null; }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">ข้อมูลการจัดส่ง</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-[#161616] border border-[#2E2E2E] rounded-xl p-6 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FIELDS.map(({ label, field, placeholder, type = "text" }) => (
              <div key={field} className={field === "address" ? "sm:col-span-2" : ""}>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">{label}</label>
                <input
                  type={type}
                  value={form[field]}
                  onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                  placeholder={placeholder}
                  required
                  className="w-full bg-[#1F1F1F] border border-[#2E2E2E] rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#F5C842] transition-colors"
                />
              </div>
            ))}
          </div>
          <button type="submit" className="w-full bg-[#F5C842] hover:bg-[#e0b530] text-black font-bold py-3 rounded-xl transition-colors mt-2 min-h-[44px]">
            ดำเนินการชำระเงิน →
          </button>
        </form>

        {/* Summary */}
        <div className="bg-[#161616] border border-[#2E2E2E] rounded-xl p-5 h-fit">
          <h2 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">สรุปคำสั่งซื้อ</h2>
          <div className="flex flex-col gap-2 mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-400 line-clamp-1 flex-1 mr-2">{item.name} ×{item.quantity}</span>
                <span className="text-white shrink-0">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-[#2E2E2E] pt-3 flex flex-col gap-2 text-sm">
            <div className="flex justify-between text-gray-400">
              <span>ค่าจัดส่ง</span>
              <span className={shipping === 0 ? "text-green-400" : "text-white"}>{shipping === 0 ? "ฟรี" : formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between font-bold text-base pt-1">
              <span className="text-white">ยอดรวม</span>
              <span className="text-[#F5C842]">{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
