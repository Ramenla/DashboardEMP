/**
 * @file FilterCard.jsx
 * @description komponen filter bar horizontal untuk halaman Project List.
 * Menyediakan 4 filter dalam satu baris kompak: Lokasi (autocomplete),
 * Kategori (checkbox group), Status (radio button), dan Prioritas (radio button).
 * Tombol reset muncul otomatis saat ada filter aktif.
 */

import React from 'react';
import { Card, Checkbox, Radio, Typography, Button, Divider, Select, AutoComplete, Input, Skeleton } from 'antd';
import { ReloadOutlined, DownOutlined } from '@ant-design/icons';

const { Text } = Typography;

/**
 * komponen filter bar compact untuk halaman project list
 * 4 filter utama dalam 1 baris: kategori, status, prioritas, lokasi
 * @param {Object} props.filters - object berisi nilai filter aktif
 * @param {Function} props.onFilterChange - callback perubahan filter
 * @param {Function} props.onReset - callback reset filter
 * @param {Object} props.metadata - data metadata dinamis (kategori, lokasi, etc)
 * @returns {JSX.Element} filter bar horizontal
 */
const FilterCard = ({ filters, onFilterChange, onReset, metadata = { categories: [], statuses: [], locations: [] }, loading = false }) => {
  const locations = metadata.locations || [];
  const categories = metadata.categories || [];
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

        <div className="shrink-0">
          <Text className={labelClass}>Kategori</Text>
          {loading && categories.length === 0 ? (
            <div className="flex flex-row gap-3 items-center">
              <Skeleton.Button active size="small" className="h-5 w-20" />
              <Skeleton.Button active size="small" className="h-5 w-20" />
              <Skeleton.Button active size="small" className="h-5 w-20" />
              <Skeleton.Button active size="small" className="h-5 w-20" />
            </div>
          ) : (
            <Checkbox.Group
              options={categories.map(c => ({ label: c.charAt(0) + c.slice(1).toLowerCase(), value: c }))}
              value={filters.categories}
              onChange={(val) => handleChange('categories', val)}
              className="flex flex-row gap-3 text-xs"
            />
          )}
        </div>

        <Divider type="vertical" className="h-8 mx-0 mb-1" />

        <div>
          <Text className={labelClass}>Status</Text>
          <Radio.Group value={filters.status} onChange={(e) => handleChange('status', e.target.value)} buttonStyle="solid" size="small">
            <Radio.Button value="Beresiko" onClick={() => handleRadioClick('status', 'Beresiko')} className="text-[11px] px-2">Beresiko</Radio.Button>
            <Radio.Button value="Tertunda" onClick={() => handleRadioClick('status', 'Tertunda')} className="text-[11px] px-2">Tertunda</Radio.Button>
            <Radio.Button value="Berjalan" onClick={() => handleRadioClick('status', 'Berjalan')} className="text-[11px] px-2">Berjalan</Radio.Button>
            <Radio.Button value="Selesai" onClick={() => handleRadioClick('status', 'Selesai')} className="text-[11px] px-2">Selesai</Radio.Button>
          </Radio.Group>
        </div>

        <Divider type="vertical" className="h-8 mx-0 mb-1" />

        <div>
          <Text className={labelClass}>Prioritas</Text>
          <Radio.Group value={filters.priority} onChange={(e) => handleChange('priority', e.target.value)} buttonStyle="solid" size="small">
            <Radio.Button value="Rendah" onClick={() => handleRadioClick('priority', 'Rendah')} className="text-[11px] px-2">Rendah</Radio.Button>
            <Radio.Button value="Sedang" onClick={() => handleRadioClick('priority', 'Sedang')} className="text-[11px] px-2">Sedang</Radio.Button>
            <Radio.Button value="Tinggi" onClick={() => handleRadioClick('priority', 'Tinggi')} className="text-[11px] px-2">Tinggi</Radio.Button>
          </Radio.Group>
        </div>

        <Divider type="vertical" className="h-8 mx-0 mb-1" />

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
