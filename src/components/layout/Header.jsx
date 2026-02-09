import React from 'react';
import logoMigas from '../../assets/logo-skk-migas.png';
import logoEMP from '../../assets/logo-emp.png';

const Header = () => {
  // Tanggal otomatis update
  const [currentDate, setCurrentDate] = React.useState('');

  // Update tanggal setiap hari
  React.useEffect(() => {
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

    updateDate(); // Set initial date
    // Update date every minute (optional)
    const interval = setInterval(updateDate, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="flex items-center justify-between px-6 bg-[#001529] z-[1000] fixed top-0 left-0 w-full h-10 rounded-b-[10px]">
      {/* Bagian Kiri: Logo */}
      <div className="flex items-center gap-4">
        {/* Logo SKK Migas */}
        <div className="h-9 flex items-center">
          <img
            src={logoMigas}
            alt="SKK Migas"
            className="h-full w-auto"
          />
        </div>

        {/* Separator */}
        <div className="h-6 w-px bg-gray-400" />

        {/* Logo EMP */}
        <div className="h-9 flex items-center">
          <img
            src={logoEMP}
            alt="Energi Mega Persada"
            className="h-full w-auto"
          />
        </div>
      </div>

      {/* Bagian Tengah: Judul Dashboard */}
      <div className="flex-1 text-center">
        <h1 className="text-lg font-semibold text-white">
          Integrated Operation Center EMP
        </h1>
      </div>

      {/* Bagian Kanan: Tanggal */}
      <div className="text-xs text-[#cbd5f5]">
        {currentDate}
      </div>
    </header>
  );
};

export default Header;
