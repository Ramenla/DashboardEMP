import React from 'react';
import { Card, Input, Checkbox, Radio, Slider, Typography, Button } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';

const { Title } = Typography;

// PERUBAHAN: Menerima props filters & onFilterChange
const FilterCard = ({ filters, onFilterChange, onReset }) => {
  const categories = ['Exploration', 'Drilling', 'Operation', 'Facility'];

  // Fungsi helper agar kodingan lebih rapi saat memanggil onFilterChange
  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <Card 
      title={<div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>Filter <Button type="text" size="small" icon={<ReloadOutlined/>} onClick={onReset}>Reset</Button></div>} 
      bordered={false} 
      style={{ height: '100%', borderRadius: 8 }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        
        {/* 1. Search */}
        <Input 
          placeholder="Cari Kode..." 
          prefix={<SearchOutlined style={{ color: '#ccc' }} />} 
          style={{ borderRadius: 20 }}
          value={filters.search} // Controlled Component
          onChange={(e) => handleChange('search', e.target.value)}
        />

        {/* 2. Checkbox Category */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Checkbox.Group 
            options={categories}
            value={filters.categories}
            onChange={(checkedValues) => handleChange('categories', checkedValues)}
            style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
          />
        </div>

        {/* 3. Prioritas */}
        <div>
          <Title level={5} style={{ fontSize: 13, marginBottom: 8, color: '#555' }}>Prioritas</Title>
          <Radio.Group 
            value={filters.priority}
            onChange={(e) => handleChange('priority', e.target.value)}
            buttonStyle="solid" 
            size="middle" 
            style={{ width: '100%', display: 'flex' }}
          >
            <Radio.Button value="Rendah" style={{ flex: 1, textAlign: 'center', fontSize: 12 }}>Rendah</Radio.Button>
            <Radio.Button value="Sedang" style={{ flex: 1, textAlign: 'center', fontSize: 12 }}>Sedang</Radio.Button>
            <Radio.Button value="Tinggi" style={{ flex: 1, textAlign: 'center', fontSize: 12 }}>Tinggi</Radio.Button>
          </Radio.Group>
        </div>

        {/* 4. Status */}
        <div>
          <Title level={5} style={{ fontSize: 13, marginBottom: 8, color: '#555' }}>Status Project</Title>
          <Radio.Group 
            value={filters.status}
            onChange={(e) => handleChange('status', e.target.value)}
            buttonStyle="solid" 
            size="middle" 
            style={{ width: '100%', display: 'flex' }}
          >
            <Radio.Button value="Kritis" style={{ flex: 1, textAlign: 'center', fontSize: 12 }}>Kritis</Radio.Button>
            <Radio.Button value="Tertunda" style={{ flex: 1, textAlign: 'center', fontSize: 12 }}>Tertunda</Radio.Button>
            <Radio.Button value="Berjalan" style={{ flex: 1, textAlign: 'center', fontSize: 12 }}>Berjalan</Radio.Button>
          </Radio.Group>
        </div>

        {/* 5. Issue Slider (Filter Budget Used < X %) */}
        {/* Kita ubah fungsi slider ini jadi Filter Budget Used agar lebih masuk akal */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: -4 }}>
             <Title level={5} style={{ fontSize: 13, color: '#555' }}>Max Budget Used</Title>
             <span style={{fontSize:12, fontWeight:'bold'}}>{filters.maxBudget}%</span>
          </div>
          <Slider 
            min={0}
            max={100}
            value={filters.maxBudget}
            onChange={(val) => handleChange('maxBudget', val)}
            trackStyle={{ backgroundColor: '#001529' }} 
            handleStyle={{ borderColor: '#001529' }}
          />
        </div>

      </div>
    </Card>
  );
};

export default FilterCard;