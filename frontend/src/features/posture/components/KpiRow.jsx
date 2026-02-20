import React, { useMemo } from 'react';
import { Row, Col, Card } from 'antd';
import {
  ProjectOutlined,
  DashboardOutlined,
  DollarOutlined,
  AlertOutlined,
} from '@ant-design/icons';
import PremiumTooltip from '../../../components/ui/ProjectTooltip';

/**
 * mini radial gauge untuk menampilkan skor spi/cpi
 * menggunakan svg circle untuk visualisasi progress circular
 * @param {number} value - nilai 0-2 (1 = ideal)
 * @param {string} color - warna stroke
 * @param {number} size - ukuran svg
 * @returns {JSX.Element} mini gauge svg
 */
const MiniGauge = ({ value, color, size = 44 }) => {
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(value / 1.5, 1); // normalize ke max 1.5
  const offset = circumference * (1 - pct);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="#f0f0f0" strokeWidth={4}
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={4}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center text-[11px] font-bold"
        style={{ color }}
      >
        {value}
      </span>
    </div>
  );
};

/**
 * komponen kpi row menampilkan 4 metrik utama dashboard
 * total project, spi gauge, cpi gauge, at risk count
 * @param {Array} data - array project data yang sudah difilter
 * @returns {JSX.Element} row berisi 4 kpi cards
 */
const KpiRow = ({ data = [] }) => {
  const m = useMemo(() => {
    if (data.length === 0) return { total: 0, spi: 0, cpi: 0, atRisk: 0, onTrack: 0 };

    let spiSum = 0, cpiSum = 0, atRisk = 0, onTrack = 0;

    data.forEach((p) => {
      const valProgress = p.progress || 0;
      const valTarget = p.target || 1; // avoid div by zero
      const spi = valProgress / valTarget;
      spiSum += spi;

      // CPI = EV% / AC%
      // AC% = (Actual Cost / Total Budget) * 100
      const totalBudget = parseFloat(p.totalBudget) || 1;
      const actualCost = parseFloat(p.budgetUsed) || 0;
      const acPct = (actualCost / totalBudget) * 100;
      
      // EV% = progress
      const cpi = acPct > 0 ? valProgress / acPct : 1;
      cpiSum += cpi;

      if (spi >= 0.9 && p.status !== 'Beresiko') onTrack++;
      
      // Check if budget usage > 90%
      const budgetPct = (actualCost / totalBudget) * 100;
      if (p.status === 'Beresiko' || spi < 0.8 || budgetPct >= 90) atRisk++;
    });

    return {
      total: data.length,
      spi: (spiSum / data.length).toFixed(2),
      cpi: (cpiSum / data.length).toFixed(2),
      atRisk,
      onTrack,
    };
  }, [data]);

  const spiColor = m.spi >= 1 ? '#52c41a' : m.spi >= 0.8 ? '#faad14' : '#ff4d4f';
  const cpiColor = m.cpi >= 1 ? '#52c41a' : m.cpi >= 0.8 ? '#faad14' : '#ff4d4f';

  const cards = [
    {
      label: 'Total Proyek',
      tooltip: 'Jumlah seluruh proyek yang terdaftar di sistem',
      content: (
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50">
            <ProjectOutlined style={{ fontSize: 18, color: '#1890ff' }} />
          </div>
          <div>
            <span className="text-2xl font-bold text-gray-800">{m.total}</span>
            <p className="text-[10px] text-gray-400 m-0">{m.onTrack} sesuai target</p>
          </div>
        </div>
      ),
    },
    {
      label: 'Jadwal (SPI)',
      tooltip: 'Schedule Performance Index: Perbandingan progres aktual vs target (≥ 1.00 berarti tepat waktu)',
      content: (
        <div className="flex items-center gap-3">
          <MiniGauge value={m.spi} color={spiColor} />
          <div>
            <p className="text-[10px] m-0" style={{ color: spiColor }}>
              {m.spi >= 1 ? 'Tepat Jadwal' : m.spi >= 0.8 ? 'Sedikit Terlambat' : 'Tertinggal'}
            </p>
            <p className="text-[10px] text-gray-400 m-0">target ≥ 1.00</p>
          </div>
        </div>
      ),
    },
    {
      label: 'Biaya (CPI)',
      tooltip: 'Cost Performance Index: Perbandingan progres vs budget (≥ 1.00 berarti efisien)',
      content: (
        <div className="flex items-center gap-3">
          <MiniGauge value={m.cpi} color={cpiColor} />
          <div>
            <p className="text-[10px] m-0" style={{ color: cpiColor }}>
              {m.cpi >= 1 ? 'Efisien' : m.cpi >= 0.8 ? 'Sedikit Melebihi' : 'Melebihi Anggaran'}
            </p>
            <p className="text-[10px] text-gray-400 m-0">target ≥ 1.00</p>
          </div>
        </div>
      ),
    },
    {
      label: 'Berisiko',
      tooltip: 'Proyek dengan status Kritis, SPI < 0.8, atau budget terpakai > 90%',
      content: (
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-lg"
            style={{ backgroundColor: m.atRisk === 0 ? '#f6ffed' : m.atRisk <= 3 ? '#fffbe6' : '#fff2f0' }}
          >
            <AlertOutlined
              style={{ fontSize: 18, color: m.atRisk === 0 ? '#52c41a' : m.atRisk <= 3 ? '#faad14' : '#ff4d4f' }}
            />
          </div>
          <div>
            <span
              className="text-2xl font-bold"
              style={{ color: m.atRisk === 0 ? '#52c41a' : m.atRisk <= 3 ? '#faad14' : '#ff4d4f' }}
            >
              {m.atRisk}
            </span>
            <p className="text-[10px] text-gray-400 m-0">dari {m.total} project</p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <Row gutter={[12, 12]}>
      {cards.map((kpi) => (
        <Col xs={12} lg={6} key={kpi.label}>
          <PremiumTooltip title={kpi.tooltip}>
            <Card bordered={false} className="rounded-lg h-full [&>.ant-card-body]:!py-3 [&>.ant-card-body]:!px-4">
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider m-0 mb-2">
                {kpi.label}
              </p>
              {kpi.content}
            </Card>
          </PremiumTooltip>
        </Col>
      ))}
    </Row>
  );
};

export default KpiRow;
