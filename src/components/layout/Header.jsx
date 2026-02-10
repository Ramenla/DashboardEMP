import React from 'react';
import logoMigas from '../../assets/logo-skk-migas.png';
import logoEMP from '../../assets/logo-emp.png';

/**
 * komponen header yang menampilkan logo, judul aplikasi, dan tanggal saat ini
 * @returns {JSX.Element} header dengan logo SKK Migas, EMP, judul, dan tanggal updated otomatis
 */
const Header = () => {
  // state untuk menyimpan tanggal yang diformat
  const [currentDate, setCurrentDate] = React.useState('');

  // update tanggal setiap hari
  React.useEffect(() => {
    /**
     * fungsi untuk update tampilan tanggal dalam format indonesia
     * format: "hari, dd bulan yyyy" (contoh: "senin, 10 februari 2026")
     */
    const updateDate = () => {
      const date = new Date();
      const formattedDate = date.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      setCurrentDate(formattedDate);
    };

    updateDate(); // set initial date
    // update date every minute (optional)
    const interval = setInterval(updateDate, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="flex items-center justify-between px-6 bg-[#001529] z-[1000] fixed top-0 left-0 w-full h-10 rounded-b-[10px]">
      {/* bagian kiri: logo */}
      <div className="flex items-center gap-4">
        {/* logo SKK Migas */}
        <div className="h-9 flex items-center">
          <img
            src={logoMigas}
            alt="SKK Migas"
            className="h-full w-auto"
          />
        </div>

        {/* separator */}
        <div className="h-6 w-px bg-gray-400" />

        {/* logo EMP */}
        <div className="h-9 flex items-center">
          <img
            src={logoEMP}
            alt="Energi Mega Persada"
            className="h-full w-auto"
          />
        </div>
      </div>

      {/* bagian tengah: judul dashboard */}
      <div className="flex-1 text-center">
        <h1 className="text-lg font-semibold text-white">
          Integrated Operation Center EMP
        </h1>
      </div>

      {/* bagian kanan: tanggal */}
      <div className="text-xs text-[#cbd5f5]">
        {currentDate}
      </div>
    </header>
  );
};

export default Header;
