import React, { useState } from 'react';
import { Layout } from 'antd';
import Header from './layout/Header';
import Sidebar from './layout/Sidebar';

const { Content } = Layout;

/**
 * komponen layout utama aplikasi yang mengatur struktur header, sidebar, dan content area
 * @param {Object} props - props komponen
 * @param {React.ReactNode} props.children - konten yang akan ditampilkan di area utama
 * @returns {JSX.Element} layout dengan header, sidebar yang collapsible, dan content area
 */
const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout className="h-screen overflow-hidden">
      <Header />

      <Layout>
        {/* sidebar kiri */}
        <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />

        {/* area konten tengah */}
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
