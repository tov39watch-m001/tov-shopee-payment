export function formatPrice(price: number): string {
  return `฿${price.toLocaleString("th-TH")}`;
}

export function slugify(text: string): string {
  // สร้าง unique slug จากชื่อ + timestamp เพื่อรองรับภาษาไทย
  const base = text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
  const suffix = Date.now().toString(36);
  return base || `product-${suffix}`;
}

export const BADGE_COLORS: Record<string, string> = {
  SALE: "bg-red-500 text-white",
  HOT: "bg-orange-500 text-white",
  NEW: "bg-blue-500 text-white",
  BESTSELLER: "bg-[#F5C842] text-black",
};

export const BADGE_LABELS: Record<string, string> = {
  SALE: "ลดราคา",
  HOT: "ขายดี",
  NEW: "ใหม่",
  BESTSELLER: "ขายดีที่สุด",
};
