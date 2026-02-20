import React from 'react';
import { Card, Checkbox, Radio, Typography, Button, Divider, Select, AutoComplete, Input } from 'antd';
import { ReloadOutlined, DownOutlined } from '@ant-design/icons';

const { Text } = Typography;

const locations = [
  "block 'B'", "Blok Bireun-Sigli", "Blok Gebang", "Blok Tonga",
  "Blok Malacca Strait", "Blok Siak", "Blok Kampar", "Blok Bentu", 
  "Blok Korinci Baru", "Blok South CPP", "Blok Kangean", "Blok Sengkang", "Buzi EPCC"
];
const categories = ['EXPLORATION', 'DRILLING', 'OPERATION', 'FACILITY'];

/**
 * komponen filter bar compact untuk halaman project list
 * 4 filter utama dalam 1 baris: kategori, status, prioritas, lokasi
 * @param {Object} props.filters - object berisi nilai filter aktif
 * @param {Function} props.onFilterChange - callback perubahan filter
 * @param {Function} props.onReset - callback reset filter
 * @returns {JSX.Element} filter bar horizontal
 */
const FilterCard = ({ filters, onFilterChange, onReset }) => {
  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const handleRadioClick = (key, value) => {
    if (filters[key] === value) handleChange(key, '');
  };

  const labelClass = 'text-[11px] text-gray-400 mb-0.5 block font-semibold';

  const hasActive = filters.categories.length > 0 || filters.status || filters.priority || filters.location;

  return (
    <Card bordered={false} className="rounded-lg" bodyStyle={{ padding: '10px 16px' }}>
      <div className="flex flex-row flex-wrap gap-x-4 gap-y-2 items-end">

        <div className="w-[180px]">
          <Text className={labelClass}>Lokasi</Text>
          <AutoComplete
            placeholder="Ketik atau pilih lokasi"
            value={filters.location}
            onChange={(val) => handleChange('location', val)}
            size="small"
            className="w-full text-[11px]"
            options={locations.map(loc => ({ label: loc, value: loc }))}
            filterOption={(inputValue, option) =>
              option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
            }
          >
            <Input
              allowClear
              suffix={
                !filters.location && (
                  <div
                    className="flex items-center h-full px-1.5 cursor-pointer border-l border-gray-100 ml-1 bg-gray-50/50 hover:bg-gray-100 transition-colors rounded-r"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <DownOutlined className="text-gray-400 text-[9px]" />
                  </div>
                )
              }
            />
          </AutoComplete>
        </div>

        {/* 2. kategori */}
        <div className="shrink-0">
          <Text className={labelClass}>Kategori</Text>
          <Checkbox.Group
            options={categories.map(c => ({ label: c.charAt(0) + c.slice(1).toLowerCase(), value: c }))}
            value={filters.categories}
            onChange={(val) => handleChange('categories', val)}
            className="flex flex-row gap-3 text-xs"
          />
        </div>

        <Divider type="vertical" className="h-8 mx-0 mb-1" />

        {/* 3. status */}
        <div>
          <Text className={labelClass}>Status</Text>
          <Radio.Group value={filters.status} onChange={(e) => handleChange('status', e.target.value)} buttonStyle="solid" size="small">
            <Radio.Button value="AT_RISK" onClick={() => handleRadioClick('status', 'AT_RISK')} className="text-[11px] px-2">At Risk</Radio.Button>
            <Radio.Button value="DELAYED" onClick={() => handleRadioClick('status', 'DELAYED')} className="text-[11px] px-2">Delayed</Radio.Button>
            <Radio.Button value="ON_TRACK" onClick={() => handleRadioClick('status', 'ON_TRACK')} className="text-[11px] px-2">On Track</Radio.Button>
            <Radio.Button value="COMPLETED" onClick={() => handleRadioClick('status', 'COMPLETED')} className="text-[11px] px-2">Completed</Radio.Button>
          </Radio.Group>
        </div>

        <Divider type="vertical" className="h-8 mx-0 mb-1" />

        {/* 4. prioritas */}
        <div>
          <Text className={labelClass}>Prioritas</Text>
          <Radio.Group value={filters.priority} onChange={(e) => handleChange('priority', e.target.value)} buttonStyle="solid" size="small">
            <Radio.Button value="LOW" onClick={() => handleRadioClick('priority', 'LOW')} className="text-[11px] px-2">Low</Radio.Button>
            <Radio.Button value="MEDIUM" onClick={() => handleRadioClick('priority', 'MEDIUM')} className="text-[11px] px-2">Medium</Radio.Button>
            <Radio.Button value="HIGH" onClick={() => handleRadioClick('priority', 'HIGH')} className="text-[11px] px-2">High</Radio.Button>
          </Radio.Group>
        </div>

        <Divider type="vertical" className="h-8 mx-0 mb-1" />

        {/* reset */}
        {hasActive && (
          <>
            <Divider type="vertical" className="h-8 mx-0 mb-1" />
            <Button
              type="text" size="small"
              icon={<ReloadOutlined style={{ fontSize: 10 }} />}
              onClick={onReset}
              className="text-[11px] text-gray-400 hover:text-blue-600 font-medium mb-0.5"
            >
              Reset
            </Button>
          </>
        )}
      </div>
    </Card>
  );
};

export default FilterCard;
