import React, { useState } from 'react';
import { Layout } from 'antd';
import Header from './layout/Header';
import Sidebar from './layout/Sidebar';

const { Content } = Layout;

const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout className="h-screen overflow-hidden">
      <Header />

      <Layout>
        {/* SIDEBAR KIRI */}
        <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />

        {/* AREA KONTEN TENGAH */}
        <Layout 
          className={`px-0 py-10 mt-12 transition-[margin-left] duration-200 h-[calc(100vh-40px)] overflow-y-auto ${collapsed ? 'ml-3' : 'ml-[15px]'}`}
        >
          <Content className="m-1 min-h-[280px]">
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
