import React from 'react';
import { Card, Checkbox, Radio, Slider, Typography, Button, Divider, Select } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

const { Text } = Typography;

/**
 * komponen card filter horizontal kompak untuk halaman project posture
 * menyediakan search, category checkbox, priority/status radio, dan budget slider
 * @param {Object} props - props komponen
 * @param {Object} props.filters - object berisi semua nilai filter aktif
 * @param {Function} props.onFilterChange - callback ketika ada perubahan filter
 * @param {Function} props.onReset - callback untuk reset semua filter
 * @returns {JSX.Element} card filter bar horizontal
 */
const FilterCard = ({ filters, onFilterChange, onReset }) => {
  const categories = ['Exploration', 'Drilling', 'Operation', 'Facility'];
  const locations = [
    'Blok Langsa',
    'Blok Malacca Strait',
    'Blok Bentu',
    'Blok Korinci Baru',
    'Blok Singa',
    'Blok Kangean',
    'Blok Gebang',
    'Kantor Pusat Jakarta',
  ];

  /**
   * helper untuk update satu field pada object filters
   * @param {string} key - nama field yang akan diupdate
   * @param {any} value - nilai baru untuk field tersebut
   */
  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  /**
   * handler untuk toggle radio button (click lagi untuk unselect)
   * @param {Event} e - event dari radio button
   * @param {string} key - field filter yang akan di-toggle
   * @param {string} value - nilai radio button yang diklik
   */
  const handleRadioClick = (e, key, value) => {
    if (filters[key] === value) {
      handleChange(key, '');
    }
  };

  // tailwind class untuk label section
  const labelClass = 'text-[11px] text-gray-400 mb-0.5 block font-semibold';

  return (
    <Card
      className="rounded-lg "
    >
      <div className="flex flex-row flex-wrap gap-4 items-end">

        {/* 2. checkbox category */}
        <div className="shrink-0 basis-auto">
          <Text className={labelClass}>Kategori</Text>
          <Checkbox.Group
            options={categories}
            value={filters.categories}
            onChange={(checkedValues) => handleChange('categories', checkedValues)}
            className="flex flex-row gap-2 text-xs"
          />
        </div>

        <Divider type="vertical" className="h-8 mx-1" />

        {/* 2.5. lokasi */}
        <div className="shrink basis-[180px]">
          <Text className={labelClass}>Lokasi</Text>
          <Select
            placeholder="Semua Lokasi"
            value={filters.location || undefined}
            onChange={(val) => handleChange('location', val || '')}
            allowClear
            size="small"
            className="w-full text-[11px]"
            options={locations.map(loc => ({ label: loc, value: loc }))}
          />
        </div>

        <Divider type="vertical" className="h-8 mx-1" />

        {/* 3. prioritas */}
        <div className="shrink-0 basis-auto">
          <Text className={labelClass}>Prioritas</Text>
          <Radio.Group
            value={filters.priority}
            onChange={(e) => handleChange('priority', e.target.value)}
            buttonStyle="solid"
            size="small"
          >
            <Radio.Button value="Rendah" onClick={(e) => handleRadioClick(e, 'priority', 'Rendah')} className="text-[11px]">Rendah</Radio.Button>
            <Radio.Button value="Sedang" onClick={(e) => handleRadioClick(e, 'priority', 'Sedang')} className="text-[11px]">Sedang</Radio.Button>
            <Radio.Button value="Tinggi" onClick={(e) => handleRadioClick(e, 'priority', 'Tinggi')} className="text-[11px]">Tinggi</Radio.Button>
          </Radio.Group>
        </div>

        <Divider type="vertical" className="h-8 mx-1" />

        {/* 4. status */}
        <div className="shrink-0 basis-auto">
          <Text className={labelClass}>Status</Text>
          <Radio.Group
            value={filters.status}
            onChange={(e) => handleChange('status', e.target.value)}
            buttonStyle="solid"
            size="small"
          >
            <Radio.Button value="Kritis" onClick={(e) => handleRadioClick(e, 'status', 'Kritis')} className="text-[11px]">Kritis</Radio.Button>
            <Radio.Button value="Tertunda" onClick={(e) => handleRadioClick(e, 'status', 'Tertunda')} className="text-[11px]">Tertunda</Radio.Button>
            <Radio.Button value="Berjalan" onClick={(e) => handleRadioClick(e, 'status', 'Berjalan')} className="text-[11px]">Berjalan</Radio.Button>
          </Radio.Group>
        </div>

        <Divider type="vertical" className="h-8 mx-1" />

        {/* 5. budget slider */}
        <div className="shrink basis-[160px] min-w-[120px]">
          <div className="flex justify-between -mb-0.5">
            <Text className={labelClass}>Budget Maks</Text>
            <span className="text-[11px] font-bold">{filters.maxBudget}%</span>
          </div>
          <Slider
            min={0}
            max={100}
            value={filters.maxBudget}
            onChange={(val) => handleChange('maxBudget', val)}
            trackStyle={{ backgroundColor: '#001529' }}
            handleStyle={{ borderColor: '#001529' }}
            className="mt-1.5 mb-0"
          />
        </div>

        {/* reset button */}
        <div className="ml-auto mb-2.5">
          <Button type="text" size="small" icon={<ReloadOutlined />} onClick={onReset} className="text-xs">
            Reset
          </Button>
        </div>

      </div>
    </Card>
  );
};

export default FilterCard;