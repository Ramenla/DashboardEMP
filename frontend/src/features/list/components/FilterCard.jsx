/**
 * @file FilterCard.jsx
 * @description komponen filter bar horizontal untuk halaman Project List.
 * Menyediakan 4 filter dalam satu baris kompak: Lokasi (autocomplete),
 * Kategori (checkbox group), Status (radio button), dan Prioritas (radio button).
 * Tombol reset muncul otomatis saat ada filter aktif.
 */

import React from 'react';
import { Card, Checkbox, Radio, Typography, Button, Divider, Select, AutoComplete, Input } from 'antd';
import { ReloadOutlined, DownOutlined } from '@ant-design/icons';

const { Text } = Typography;

/** @type {string[]} Daftar lokasi blok operasi EMP. */
const locations = [
  "Blok B (Sumatra)",
  "Blok Bireun-Sigli (Sumatra)",
  "Blok Gebang (Sumatra)",
  "Blok Tonga (Sumatra)",
  "Blok Malacca Strait (Sumatra)",
  "Blok Siak (Sumatra)",
  "Blok Kampar (Sumatra)",
  "Blok Bentu (Sumatra)",
  "Blok Korinci Baru (Sumatra)",
  "Blok South CPP (Sumatra)",
  "Blok Kangean (Jawa)",
  "Blok Sengkang (Sulawesi)",
  "Blok Buzi EPCC (Mozambique)"
];

/** @type {string[]} Kategori proyek yang tersedia. */
const categories = ['EXPLORATION', 'DRILLING', 'OPERATION', 'FACILITY'];

/**
 * @param {Object} props
 * @param {Object} props.filters - Objek berisi nilai filter aktif.
 * @param {Function} props.onFilterChange - Callback saat filter berubah.
 * @param {Function} props.onReset - Callback untuk mereset semua filter.
 * @returns {JSX.Element} Filter bar horizontal dalam Card.
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
