import React, { useMemo } from 'react';
import { Card, Checkbox, Radio, Slider, Typography, Button, Divider, Select, Switch, Space } from 'antd';
import { ReloadOutlined, WarningOutlined } from '@ant-design/icons';
import { projectsData } from '../../../shared/data/mockData';

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

  // Ekstrak data unik secara dinamis dari projectsData
  const managers = useMemo(() => {
    return [...new Set(projectsData.map(p => p.manager))].sort();
  }, []);

  const sponsors = useMemo(() => {
    return [...new Set(projectsData.map(p => p.sponsor))].sort();
  }, []);

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
    <Card className="rounded-lg shadow-sm border-none">
      <div className="flex flex-col gap-4">

        {/* Header Row: Reset Only */}
        <div className="flex justify-end items-center -mb-2">
          <Button
            type="text"
            size="small"
            icon={<ReloadOutlined style={{ fontSize: '10px' }} />}
            onClick={onReset}
            className="text-[11px] text-gray-400 hover:text-blue-600 flex items-center font-medium"
          >
            Reset Filter
          </Button>
        </div>

        {/* Row 1: Primary Filters */}
        <div className="flex flex-row flex-wrap gap-x-4 gap-y-1 items-end">

          {/* 1. Lokasi (Paling Kiri) */}
          <div className="w-[170px]">
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

          <Divider type="vertical" className="h-8 mx-0 mb-1" />

          {/* 2. Kategori */}
          <div className="shrink-0">
            <Text className={labelClass}>Kategori</Text>
            <Checkbox.Group
              options={categories}
              value={filters.categories}
              onChange={(checkedValues) => handleChange('categories', checkedValues)}
              className="flex flex-row gap-3 text-xs"
            />
          </div>

          <Divider type="vertical" className="h-8 mx-0 mb-1 hidden lg:block" />

          {/* 3. Stakeholders */}
          <div className="flex gap-2">
            <div className="w-[150px]">
              <Text className={labelClass}>Project Manager</Text>
              <Select
                placeholder="Semua Manager"
                value={filters.manager || undefined}
                onChange={(val) => handleChange('manager', val || '')}
                allowClear
                size="small"
                className="w-full text-[11px]"
                showSearch
                options={managers.map(m => ({ label: m, value: m }))}
              />
            </div>
            <div className="w-[150px]">
              <Text className={labelClass}>Sponsor</Text>
              <Select
                placeholder="Semua Sponsor"
                value={filters.sponsor || undefined}
                onChange={(val) => handleChange('sponsor', val || '')}
                allowClear
                size="small"
                className="w-full text-[11px]"
                showSearch
                options={sponsors.map(s => ({ label: s, value: s }))}
              />
            </div>
          </div>
        </div>

        <Divider className="my-0 opacity-50" />

        {/* Row 2: Status & Performance */}
        <div className="flex flex-row flex-wrap gap-x-4 gap-y-1 items-end">

          {/* 4. Atribut Utama */}
          <div className="flex gap-4">
            <div>
              <Text className={labelClass}>Prioritas</Text>
              <Radio.Group
                value={filters.priority}
                onChange={(e) => handleChange('priority', e.target.value)}
                buttonStyle="solid"
                size="small"
              >
                <Radio.Button value="Rendah" onClick={(e) => handleRadioClick(e, 'priority', 'Rendah')} className="text-[11px] px-2">Rendah</Radio.Button>
                <Radio.Button value="Sedang" onClick={(e) => handleRadioClick(e, 'priority', 'Sedang')} className="text-[11px] px-2">Sedang</Radio.Button>
                <Radio.Button value="Tinggi" onClick={(e) => handleRadioClick(e, 'priority', 'Tinggi')} className="text-[11px] px-2">Tinggi</Radio.Button>
              </Radio.Group>
            </div>
            <div>
              <Text className={labelClass}>Status</Text>
              <Radio.Group
                value={filters.status}
                onChange={(e) => handleChange('status', e.target.value)}
                buttonStyle="solid"
                size="small"
              >
                <Radio.Button value="Kritis" onClick={(e) => handleRadioClick(e, 'status', 'Kritis')} className="text-[11px] px-2">Kritis</Radio.Button>
                <Radio.Button value="Tertunda" onClick={(e) => handleRadioClick(e, 'status', 'Tertunda')} className="text-[11px] px-2">Tertunda</Radio.Button>
                <Radio.Button value="Berjalan" onClick={(e) => handleRadioClick(e, 'status', 'Berjalan')} className="text-[11px] px-2">Berjalan</Radio.Button>
              </Radio.Group>
            </div>
          </div>

          <Divider type="vertical" className="h-8 mx-0 mb-1" />

          {/* 5. Performa */}
          <div className="flex gap-4 items-end">
            <div>
              <Text className={labelClass}>Performa (vs Target)</Text>
              <Radio.Group
                value={filters.performance}
                onChange={(e) => handleChange('performance', e.target.value)}
                buttonStyle="solid"
                size="small"
              >
                <Radio.Button value="Behind Target" onClick={(e) => handleRadioClick(e, 'performance', 'Behind Target')} className="text-[11px] px-2">Behind</Radio.Button>
                <Radio.Button value="On Track" onClick={(e) => handleRadioClick(e, 'performance', 'On Track')} className="text-[11px] px-2">On Track</Radio.Button>
              </Radio.Group>
            </div>

            <div className="flex flex-col mb-0.5">
              <Text className={labelClass}>Isu Aktif</Text>
              <Space size={4}>
                <Switch
                  size="small"
                  checked={filters.issuesOnly}
                  onChange={(val) => handleChange('issuesOnly', val)}
                />
                <Text className="text-[11px] text-gray-500">Hanya Bermasalah</Text>
              </Space>
            </div>
          </div>

          <Divider type="vertical" className="h-8 mx-0 mb-1" />

          {/* 6. Financial */}
          <div className="flex gap-4 items-end flex-grow">
            <div className="w-[120px]">
              <Text className={labelClass}>Nilai Project</Text>
              <Select
                placeholder="Semua"
                value={filters.budgetValue || undefined}
                onChange={(val) => handleChange('budgetValue', val || '')}
                allowClear
                size="small"
                className="w-full text-[11px]"
                options={[
                  { label: 'S (<1M)', value: 'Small' },
                  { label: 'M (1-5M)', value: 'Medium' },
                  { label: 'L (>5M)', value: 'Large' },
                ]}
              />
            </div>

            <div className="flex-grow max-w-[180px]">
              <div className="flex justify-between -mb-1">
                <Text className={labelClass}>Budget Maks (%)</Text>
                <span className="text-[11px] font-bold text-gray-600">{filters.maxBudget}%</span>
              </div>
              <Slider
                min={0}
                max={100}
                value={filters.maxBudget}
                onChange={(val) => handleChange('maxBudget', val)}
                trackStyle={{ backgroundColor: '#001529' }}
                handleStyle={{ borderColor: '#001529' }}
                className="mt-2 mb-1"
              />
            </div>
          </div>

        </div>
      </div>
    </Card>
  );
};

export default FilterCard;
