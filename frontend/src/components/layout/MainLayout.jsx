/**
 * @file MainLayout.jsx
 * @description Layout utama aplikasi yang menyusun Header, Sidebar, dan area konten.
 * Sidebar dapat di-collapse untuk memperluas area konten.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Konten halaman yang dirender di area utama.
 */

import React, { useState } from 'react';
import { Layout } from 'antd';
import Header from './Header';
import Sidebar from './Sidebar';

const { Content } = Layout;

/**
 * @param {{ children: React.ReactNode }} props
 * @returns {JSX.Element} Layout dengan header, sidebar collapsible, dan content area.
 */
const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout className="h-screen overflow-hidden">
      <Header />

      <Layout>
        <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />

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
