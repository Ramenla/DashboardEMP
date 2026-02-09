import React from 'react';
import { Layout } from 'antd';
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
    <header
      style=
      {
        {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          background: '#001529', // Warna Navy Gelap
          zIndex: 1000,
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: 40, // Explicit height
          borderRadius: '0 0 10px 10px',
        }
      }
    >
      {/* Bagian Kiri: Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>

        {/* Logo SKK Migas */}
        <div style={{ height: 36, display: 'flex', alignItems: 'center' }}>
          <img
            src={logoMigas}
            alt="SKK Migas"
            style={{ height: '100%', width: 'auto' }}
          />
        </div>

        {/* Separator */}
        <div style={{ height: 24, width: 1, background: '#9ca3af' }} />

        {/* Logo EMP */}
        <div style={{ height: 36, display: 'flex', alignItems: 'center' }}>
          <img
            src={logoEMP}
            alt="Energi Mega Persada"
            style={{ height: '100%', width: 'auto' }}
          />
        </div>
      </div>

      {/* Bagian Tengah: Judul Dashboard */}
      <div style={{ flex: 1, textAlign: 'center' }}>
        <h1 style={{ fontSize: 18, fontWeight: 1600, color: 'white' }}>
          Integrated Operation Center EMP
        </h1>
      </div>

      {/* Bagian Kanan: Tanggal */}
      <div style={{ fontSize: 12, color: '#cbd5f5' }}>
        {currentDate}
      </div>
    </header>
  );
};

export default Header;
