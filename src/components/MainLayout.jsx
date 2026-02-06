import React, { useState } from 'react';
import { Layout, Menu, Typography } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom'; // <--- Import Hooks Navigasi
import {
  AppstoreOutlined,
  BarChartOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  
  // Hooks agar menu bisa interaktif
  const navigate = useNavigate();
  const location = useLocation();

  // Daftar Menu Sidebar
  const items = [
    {
      key: '/dashboard', // Key harus sama dengan URL di App.jsx
      icon: <AppstoreOutlined />,
      label: 'Project Posture',
    },
    {
      key: '/progress',
      icon: <BarChartOutlined />,
      label: 'Project Progress',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      
      {/* HEADER ATAS */}
      <Header 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          padding: '0 24px',
          background: '#001529', // Warna Navy Gelap
          zIndex: 10
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Logo Placeholder */}
          <div style={{ width: 32, height: 32, background: '#1890ff', borderRadius: 4 }}></div>
          <Text strong style={{ color: '#fff', fontSize: 18 }}>Integrated Operation Center EMP</Text>
        </div>
        
        <Text style={{ color: 'rgba(255,255,255,0.65)' }}>Selasa, 27 Januari 2026</Text>
      </Header>

      <Layout>
        {/* SIDEBAR KIRI */}
        <Sider 
          width={240} 
          theme="light" 
          collapsible 
          collapsed={collapsed} 
          onCollapse={(value) => setCollapsed(value)}
        >
          <Menu
            mode="inline"
            // Menandai menu mana yang aktif berdasarkan URL saat ini
            selectedKeys={[location.pathname]} 
            style={{ height: '100%', borderRight: 0, paddingTop: 16 }}
            items={items}
            // Fungsi ketika menu diklik: Pindah Halaman
            onClick={(item) => navigate(item.key)} 
          />
        </Sider>

        {/* AREA KONTEN TENGAH */}
        <Layout style={{ padding: '24px' }}>
          <Content
            style={{
              margin: 0,
              minHeight: 280,
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default MainLayout;