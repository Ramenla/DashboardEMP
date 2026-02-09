import React from 'react';
import { Card, Input, Checkbox, Radio, Slider, Typography, Button } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';

const { Title } = Typography;

const FilterCard = ({ filters, onFilterChange, onReset }) => {
  const categories = ['Exploration', 'Drilling', 'Operation', 'Facility'];

  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const handleRadioClick = (e, key, value) => {
    if (filters[key] === value) {
      handleChange(key, '');
    }
  };

  return (
    <Card
      title={
        <div className="flex justify-between items-center">
          Filter 
          <Button type="text" size="small" icon={<ReloadOutlined />} onClick={onReset}>Reset</Button>
        </div>
      }
      bordered={false}
      className="h-full rounded-lg"
    >
      <div className="flex flex-col gap-6">

        {/* 1. Search */}
        <Input
          placeholder="Cari Kode..."
          prefix={<SearchOutlined className="text-gray-300" />}
          className="rounded-full"
          value={filters.search}
          onChange={(e) => handleChange('search', e.target.value)}
        />

        {/* 2. Checkbox Category */}
        <div className="flex flex-col gap-2">
          <Checkbox.Group
            options={categories}
            value={filters.categories}
            onChange={(checkedValues) => handleChange('categories', checkedValues)}
            className="flex flex-col gap-2"
          />
        </div>

        {/* 3. Prioritas */}
        <div>
          <Title level={5} className="text-[13px] mb-2 text-gray-600">Prioritas</Title>
          <Radio.Group
            value={filters.priority}
            onChange={(e) => handleChange('priority', e.target.value)}
            buttonStyle="solid"
            size="middle"
            className="w-full flex"
          >
            <Radio.Button value="Rendah" onClick={(e) => handleRadioClick(e, 'priority', 'Rendah')} className="flex-1 text-center text-xs">Rendah</Radio.Button>
            <Radio.Button value="Sedang" onClick={(e) => handleRadioClick(e, 'priority', 'Sedang')} className="flex-1 text-center text-xs">Sedang</Radio.Button>
            <Radio.Button value="Tinggi" onClick={(e) => handleRadioClick(e, 'priority', 'Tinggi')} className="flex-1 text-center text-xs">Tinggi</Radio.Button>
          </Radio.Group>
        </div>

        {/* 4. Status */}
        <div>
          <Title level={5} className="text-[13px] mb-2 text-gray-600">Status Project</Title>
          <Radio.Group
            value={filters.status}
            onChange={(e) => handleChange('status', e.target.value)}
            buttonStyle="solid"
            size="middle"
            className="w-full flex"
          >
            <Radio.Button value="Kritis" onClick={(e) => handleRadioClick(e, 'status', 'Kritis')} className="flex-1 text-center text-xs">Kritis</Radio.Button>
            <Radio.Button value="Tertunda" onClick={(e) => handleRadioClick(e, 'status', 'Tertunda')} className="flex-1 text-center text-xs">Tertunda</Radio.Button>
            <Radio.Button value="Berjalan" onClick={(e) => handleRadioClick(e, 'status', 'Berjalan')} className="flex-1 text-center text-xs">Berjalan</Radio.Button>
          </Radio.Group>
        </div>

        {/* 5. Budget Slider */}
        <div>
          <div className="flex justify-between -mb-1">
            <Title level={5} className="text-[13px] text-gray-600">Max Budget Used</Title>
            <span className="text-xs font-bold">{filters.maxBudget}%</span>
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