/**
 * @file KpiRow.jsx
 * @description Komponen baris KPI (Key Performance Indicator) untuk halaman Postur Proyek.
 * Menampilkan 4 card: Total Proyek, SPI (Speedometer), CPI (Speedometer), dan Jumlah Berisiko.
 * Menghitung agregat data berdasarkan metrik yang difilter.
 */

import React, { useMemo } from 'react';
import { Row, Col, Card } from 'antd';
import {
  ProjectOutlined,
  AlertOutlined,
} from '@ant-design/icons';
import PremiumTooltip from '../../../components/ui/ProjectTooltip';

/**
 * Komponen grafik Speedometer untuk SPI dan CPI.
 * Area merah untuk nilai < 1.0, area warna hijau untuk nilai >= 1.0.
 *
 * @param {Object} props
 * @param {number} props.value - Nilai performa yang ditampilkan (target 1.0).
 * @param {number} [props.size=68] - Lebar grafik SVG.
 * @returns {JSX.Element} Grafik speedometer setengah lingkaran.
 */
const SpeedometerGauge = ({ value, size = 68 }) => {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const halfCircumference = circumference / 2;

  const cx = size / 2;
  const cy = size / 2;

  const maxVal = 1.5;
  const targetVal = 1.0;

  const redPct = targetVal / maxVal;
  const greenPct = (maxVal - targetVal) / maxVal;

  const redDash = `${halfCircumference * redPct} ${circumference}`;
  const greenDash = `${halfCircumference * greenPct} ${circumference}`;

  const pct = Math.min(Math.max(value / maxVal, 0), 1);
  const needleAngle = -180 + (pct * 180);

  const valueColor = value >= targetVal ? '#52c41a' : '#ff4d4f';

  return (
    <div className="flex flex-col items-center justify-center pt-2">
      <svg width={size} height={size / 2 + strokeWidth / 2} className="overflow-visible block">
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="#ff4d4f"
          strokeOpacity={0.8}
          strokeWidth={strokeWidth}
          strokeDasharray={redDash}
          transform={`rotate(-180 ${cx} ${cy})`}
        />
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="#52c41a"
          strokeOpacity={0.8}
          strokeWidth={strokeWidth}
          strokeDasharray={greenDash}
          transform={`rotate(${-180 + (redPct * 180)} ${cx} ${cy})`}
        />

        <line
          x1={cx}
          y1={cy}
          x2={cx + radius - 4}
          y2={cy}
          stroke="#374151"
          strokeWidth={2.5}
          strokeLinecap="round" className="transition-all duration-700 ease-out"
          transform={`rotate(${needleAngle} ${cx} ${cy})`}
        />
        <circle cx={cx} cy={cy} r={4} fill="#374151" />
      </svg>
      <div className="font-bold text-[13px] mt-1.5 leading-none" style={{ color: valueColor }}>
        {value}
      </div>
    </div>
  );
};

/**
 * Baris KPI yang menampilkan ringkasan performa 4 elemen.
 *
 * @param {Object} props
 * @param {Array<Object>} [props.data=[]] - Array data proyek hasil filter lokal.
 * @param {boolean} [props.loading=false] - Status loading.
 * @returns {JSX.Element} Grid 4 kolom berisi card pengukuran performa.
 */
const KpiRow = ({ data = [], stats, loading = false }) => {
  const m = useMemo(() => {
    if (stats) {
      return {
        total: stats.total,
        spi: stats.spiAvg,
        cpi: stats.cpiAvg,
        atRisk: stats.atRisk,
        onTrack: stats.onTrack
      };
    }

    // Fallback jika stats belum ada (biasanya saat data.length == 0 atau loading)
    return { total: 0, spi: "0.00", cpi: "0.00", atRisk: 0, onTrack: 0 };
  }, [stats]);

  const spiColor = m.spi >= 1 ? '#52c41a' : '#ff4d4f';
  const cpiColor = m.cpi >= 1 ? '#52c41a' : '#ff4d4f';

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
          <SpeedometerGauge value={m.spi} size={68} />
          <div>
            <p className="text-[11px] font-bold m-0" style={{ color: spiColor }}>
              {m.spi >= 1 ? 'Tepat Jadwal' : 'Tertinggal'}
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
          <SpeedometerGauge value={m.cpi} size={68} />
          <div>
            <p className="text-[11px] font-bold m-0" style={{ color: cpiColor }}>
              {m.cpi >= 1 ? 'Efisien' : 'Melebihi Anggaran'}
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
              {loading ? (
                <div className="flex items-center gap-3">
                  <Skeleton.Avatar active shape="square" size={40} className="w-10 h-10 rounded-lg" />
                  <div className="flex flex-col flex-1 gap-1">
                    <Skeleton.Button active size="small" className="h-6 w-16" />
                    <Skeleton.Button active size="small" className="h-3 w-24" />
                  </div>
                </div>
              ) : (
                kpi.content
              )}
            </Card>
          </PremiumTooltip>
        </Col>
      ))}
    </Row>
  );
};

export default KpiRow;
