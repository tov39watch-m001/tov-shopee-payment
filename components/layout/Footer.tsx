export function Footer() {
  return (
    <footer className="bg-[#0d0d0d] border-t border-[#222] mt-6">
      <div className="max-w-7xl mx-auto px-3 py-6 grid grid-cols-3 gap-6">
        <div>
          <p className="text-sm font-black text-[#F5C842] tracking-widest mb-1">TOV</p>
          <p className="text-[10px] text-gray-600">Professional Hair Care<br />ส่งตรงจากโรงงาน</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">หมวดหมู่</p>
          <div className="flex flex-col gap-1">
            {["แชมพู", "ครีมนวด", "ทรีทเมนต์", "สีผม", "สไตลิ่ง"].map(c => (
              <span key={c} className="text-[10px] text-gray-600">{c}</span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">ติดต่อ</p>
          <div className="flex flex-col gap-1 text-[10px] text-gray-600">
            <span>📞 088-249-5154</span>
            <span>📧 info@tov.th</span>
            <span>🕐 จ–ศ 9:00–18:00</span>
          </div>
        </div>
      </div>
      <div className="border-t border-[#1a1a1a] py-2 text-center text-[10px] text-gray-700">
        © 2025 TOV Professional Hair Care
      </div>
    </footer>
  );
}
