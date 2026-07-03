"use client";

import { useEffect, useRef } from "react";
import generatePayload from "promptpay-qr";
import QRCode from "qrcode";

export function PromptPayQR({ amount }: { amount: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const payload = generatePayload("0882495154", { amount });
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, payload, {
        width: 240,
        margin: 2,
        color: { dark: "#1A1A2E", light: "#ffffff" },
      });
    }
  }, [amount]);

  return (
    <div className="flex flex-col items-center gap-3">
      <canvas ref={canvasRef} className="rounded-xl border-4 border-[#C8860A]" />
      <p className="text-sm text-gray-500">สแกนจ่ายผ่าน PromptPay</p>
      <p className="text-xs text-gray-400">เบอร์ 088-249-5154</p>
    </div>
  );
}
