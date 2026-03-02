/**
 * @file Sidebar.jsx
 * @description Komponen sidebar navigasi dengan fitur collapse/expand.
 * Berisi menu navigasi ke halaman Project Posture, Project List, dan Project Progress.
 * Menggunakan Ant Design Sider dan Menu dengan posisi fixed di sisi kiri.
 */

import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  AppstoreOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const { Sider } = Layout;

/**
 * @param {Object} props
 * @param {boolean} props.collapsed - Status apakah sidebar sedang di-collapse.
 * @param {Function} props.onCollapse - Callback untuk toggle state collapse.
 * @returns {JSX.Element} Sidebar fixed dengan menu navigasi dan tombol toggle.
 */
const Sidebar = ({ collapsed, onCollapse }) => {

  const navigate = useNavigate();
  const location = useLocation();

  /** @type {import('antd').MenuProps['items']} */
  const items = [
    {
      key: '/posture',
      icon: <DashboardOutlined />,
      label: 'Project Posture',
    },
    {
      key: '/list',
      icon: <AppstoreOutlined />,
      label: 'Project List',
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
      <div className={`h-12 flex items-center border-b border-gray-100 ${collapsed ? 'justify-center px-0' : 'justify-between px-4'}`}>
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