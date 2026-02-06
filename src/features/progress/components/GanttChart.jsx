import React, { useState } from 'react';
import { Card, Tag, Collapse, Typography, Row, Col } from 'antd';
import { DownOutlined, RightOutlined } from '@ant-design/icons';

const { Panel } = Collapse;
const { Text } = Typography;

// --- 1. Data Dummy Sesuai Gambar ---
const months = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const categories = [
  {
    title: 'Drilling',
    count: 3,
    projects: [
      { id: 'DRL-01', name: 'Project 1', start: 3, duration: 2, status: 'Berjalan' }, // Mulai Maret (Index 2), Durasi 2
      { id: 'DRL-02', name: 'Project 2', start: 4, duration: 4, status: 'Berjalan' },
      { id: 'DRL-03', name: 'Project 3', start: 8, duration: 5, status: 'Tertunda' },
    ]
  },
  {
    title: 'Operation',
    count: 3,
    projects: [
      { id: 'OPS-01', name: 'Project 1', start: 3, duration: 3, status: 'Berjalan' },
      { id: 'OPS-02', name: 'Project 2', start: 4, duration: 3, status: 'Terhenti' },
      { id: 'OPS-03', name: 'Project 3', start: 8, duration: 4, status: 'Tertunda' },
    ]
  },
  {
    title: 'Facility',
    count: 3,
    projects: [
      { id: 'FCL-01', name: 'Project 1', start: 2, duration: 4, status: 'Berjalan' },
      { id: 'FCL-02', name: 'Project 2', start: 3, duration: 4, status: 'Berjalan' },
      { id: 'FCL-03', name: 'Project 3', start: 7, duration: 3, status: 'Tertunda' },
    ]
  }
];

// --- 2. Helper Warna ---
const getStatusColor = (status) => {
  switch (status) {
    case 'Berjalan': return '#52c41a'; // Hijau
    case 'Terhenti': return '#ff4d4f'; // Merah
    case 'Tertunda': return '#fadb14'; // Kuning
    default: return '#ccc';
  }
};

const getLighterColor = (status) => {
   // Warna transparan untuk ekor bar (sesuai efek di gambar)
  switch (status) {
    case 'Berjalan': return '#b7eb8f'; 
    case 'Terhenti': return '#ffccc7'; 
    case 'Tertunda': return '#fffb8f'; 
    default: return '#f0f0f0';
  }
};

const GanttChart = () => {
  return (
    <div style={{ background: '#fff', padding: 24, borderRadius: 8 }}>
      
      {/* HEADER GRID (Bulan) */}
      <div style={{ display: 'flex', borderBottom: '1px solid #f0f0f0', paddingBottom: 10, marginBottom: 10 }}>
        {/* Kolom Kiri Kosong (Untuk Nama Project) */}
        <div style={{ width: 250, flexShrink: 0, fontWeight: 'bold', paddingLeft: 10 }}>Project</div>
        
        {/* Kolom Kanan (Jan-Des) */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)' }}>
          {months.map((m) => (
            <div key={m} style={{ fontSize: 12, fontWeight: 'bold', textAlign: 'center', borderLeft: '1px solid #f0f0f0' }}>
              {m}
            </div>
          ))}
        </div>
      </div>

      {/* CONTENT (Accordion Categories) */}
      <Collapse 
        defaultActiveKey={['0', '1', '2']} 
        ghost 
        expandIconPosition="start"
      >
        {categories.map((cat, index) => (
          <Panel 
            header={<span style={{ fontWeight: 'bold' }}>{cat.title} <Tag style={{ marginLeft: 8 }}>{cat.count}</Tag></span>} 
            key={index}
          >
            {/* Loop Projects dalam Kategori */}
            {cat.projects.map((proj) => (
              <div key={proj.id} style={{ display: 'flex', alignItems: 'center', height: 50, borderBottom: '1px dashed #f5f5f5' }}>
                
                {/* Kolom Kiri: Info Project */}
                <div style={{ width: 250, flexShrink: 0, paddingLeft: 24 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{proj.name}</div>
                  <div style={{ color: '#999', fontSize: 11 }}>{proj.id}</div>
                </div>

                {/* Kolom Kanan: Bar Timeline */}
                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', height: '100%', position: 'relative' }}>
                  
                  {/* Grid Lines Background */}
                  {months.map((_, i) => (
                    <div key={i} style={{ borderLeft: '1px solid #f9f9f9', height: '100%' }}></div>
                  ))}

                  {/* THE BAR */}
                  <div 
                    style={{
                      position: 'absolute',
                      top: '15%',
                      height: '70%',
                      borderRadius: 4,
                      // Logic Grid: gridColumnStart & Span
                      gridColumnStart: proj.start + 1, // +1 karena grid line start dari 1
                      gridColumnEnd: `span ${proj.duration}`,
                      
                      // Style Warna (Gradient effect CSS manual)
                      background: `linear-gradient(90deg, ${getStatusColor(proj.status)} 50%, ${getLighterColor(proj.status)} 50%)`,
                      display: 'flex',
                      alignItems: 'center',
                      paddingLeft: 10,
                      color: '#fff',
                      fontSize: 10,
                      fontWeight: 'bold',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  >
                    {proj.id}
                  </div>

                </div>
              </div>
            ))}
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};

export default GanttChart;