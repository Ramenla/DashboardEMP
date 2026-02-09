import React, { useState } from 'react';
import { Layout } from 'antd';
import Header from './layout/Header';
import Sidebar from './layout/Sidebar';

const { Content } = Layout;

const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header />

      <Layout>
        {/* SIDEBAR KIRI */}
        <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />

        {/* AREA KONTEN TENGAH */}
        <Layout style={{
          padding: '16px 24px 24px',
          marginLeft: collapsed ? 80 : 210, // Adjust margin based on sidebar state
          marginTop: 40, // Adjust for fixed header
          transition: 'margin-left 0.2s', // Smooth transition
          minHeight: 'calc(100vh - 40px)' // Ensure full height
        }}>
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
