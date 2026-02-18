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
    <Card
      className="rounded-lg shadow-sm border-none mb-4"
      styles={{ body: { padding: '10px 14px' } }}
    >
      <div className="flex flex-col gap-2.5">
        {/* Header Row: Reset Only */}
        <div className="flex justify-end items-center">
          <Button
            type="text"
            size="small"
            icon={<ReloadOutlined style={{ fontSize: '10px' }} />}
            onClick={onReset}
            className="text-[10px] text-gray-400 hover:text-blue-600 flex items-center h-4 font-medium"
          >
            Reset Filter
          </Button>
        </div>

        {/* Row 1: Primary Filters */}
        <div className="flex flex-row flex-wrap lg:flex-nowrap gap-x-6 gap-y-3 items-start">

          {/* 1. Lokasi */}
          <div className="w-full md:w-[180px] shrink-0">
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

          {/* 2. Kategori */}
          <div className="flex flex-col gap-0.5 shrink-0">
            <Text className={labelClass}>Kategori</Text>
            <Checkbox.Group
              options={categories}
              value={filters.categories}
              onChange={(checkedValues) => handleChange('categories', checkedValues)}
              className="flex flex-row gap-x-4 text-[10px] whitespace-nowrap"
            />
          </div>

          {/* 3. Project Manager */}
          <div className="w-full md:w-[160px] shrink-0">
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
        </div>

        <Divider className="my-0.5 opacity-100" />

        {/* Row 2: Status, Performance, Financial */}
        <div className="flex flex-row flex-wrap gap-x-6 gap-y-3 items-start">

          {/* 4. Sponsor */}
          <div className="w-full md:w-[160px] shrink-0">
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

          {/* Prioritas & Status */}
          <div className="flex gap-4 shrink-0">
            <div className="w-[140px]">
              <Text className={labelClass}>Prioritas</Text>
              <Radio.Group
                value={filters.priority}
                onChange={(e) => handleChange('priority', e.target.value)}
                buttonStyle="solid"
                size="small"
                className="flex w-full"
              >
                <Radio.Button value="Rendah" onClick={(e) => handleRadioClick(e, 'priority', 'Rendah')} className="text-[10px] px-1 flex-1 text-center leading-6">Rndh</Radio.Button>
                <Radio.Button value="Sedang" onClick={(e) => handleRadioClick(e, 'priority', 'Sedang')} className="text-[10px] px-1 flex-1 text-center leading-6">Sdng</Radio.Button>
                <Radio.Button value="Tinggi" onClick={(e) => handleRadioClick(e, 'priority', 'Tinggi')} className="text-[10px] px-1 flex-1 text-center leading-6">Tngi</Radio.Button>
              </Radio.Group>
            </div>

            <div className="w-[140px]">
              <Text className={labelClass}>Status</Text>
              <Radio.Group
                value={filters.status}
                onChange={(e) => handleChange('status', e.target.value)}
                buttonStyle="solid"
                size="small"
                className="flex w-full"
              >
                <Radio.Button value="Kritis" onClick={(e) => handleRadioClick(e, 'status', 'Kritis')} className="text-[10px] px-1 flex-1 text-center leading-6">Kritis</Radio.Button>
                <Radio.Button value="Tertunda" onClick={(e) => handleRadioClick(e, 'status', 'Tertunda')} className="text-[10px] px-1 flex-1 text-center leading-6">Delay</Radio.Button>
                <Radio.Button value="Berjalan" onClick={(e) => handleRadioClick(e, 'status', 'Berjalan')} className="text-[10px] px-1 flex-1 text-center leading-6">On</Radio.Button>
              </Radio.Group>
            </div>
          </div>

          {/* Performa & Isu */}
          <div className="flex gap-4 shrink-0">
            <div className="w-[110px]">
              <Text className={labelClass}>Performa</Text>
              <Radio.Group
                value={filters.performance}
                onChange={(e) => handleChange('performance', e.target.value)}
                buttonStyle="solid"
                size="small"
                className="flex w-full"
              >
                <Radio.Button value="Behind Target" onClick={(e) => handleRadioClick(e, 'performance', 'Behind Target')} className="text-[10px] px-1 flex-1 text-center leading-6">Behind</Radio.Button>
                <Radio.Button value="On Track" onClick={(e) => handleRadioClick(e, 'performance', 'On Track')} className="text-[10px] px-1 flex-1 text-center leading-6">Track</Radio.Button>
              </Radio.Group>
            </div>

            <div className="flex flex-col mb-0.5">
              <Text className={labelClass}>Isu Aktif</Text>
              <div className="flex items-center h-6">
                <Space size={4}>
                  <Switch
                    size="small"
                    checked={filters.issuesOnly}
                    onChange={(val) => handleChange('issuesOnly', val)}
                  />
                  <Text className="text-[10px] text-gray-500 whitespace-nowrap">Masalah</Text>
                </Space>
              </div>
            </div>
          </div>

          {/* Nilai & Budget */}
          <div className="flex gap-4 flex-1 min-w-[250px] max-w-[400px]">
            <div className="w-[110px] shrink-0">
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

            <div className="flex-1">
              <div className="flex justify-between items-center">
                <Text className={labelClass}>Budget Utilization</Text>
                <span className="text-[10px] font-bold text-gray-600">{filters.maxBudget}%</span>
              </div>
              <Slider
                min={0}
                max={100}
                value={filters.maxBudget}
                onChange={(val) => handleChange('maxBudget', val)}
                trackStyle={{ backgroundColor: '#001529' }}
                handleStyle={{ borderColor: '#001529' }}
                className="m-0 mt-1"
              />
            </div>
          </div>
        </div>
      </div>
    </Card >
  );
};

export default FilterCard;
