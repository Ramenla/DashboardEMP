import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppstoreOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const { Sider } = Layout;

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  // Hooks untuk navigasi interaktif
  const navigate = useNavigate();
  const location = useLocation();

  // Daftar Menu Sidebar
  const items = [
    {
      key: '/dashboard',
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
    <Sider
      width={210}
      theme="light"
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      trigger={null} // Hilangkan trigger default di bawah
      style={{ position: 'relative' }} // Untuk positioning tombol custom
    >
      {/* Header Section - Icon Minimize */}
      <div style={{
        height: 48,
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between', // Center saat collapsed
        paddingRight: collapsed ? 0 : 16,
        paddingLeft: collapsed ? 0 : 16,
        borderBottom: '1px solid #f0f0f0'
      }}>
        {/* Tulisan Menu - Hilang saat collapsed */}
        {!collapsed && (
          <h2 style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            margin: 0,
            fontSize: 20,
            fontWeight: 600,
            color: '#1f2937'
          }}>Menu</h2>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            padding: 6,
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.3s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#f0f0f0'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ?
            <ChevronRight size={20} color="#666" /> :
            <ChevronLeft size={20} color="#666" />
          }
        </button>
      </div>

      <Menu
        mode="inline"
        // Menandai menu mana yang aktif berdasarkan URL saat ini
        selectedKeys={[location.pathname]}
        style={{ height: 'calc(100% - 48px)', borderRight: 0, paddingTop: 8 }}
        items={items}
        // Fungsi ketika menu diklik: Pindah Halaman
        onClick={(item) => navigate(item.key)}
      />
    </Sider>
  );
};

export default Sidebar;