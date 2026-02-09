import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppstoreOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const { Sider } = Layout;

const Sidebar = ({ collapsed, onCollapse }) => {

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
      onCollapse={onCollapse}
      trigger={null}
      className="fixed left-0 h-screen z-[100] top-0 pt-12"
    >
      {/* Header Section - Icon Minimize */}
      <div className={`h-12 flex items-center border-b border-gray-100 ${collapsed ? 'justify-center px-0' : 'justify-between px-4'}`}>
        {/* Tulisan Menu - Hilang saat collapsed */}
        {!collapsed && (
          <h2 className="flex items-center justify-start m-0 text-xl font-semibold text-gray-800">
            Menu
          </h2>
        )}

        <button
          onClick={() => onCollapse(!collapsed)}
          className="border-none bg-transparent cursor-pointer p-1.5 rounded flex items-center justify-center transition-colors duration-300 hover:bg-gray-100"
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
        selectedKeys={[location.pathname]}
        className="h-[calc(100%-48px)] border-r-0 pt-2"
        items={items}
        onClick={(item) => navigate(item.key)}
      />
    </Sider>
  );
};

export default Sidebar;