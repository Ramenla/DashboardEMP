import React from 'react';
import { Card, Input, Checkbox, Radio, Slider, Typography, Button, Divider } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';

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

  // style label section
  const labelStyle = { fontSize: 11, color: '#8c8c8c', marginBottom: 4, display: 'block', fontWeight: 600 };

  return (
    <Card
      bordered={false}
      className="rounded-lg"
      bodyStyle={{ padding: '12px 16px' }}
    >
      <div className="flex flex-row flex-wrap gap-4 items-end">

        {/* 1. search */}
        <div style={{ flex: '0 1 180px' }}>
          <Text style={labelStyle}>Cari</Text>
          <Input
            placeholder="Kode / nama..."
            prefix={<SearchOutlined style={{ color: '#bfbfbf', fontSize: 12 }} />}
            size="small"
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
          />
        </div>

        <Divider type="vertical" style={{ height: 32, margin: '0 4px' }} />

        {/* 2. checkbox category */}
        <div style={{ flex: '0 1 auto' }}>
          <Text style={labelStyle}>Kategori</Text>
          <Checkbox.Group
            options={categories}
            value={filters.categories}
            onChange={(checkedValues) => handleChange('categories', checkedValues)}
            className="flex flex-row gap-2"
            style={{ fontSize: 12 }}
          />
        </div>

        <Divider type="vertical" style={{ height: 32, margin: '0 4px' }} />

        {/* 3. prioritas */}
        <div style={{ flex: '0 1 auto' }}>
          <Text style={labelStyle}>Prioritas</Text>
          <Radio.Group
            value={filters.priority}
            onChange={(e) => handleChange('priority', e.target.value)}
            buttonStyle="solid"
            size="small"
          >
            <Radio.Button value="Rendah" onClick={(e) => handleRadioClick(e, 'priority', 'Rendah')} style={{ fontSize: 11 }}>Rendah</Radio.Button>
            <Radio.Button value="Sedang" onClick={(e) => handleRadioClick(e, 'priority', 'Sedang')} style={{ fontSize: 11 }}>Sedang</Radio.Button>
            <Radio.Button value="Tinggi" onClick={(e) => handleRadioClick(e, 'priority', 'Tinggi')} style={{ fontSize: 11 }}>Tinggi</Radio.Button>
          </Radio.Group>
        </div>

        <Divider type="vertical" style={{ height: 32, margin: '0 4px' }} />

        {/* 4. status */}
        <div style={{ flex: '0 1 auto' }}>
          <Text style={labelStyle}>Status</Text>
          <Radio.Group
            value={filters.status}
            onChange={(e) => handleChange('status', e.target.value)}
            buttonStyle="solid"
            size="small"
          >
            <Radio.Button value="Kritis" onClick={(e) => handleRadioClick(e, 'status', 'Kritis')} style={{ fontSize: 11 }}>Kritis</Radio.Button>
            <Radio.Button value="Tertunda" onClick={(e) => handleRadioClick(e, 'status', 'Tertunda')} style={{ fontSize: 11 }}>Tertunda</Radio.Button>
            <Radio.Button value="Berjalan" onClick={(e) => handleRadioClick(e, 'status', 'Berjalan')} style={{ fontSize: 11 }}>Berjalan</Radio.Button>
          </Radio.Group>
        </div>

        <Divider type="vertical" style={{ height: 32, margin: '0 4px' }} />

        {/* 5. budget slider */}
        <div style={{ flex: '0 1 160px', minWidth: 120 }}>
          <div className="flex justify-between" style={{ marginBottom: -2 }}>
            <Text style={labelStyle}>Budget Maks</Text>
            <span style={{ fontSize: 11, fontWeight: 700 }}>{filters.maxBudget}%</span>
          </div>
          <Slider
            min={0}
            max={100}
            value={filters.maxBudget}
            onChange={(val) => handleChange('maxBudget', val)}
            trackStyle={{ backgroundColor: '#001529' }}
            handleStyle={{ borderColor: '#001529' }}
            style={{ margin: '6px 0 0' }}
          />
        </div>

        {/* reset button */}
        <div style={{ marginLeft: 'auto' }}>
          <Button type="text" size="small" icon={<ReloadOutlined />} onClick={onReset} style={{ fontSize: 12 }}>
            Reset
          </Button>
        </div>

      </div>
    </Card>
  );
};

export default FilterCard;