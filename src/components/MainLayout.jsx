import React from 'react';
import { Layout } from 'antd';
import Header from './layout/Header';
import Sidebar from './layout/Sidebar';

const { Content } = Layout;

const MainLayout = ({ children }) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header />

      <Layout>
        {/* SIDEBAR KIRI */}
        <Sidebar />

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
