import React from 'react';

const Header = () => {
  // Tanggal hardcoded sesuai gambar, nanti bisa pakai new Date()
  const currentDate = "Selasa, 27 Januari 2026";

  return (
    <header className="w-full h-16 bg-[#1e293b] text-white flex items-center justify-between px-6 shadow-md z-20 relative">
      {/* Bagian Kiri: Logo */}
      <div className="flex items-center gap-4">
        {/* Placeholder Logo 1 (SKK Migas) */}
        <div className="h-8 w-8 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">
          SKK
        </div>
        {/* Placeholder Logo 2 (EMP) */}
        <div className="h-8 w-16 bg-green-500 rounded flex items-center justify-center text-xs font-bold text-black">
          EMP
        </div>
      </div>

      {/* Bagian Tengah: Judul Dashboard */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <h1 className="text-xl font-bold tracking-wide">
          Integrated Operation Center EMP
        </h1>
      </div>

      {/* Bagian Kanan: Tanggal */}
      <div className="text-sm font-medium text-slate-300">
        {currentDate}
      </div>
    </header>
  );
};

export default Header;