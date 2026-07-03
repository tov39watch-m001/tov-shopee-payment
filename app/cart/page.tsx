"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";

const SHIPPING_THRESHOLD = 500;
const SHIPPING_FEE = 50;

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();
  const subtotal = totalPrice();
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <p className="text-6xl mb-4">🛒</p>
        <h2 className="text-xl font-bold text-white mb-2">ตะกร้าสินค้าว่างเปล่า</h2>
        <p className="text-gray-500 mb-8">เพิ่มสินค้าในตะกร้าเพื่อเริ่มสั่งซื้อ</p>
        <Link href="/products" className="bg-[#F5C842] text-black font-bold px-8 py-3 rounded-xl hover:bg-[#e0b530] transition-colors">
          ดูสินค้าทั้งหมด
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">ตะกร้าสินค้า</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          {items.map((item) => (
            <div key={item.id} className="bg-[#161616] border border-[#2E2E2E] rounded-xl p-4 flex gap-4">
              <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-[#1F1F1F]">
                <Image
                  src={item.image || "https://placehold.co/400x400/1f1f1f/F5C842?text=TOV"}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white line-clamp-2 text-sm">{item.name}</p>
                {item.size && <p className="text-xs text-gray-600 mt-0.5">{item.size}</p>}
                <p className="text-[#F5C842] font-bold mt-1 text-sm">{formatPrice(item.price)}</p>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <button onClick={() => removeItem(item.id)} className="text-gray-600 hover:text-red-400 transition-colors text-xl leading-none">×</button>
                <div className="flex items-center border border-[#2E2E2E] rounded-lg overflow-hidden">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:bg-[#2E2E2E] transition-colors">−</button>
                  <span className="w-9 text-center text-sm font-medium text-white">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:bg-[#2E2E2E] transition-colors">+</button>
                </div>
                <p className="text-sm font-bold text-white">{formatPrice(item.price * item.quantity)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-[#161616] border border-[#2E2E2E] rounded-xl p-5 h-fit sticky top-24">
          <h2 className="font-bold text-white mb-4">สรุปคำสั่งซื้อ</h2>
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between text-gray-400">
              <span>ราคาสินค้า</span>
              <span className="text-white">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>ค่าจัดส่ง</span>
              <span className={shipping === 0 ? "text-green-400 font-medium" : "text-white"}>
                {shipping === 0 ? "ฟรี" : formatPrice(shipping)}
              </span>
            </div>
            {subtotal < SHIPPING_THRESHOLD && (
              <p className="text-xs text-gray-600 bg-[#1F1F1F] rounded-lg p-2 text-center">
                ซื้อเพิ่ม <span className="text-[#F5C842]">{formatPrice(SHIPPING_THRESHOLD - subtotal)}</span> เพื่อรับส่งฟรี
              </p>
            )}
            <div className="border-t border-[#2E2E2E] pt-3 flex justify-between font-bold">
              <span className="text-white">ยอดรวม</span>
              <span className="text-[#F5C842] text-lg">{formatPrice(total)}</span>
            </div>
          </div>
          <Link
            href="/checkout"
            className="w-full mt-5 bg-[#F5C842] hover:bg-[#e0b530] text-black font-bold py-3 rounded-xl transition-colors min-h-[44px] flex items-center justify-center"
          >
            สั่งซื้อ →
          </Link>
          <Link href="/products" className="w-full mt-3 block text-center text-xs text-gray-600 hover:text-white transition-colors">
            ← ซื้อสินค้าต่อ
          </Link>
        </div>
      </div>
    </div>
  );
}
