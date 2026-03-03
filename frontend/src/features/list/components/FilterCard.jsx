/**
 * @file FilterCard.jsx
 * @description Komponen filter popup compact untuk halaman Project List.
 * Gaya yang sama dengan filter Project Posture: simple, kecil, dropdown select.
 */

import React, { useState } from 'react';
import { Button, Select, Badge, Popover } from 'antd';
import { FilterOutlined, ReloadOutlined } from '@ant-design/icons';

const { Option } = Select;

const STATUS_DOTS = {
  Berjalan: '#52c41a',
  Beresiko: '#ff4d4f',
  Tertunda: '#faad14',
  Selesai: '#1890ff',
};

const PRIORITY_DOTS = {
  Tinggi: '#ff4d4f',
  Sedang: '#faad14',
  Rendah: '#8c8c8c',
};

/**
 * @param {Object} props
 * @param {Object} props.filters - Object filter aktif
 * @param {Function} props.onFilterChange - Callback perubahan filter
 * @param {Function} props.onReset - Callback reset semua filter
 * @param {Object} props.metadata - Data metadata (categories, locations, etc)
 * @param {boolean} props.loading - Status loading
 * @returns {JSX.Element} Tombol filter + popup Popover compact
 */
const FilterCard = ({ filters, onFilterChange, onReset, metadata = { categories: [], statuses: [], locations: [] }, loading = false }) => {
  const [open, setOpen] = useState(false);

  const categories = metadata.categories || [];
  const locations = metadata.locations || [];

  const handleReset = () => {
    onReset();
    setOpen(false);
  };

  const activeCount = [
    filters.categories?.length > 0,
    !!filters.status,
    !!filters.priority,
    !!filters.location,
  ].filter(Boolean).length;

  const labelClass = 'text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1';

  const filterContent = (
    <div style={{ width: 260 }}>
      <div className="flex flex-col gap-3">
        <div>
          <span className={labelClass}>Kategori</span>
          <Select
            mode="multiple"
            value={filters.categories}
            onChange={(val) => onFilterChange({ ...filters, categories: val })}
            style={{ width: '100%' }}
            placeholder="Semua"
            allowClear
            maxTagCount={2}
            size="small"
          >
            {categories.map(c => <Option key={c} value={c}>{c}</Option>)}
          </Select>
        </div>
        <div>
          <span className={labelClass}>Status</span>
          <Select
            value={filters.status || undefined}
            onChange={(val) => onFilterChange({ ...filters, status: val ?? '' })}
            style={{ width: '100%' }}
            placeholder="Semua"
            allowClear
            size="small"
          >
            {['Berjalan', 'Beresiko', 'Tertunda', 'Selesai'].map(s => (
              <Option key={s} value={s}>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: STATUS_DOTS[s] }} />
                  {s}
                </div>
              </Option>
            ))}
          </Select>
        </div>
        <div>
          <span className={labelClass}>Prioritas</span>
          <Select
            value={filters.priority || undefined}
            onChange={(val) => onFilterChange({ ...filters, priority: val ?? '' })}
            style={{ width: '100%' }}
            placeholder="Semua"
            allowClear
            size="small"
          >
            {['Rendah', 'Sedang', 'Tinggi'].map(p => (
              <Option key={p} value={p}>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: PRIORITY_DOTS[p] }} />
                  {p}
                </div>
              </Option>
            ))}
          </Select>
        </div>
        <div>
          <span className={labelClass}>Lokasi</span>
          <Select
            showSearch
            value={filters.location || undefined}
            onChange={(val) => onFilterChange({ ...filters, location: val ?? '' })}
            style={{ width: '100%' }}
            placeholder="Semua Lokasi"
            allowClear
            size="small"
            filterOption={(input, option) => (option?.children ?? '').toLowerCase().includes(input.toLowerCase())}
          >
            {locations.map(loc => <Option key={loc} value={loc}>{loc}</Option>)}
          </Select>
        </div>
        <Button icon={<ReloadOutlined />} onClick={handleReset} size="small" block className="mt-1">Reset Filter</Button>
      </div>
    </div>
  );

  return (
    <Popover
      content={filterContent}
      title={<span className="text-sm font-semibold">Filter Project</span>}
      trigger="click"
      open={open}
      onOpenChange={setOpen}
      placement="bottomRight"
    >
      <Badge count={activeCount} size="small" offset={[-4, 4]}>
        <Button icon={<FilterOutlined />} type={activeCount > 0 ? 'primary' : 'default'} ghost={activeCount > 0}>Filter</Button>
      </Badge>
    </Popover>
  );
};

export default FilterCard;
