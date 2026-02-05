import React from 'react';
import { Card, Input, Checkbox, Radio, Slider, Typography, Divider } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Title } = Typography;

const FilterCard = () => {
  const categories = ['Exploration', 'Drilling', 'Operation', 'Facility'];

  return (
    <Card title="Filter" bordered={false} style={{ height: '100%', borderRadius: 8 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        
        {/* 1. Search */}
        <Input 
          placeholder="Search" 
          prefix={<SearchOutlined style={{ color: '#ccc' }} />} 
          size="large"
          style={{ borderRadius: 20 }} 
        />

        {/* 2. Checkbox Group */}
        <Checkbox.Group style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {categories.map(cat => (
            <Checkbox key={cat} value={cat} style={{ marginLeft: 0 }}>
              {cat}
            </Checkbox>
          ))}
        </Checkbox.Group>

        <Divider style={{ margin: '10px 0' }} />

        {/* 3. Prioritas (Radio Button rasa Button) */}
        <div>
          <Title level={5} style={{ fontSize: 14, marginBottom: 8 }}>Prioritas</Title>
          <Radio.Group defaultValue="a" buttonStyle="solid" size="small" style={{ width: '100%', display: 'flex' }}>
            <Radio.Button value="a" style={{ flex: 1, textAlign: 'center' }}>Rendah</Radio.Button>
            <Radio.Button value="b" style={{ flex: 1, textAlign: 'center' }}>Sedang</Radio.Button>
            <Radio.Button value="c" style={{ flex: 1, textAlign: 'center' }}>Tinggi</Radio.Button>
          </Radio.Group>
        </div>

        {/* 4. Status Project */}
        <div>
          <Title level={5} style={{ fontSize: 14, marginBottom: 8 }}>Status Project</Title>
          <Radio.Group defaultValue="a" buttonStyle="solid" size="small" style={{ width: '100%', display: 'flex' }}>
            <Radio.Button value="a" style={{ flex: 1, textAlign: 'center' }}>Kritis</Radio.Button>
            <Radio.Button value="b" style={{ flex: 1, textAlign: 'center' }}>Tertunda</Radio.Button>
            <Radio.Button value="c" style={{ flex: 1, textAlign: 'center' }}>Berjalan</Radio.Button>
          </Radio.Group>
        </div>

        {/* 5. Issue Slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
             <Title level={5} style={{ fontSize: 14 }}>Issue</Title>
          </div>
          <Slider defaultValue={24} max={50} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#888' }}>
            <span>0</span>
            <span>50</span>
          </div>
        </div>

      </div>
    </Card>
  );
};

export default FilterCard;