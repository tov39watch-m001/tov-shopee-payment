"use client";

import { useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { PromptPayQR } from "@/components/ui/PromptPayQR";

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const clearCart = useCartStore((s) => s.clearCart);

  const total = parseFloat(searchParams.get("total") ?? "0");
  const name = searchParams.get("name") ?? "";

  const [slip, setSlip] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSlip(file);
    setPreview(URL.createObjectURL(file));
  }

  function handleConfirm() {
    if (!slip) return alert("กรุณาแนบสลิปการโอนเงิน");
    clearCart();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-5 py-24 text-center max-w-md mx-auto px-4">
        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center text-4xl">✅</div>
        <h2 className="text-2xl font-bold text-white">ขอบคุณสำหรับคำสั่งซื้อ!</h2>
        <p className="text-gray-400">เราจะตรวจสอบสลิปและจัดส่งสินค้าภายใน 1–2 วันทำการ</p>
        <div className="bg-[#161616] border border-[#2E2E2E] rounded-xl px-6 py-4 w-full text-sm text-gray-400">
          ชื่อผู้รับ: <span className="text-white font-medium">{name}</span>
        </div>
        <button onClick={() => router.push("/")} className="bg-[#F5C842] hover:bg-[#e0b530] text-black font-bold px-10 py-3 rounded-xl transition-colors w-full">
          กลับหน้าหลัก
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8 flex flex-col gap-5">
      <h1 className="text-2xl font-bold text-white text-center">ชำระเงิน</h1>

      {/* QR */}
      <div className="bg-[#161616] border border-[#2E2E2E] rounded-xl p-6 flex flex-col items-center gap-4">
        <PromptPayQR amount={total} />
        <div className="text-center">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">ยอดที่ต้องชำระ</p>
          <p className="text-4xl font-black text-[#F5C842]">{formatPrice(total)}</p>
        </div>
        <div className="w-full bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl p-3 text-center">
          <p className="text-xs text-gray-500 mb-0.5">PromptPay</p>
          <p className="font-bold text-white tracking-widest">088-249-5154</p>
        </div>
      </div>

      {/* Slip upload */}
      <div className="bg-[#161616] border border-[#2E2E2E] rounded-xl p-5 flex flex-col gap-4">
        <h2 className="font-bold text-white text-sm">แนบสลิปการโอนเงิน</h2>
        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-[#2E2E2E] hover:border-[#F5C842] rounded-xl p-8 text-center cursor-pointer transition-colors group"
        >
          {preview ? (
            <img src={preview} alt="slip" className="max-h-52 mx-auto rounded-lg object-contain" />
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-600 group-hover:text-gray-400 transition-colors">
              <span className="text-4xl">📎</span>
              <p className="text-sm">กดเพื่อเลือกรูปสลิป</p>
              <p className="text-xs">JPG, PNG</p>
            </div>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        <button
          onClick={handleConfirm}
          className="w-full bg-[#F5C842] hover:bg-[#e0b530] text-black font-bold py-3 rounded-xl transition-colors min-h-[44px]"
        >
          ยืนยันการชำระเงิน ✓
        </button>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-gray-500">กำลังโหลด...</div>}>
      <PaymentContent />
    </Suspense>
  );
}
