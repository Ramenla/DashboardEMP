import React, { useState } from 'react';
import { Layout, Menu, Typography, Avatar } from 'antd';
import {
  AppstoreOutlined,
  BarChartOutlined,
  UserOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  // Menu Items
  const items = [
    {
      key: '1',
      icon: <AppstoreOutlined />,
      label: 'Project Posture',
    },
    {
      key: '2',
      icon: <BarChartOutlined />,
      label: 'Project Progress',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      
      {/* HEADER (Full Width) */}
      <Header 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          padding: '0 24px',
          background: '#001529', // Warna Dark Navy
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
        {/* SIDEBAR */}
        <Sider 
          width={240} 
          theme="light" 
          collapsible 
          collapsed={collapsed} 
          onCollapse={(value) => setCollapsed(value)}
        >
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            style={{ height: '100%', borderRight: 0, paddingTop: 16 }}
            items={items}
          />
        </Sider>

        {/* KONTEN TENGAH */}
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