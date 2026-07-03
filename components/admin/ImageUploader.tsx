"use client";

import { useRef, useState } from "react";
import Image from "next/image";

interface Props {
  images: string[];
  onChange: (urls: string[]) => void;
  max?: number;
}

export function ImageUploader({ images, onChange, max = 5 }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFiles(files: FileList) {
    if (images.length >= max) return;
    setUploading(true);
    setError("");
    const newUrls: string[] = [];

    for (const file of Array.from(files)) {
      if (images.length + newUrls.length >= max) break;
      if (!file.type.startsWith("image/")) continue;

      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();

      if (data.url) {
        newUrls.push(data.url);
      } else {
        setError(data.error ?? "อัปโหลดไม่สำเร็จ");
      }
    }

    onChange([...images.filter(Boolean), ...newUrls]);
    setUploading(false);
  }

  function remove(i: number) {
    onChange(images.filter((_, idx) => idx !== i));
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Previews */}
      {images.filter(Boolean).length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {images.filter(Boolean).map((url, i) => (
            <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-[#333] group">
              <Image src={url} alt="" fill className="object-cover" sizes="80px" />
              <button
                type="button"
                onClick={() => remove(i)}
                className="absolute top-0.5 right-0.5 bg-red-500 text-white text-xs w-5 h-5 rounded-full hidden group-hover:flex items-center justify-center"
              >
                ×
              </button>
              {i === 0 && (
                <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-[9px] text-center text-white py-0.5">
                  หลัก
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload zone */}
      {images.filter(Boolean).length < max && (
        <div
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-[#333] hover:border-[#F5C842] rounded-lg p-5 text-center cursor-pointer transition-colors group"
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-1">
              <div className="w-6 h-6 border-2 border-[#F5C842] border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-gray-500">กำลังอัปโหลด...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1 text-gray-600 group-hover:text-gray-400 transition-colors">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-xs font-medium">คลิกหรือลากรูปมาวาง</p>
              <p className="text-[10px] text-gray-700">JPG, PNG, WEBP · สูงสุด {max} รูป</p>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-400">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />
    </div>
  );
}
