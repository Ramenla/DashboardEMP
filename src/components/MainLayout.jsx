import React, { useState } from 'react';
import { Layout } from 'antd';
import Header from './layout/Header';
import Sidebar from './layout/Sidebar';

const { Content } = Layout;

const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ height: '100vh', overflow: 'hidden' }}> {/* Fix viewport */}
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
          height: 'calc(100vh - 40px)', // Fixed height
          overflowY: 'auto' // Scroll only here
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
