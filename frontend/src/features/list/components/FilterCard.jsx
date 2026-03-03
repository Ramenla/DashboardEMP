/**
 * @file FilterCard.jsx
 * @description Komponen filter popup premium untuk halaman Project List.
 * Menggunakan Popover yang muncul saat klik tombol "Filter".
 * Berisi filter: Tanggal, Kategori, Status, Prioritas, Lokasi, dan Keyword.
 * Setiap filter memiliki tombol "Clear" individual, serta tombol Reset & Terapkan global.
 */

import React, { useState, useEffect } from 'react';
import { Button, Select, Input, DatePicker, Badge, Skeleton, Popover, Divider } from 'antd';
import { FilterOutlined, SearchOutlined, CloseOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;

/**
 * Warna dot status untuk Select option
 */
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
 * @param {Function} props.onReset - Callback reset filter
 * @param {Object} props.metadata - Data metadata dinamis
 * @param {boolean} props.loading - Status loading
 * @returns {JSX.Element} Tombol filter + popup Popover
 */
const FilterCard = ({ filters, onFilterChange, onReset, metadata = { categories: [], statuses: [], locations: [] }, loading = false }) => {
  const [open, setOpen] = useState(false);
  // Draft state — perubahan filter dalam popup, belum diterapkan ke parent
  const [draft, setDraft] = useState({ ...filters });

  // Sync draft saat popup dibuka
  useEffect(() => {
    if (open) setDraft({ ...filters });
  }, [open]);

  const categories = metadata.categories || [];
  const locations = metadata.locations || [];

  const handleDraftChange = (key, value) => {
    setDraft(prev => ({ ...prev, [key]: value }));
  };

  const clearField = (key) => {
    const defaultVal = key === 'categories' ? [] : key === 'dateRange' ? null : '';
    handleDraftChange(key, defaultVal);
  };

  const handleApply = () => {
    onFilterChange(draft);
    setOpen(false);
  };

  const handleReset = () => {
    const resetState = { search: '', categories: [], status: '', priority: '', location: '', dateRange: null };
    setDraft(resetState);
    onFilterChange(resetState);
    setOpen(false);
  };

  // Hitung jumlah filter aktif (untuk badge)
  const activeCount = [
    filters.categories?.length > 0,
    !!filters.status,
    !!filters.priority,
    !!filters.location,
    !!filters.dateRange,
    !!filters.search,
  ].filter(Boolean).length;

  const labelClass = 'text-[11px] text-gray-400 font-semibold uppercase tracking-wide';
  const clearClass = 'text-[11px] text-blue-500 hover:text-blue-600 cursor-pointer font-medium';

  const popoverContent = (
    <div className="w-[340px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[15px] font-bold text-gray-800">Filter</span>
        <CloseOutlined
          className="text-gray-400 hover:text-gray-600 cursor-pointer text-xs"
          onClick={() => setOpen(false)}
        />
      </div>

      {/* Filter: Tanggal */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className={labelClass}>Pilih Tanggal</span>
          {draft.dateRange && <span className={clearClass} onClick={() => clearField('dateRange')}>Clear</span>}
        </div>
        <RangePicker
          size="small"
          className="w-full rounded-lg"
          placeholder={['Dari', 'Sampai']}
          format="DD-MM-YYYY"
          value={draft.dateRange || null}
          onChange={(dates) => handleDraftChange('dateRange', dates)}
        />
      </div>

      <Divider className="my-3" />

      {/* Filter: Kategori */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className={labelClass}>Kategori</span>
          {draft.categories?.length > 0 && <span className={clearClass} onClick={() => clearField('categories')}>Clear</span>}
        </div>
        {loading && categories.length === 0 ? (
          <Skeleton.Button active block size="small" className="h-8 rounded-lg" />
        ) : (
          <Select
            mode="multiple"
            size="small"
            placeholder="Pilih kategori"
            className="w-full [&>.ant-select-selector]:!rounded-lg"
            value={draft.categories}
            onChange={(val) => handleDraftChange('categories', val)}
            options={categories.map(c => ({ label: c.charAt(0) + c.slice(1).toLowerCase(), value: c }))}
            maxTagCount={2}
            maxTagTextLength={10}
          />
        )}
      </div>

      <Divider className="my-3" />

      {/* Filter: Status */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className={labelClass}>Status</span>
          {draft.status && <span className={clearClass} onClick={() => clearField('status')}>Clear</span>}
        </div>
        <Select
          size="small"
          placeholder="Pilih status"
          className="w-full [&>.ant-select-selector]:!rounded-lg"
          value={draft.status || undefined}
          onChange={(val) => handleDraftChange('status', val)}
          allowClear
          onClear={() => clearField('status')}
          options={['Berjalan', 'Beresiko', 'Tertunda', 'Selesai'].map(s => ({
            label: (
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: STATUS_DOTS[s] }} />
                {s}
              </div>
            ),
            value: s,
          }))}
        />
      </div>

      <Divider className="my-3" />

      {/* Filter: Prioritas */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className={labelClass}>Prioritas</span>
          {draft.priority && <span className={clearClass} onClick={() => clearField('priority')}>Clear</span>}
        </div>
        <Select
          size="small"
          placeholder="Pilih prioritas"
          className="w-full [&>.ant-select-selector]:!rounded-lg"
          value={draft.priority || undefined}
          onChange={(val) => handleDraftChange('priority', val)}
          allowClear
          onClear={() => clearField('priority')}
          options={['Rendah', 'Sedang', 'Tinggi'].map(p => ({
            label: (
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: PRIORITY_DOTS[p] }} />
                {p}
              </div>
            ),
            value: p,
          }))}
        />
      </div>

      <Divider className="my-3" />

      {/* Filter: Lokasi */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className={labelClass}>Lokasi</span>
          {draft.location && <span className={clearClass} onClick={() => clearField('location')}>Clear</span>}
        </div>
        <Select
          size="small"
          showSearch
          placeholder="Ketik atau pilih lokasi"
          className="w-full [&>.ant-select-selector]:!rounded-lg"
          value={draft.location || undefined}
          onChange={(val) => handleDraftChange('location', val)}
          allowClear
          onClear={() => clearField('location')}
          options={locations.map(loc => ({ label: loc, value: loc }))}
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
        />
      </div>

      <Divider className="my-3" />

      {/* Filter: Search by Keyword */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-1.5">
          <span className={labelClass}>Cari Keyword</span>
          {draft.search && <span className={clearClass} onClick={() => clearField('search')}>Clear</span>}
        </div>
        <Input
          size="small"
          placeholder="Cari..."
          prefix={<SearchOutlined className="text-gray-300" />}
          allowClear
          className="rounded-lg"
          value={draft.search}
          onChange={(e) => handleDraftChange('search', e.target.value)}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-1">
        <Button type="text" size="small" onClick={handleReset} className="text-[12px] text-gray-400 hover:!text-red-500 font-medium px-0">
          Reset
        </Button>
        <Button type="primary" size="small" onClick={handleApply} className="rounded-lg px-5 text-[12px] font-semibold shadow-sm">
          Terapkan
        </Button>
      </div>
    </div>
  );

  return (
    <Popover
      content={popoverContent}
      trigger="click"
      open={open}
      onOpenChange={setOpen}
      placement="bottomRight"
      overlayInnerStyle={{ padding: '16px 20px', borderRadius: 12 }}
      arrow={false}
    >
      <Badge count={activeCount} size="small" offset={[-2, 2]}>
        <Button
          icon={<FilterOutlined />}
          className="rounded-lg border-gray-200 text-[12px] font-medium"
          size="small"
        >
          Filter
        </Button>
      </Badge>
    </Popover>
  );
};

export default FilterCard;
