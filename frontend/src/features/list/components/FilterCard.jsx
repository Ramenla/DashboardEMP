import React from 'react';
import { Card, Checkbox, Radio, Typography, Button, Divider, Select } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

const { Text } = Typography;

const locations = [
  'Blok Langsa', 'Blok Malacca Strait', 'Blok Bentu', 'Blok Korinci Baru',
  'Blok Singa', 'Blok Kangean', 'Blok Gebang', 'Kantor Pusat Jakarta',
];
const categories = ['Exploration', 'Drilling', 'Operation', 'Facility'];

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

        {/* 1. lokasi */}
        <div className="w-[180px]">
          <Text className={labelClass}>Lokasi</Text>
          <Select
            placeholder="Semua Lokasi"
            value={filters.location || undefined}
            onChange={(val) => handleChange('location', val || '')}
            allowClear size="small" className="w-full text-[11px]"
            options={locations.map(loc => ({ label: loc, value: loc }))}
          />
        </div>

        {/* 2. kategori */}
        <div className="shrink-0">
          <Text className={labelClass}>Kategori</Text>
          <Checkbox.Group
            options={categories}
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
            <Radio.Button value="Kritis" onClick={() => handleRadioClick('status', 'Kritis')} className="text-[11px] px-2">Kritis</Radio.Button>
            <Radio.Button value="Tertunda" onClick={() => handleRadioClick('status', 'Tertunda')} className="text-[11px] px-2">Tertunda</Radio.Button>
            <Radio.Button value="Berjalan" onClick={() => handleRadioClick('status', 'Berjalan')} className="text-[11px] px-2">Berjalan</Radio.Button>
          </Radio.Group>
        </div>

        <Divider type="vertical" className="h-8 mx-0 mb-1" />

        {/* 4. prioritas */}
        <div>
          <Text className={labelClass}>Prioritas</Text>
          <Radio.Group value={filters.priority} onChange={(e) => handleChange('priority', e.target.value)} buttonStyle="solid" size="small">
            <Radio.Button value="Rendah" onClick={() => handleRadioClick('priority', 'Rendah')} className="text-[11px] px-2">Rendah</Radio.Button>
            <Radio.Button value="Sedang" onClick={() => handleRadioClick('priority', 'Sedang')} className="text-[11px] px-2">Sedang</Radio.Button>
            <Radio.Button value="Tinggi" onClick={() => handleRadioClick('priority', 'Tinggi')} className="text-[11px] px-2">Tinggi</Radio.Button>
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
