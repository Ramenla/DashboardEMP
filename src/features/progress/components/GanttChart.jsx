import React, { useRef, useEffect, useMemo, useState } from 'react';
import { Tag, Tooltip, Empty } from 'antd';
import { DownOutlined, RightOutlined } from '@ant-design/icons';

// --- Helper Warna & Tanggal ---
const getColors = (status) => {
  switch (status) {
    case 'Berjalan': return { main: '#00b96b', light: '#d9f7be' };
    case 'Terhenti': 
    case 'Kritis': return { main: '#ff4d4f', light: '#ffccc7' };
    case 'Tertunda': return { main: '#faad14', light: '#ffe58f' };
    default: return { main: '#d9d9d9', light: '#f5f5f5' };
  }
};

const parseDate = (dateStr) => new Date(dateStr);

const getDaysDiff = (start, end) => {
  const oneDay = 1000 * 60 * 60 * 24;
  return (end - start) / oneDay; // Hapus Math.round agar kalkulasi presisi (float)
};

// --- STYLE CONSTANTS ---
const SIDEBAR_WIDTH = 280; 
const STICKY_LEFT_STYLE = {
  position: 'sticky',
  left: 0,
  width: SIDEBAR_WIDTH,
  minWidth: SIDEBAR_WIDTH,
  background: '#fff', 
  borderRight: '1px solid #e8e8e8',
  zIndex: 100, // NAIKKAN Z-INDEX: Agar pasti di atas marker
  display: 'flex',
  alignItems: 'center',
  padding: '0 16px',
  boxSizing: 'border-box',
  boxShadow: '4px 0 8px rgba(0,0,0,0.02)'
};

const GanttChart = ({ data = [], viewMode = 'Monthly', onProjectClick }) => {
  const [expandedKeys, setExpandedKeys] = useState(['0', '1', '2', '3', '4']);

  const toggleCategory = (key) => {
    setExpandedKeys(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  };

  // --- 1. LOGIC: RANGE TANGGAL ---
  const { minDate, maxDate, totalDays } = useMemo(() => {
    let allStarts = [];
    let allEnds = [];
    
    data.forEach(cat => {
      cat.projects.forEach(p => {
        allStarts.push(parseDate(p.startDate));
        allEnds.push(parseDate(p.endDate));
      });
    });

    if (allStarts.length === 0) {
        return { minDate: new Date(), maxDate: new Date(), totalDays: 30 };
    }

    let min = new Date(Math.min(...allStarts));
    let max = new Date(Math.max(...allEnds));

    min.setDate(min.getDate() - 3);
    max.setDate(max.getDate() + 3);

    if (viewMode === 'Monthly') {
        min = new Date(min.getFullYear(), 0, 1);
        max = new Date(max.getFullYear(), 11, 31);
    }

    const days = getDaysDiff(min, max); // Hapus +1 agar sinkron dengan width
    return { minDate: min, maxDate: max, totalDays: days };
  }, [data, viewMode]);


  // --- 2. CONFIG VIEW ---
  const config = useMemo(() => {
    const colWidth = viewMode === 'Daily' ? 30 : viewMode === 'Weekly' ? 40 : 'minmax(40px, 1fr)';
    
    const generateHeaders = () => {
        const topRow = [];
        const bottomRow = [];
        let currentDate = new Date(minDate);
        let colIndex = 1;

        if (viewMode === 'Daily') {
             while (currentDate <= maxDate) {
                 const dayOfMonth = currentDate.getDate();
                 const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
                 
                 bottomRow.push(
                     <div key={`d-${colIndex}`} style={{ gridColumn: colIndex, textAlign: 'center', fontSize: 10, borderRight: '1px solid #f0f0f0', padding: '6px 0', color: '#666' }}>
                         {dayOfMonth}
                     </div>
                 );
                 
                 if (dayOfMonth === 1 || colIndex === 1) {
                     const remainingInMonth = daysInMonth - dayOfMonth + 1;
                     const remainingInGrid = Math.round(getDaysDiff(currentDate, maxDate)) + 1;
                     const span = Math.min(remainingInMonth, remainingInGrid);
                     
                     topRow.push(
                         <div key={`m-${colIndex}`} style={{
                             gridColumn: `${colIndex} / span ${span}`, textAlign: 'left', paddingLeft: 8,
                             fontSize: 11, fontWeight: 'bold', borderRight: '1px solid #e0e0e0', background: '#fafafa',
                             color: '#333', textTransform: 'uppercase', letterSpacing: 1, padding: '6px 0'
                         }}>
                             {currentDate.toLocaleString('id-ID', { month: 'long', year: 'numeric' })}
                         </div>
                     );
                 }
                 currentDate.setDate(currentDate.getDate() + 1);
                 colIndex++;
             }
        } 
        else if (viewMode === 'Weekly') {
             while (currentDate <= maxDate) {
                 bottomRow.push(
                     <div key={`w-${colIndex}`} style={{ gridColumn: colIndex, textAlign: 'center', fontSize: 10, borderRight: '1px solid #f0f0f0', padding: '6px 0' }}>
                         {currentDate.getDate()}
                     </div>
                 );
                 if ((colIndex - 1) % 4 === 0) {
                     topRow.push(
                        <div key={`mw-${colIndex}`} style={{
                             gridColumn: `${colIndex} / span 4`, textAlign: 'left', paddingLeft: 8,
                             fontSize: 11, fontWeight: 'bold', borderRight: '1px solid #e0e0e0', background: '#fafafa', padding: '6px 0'
                         }}>
                             {currentDate.toLocaleString('id-ID', { month: 'short' })}
                         </div>
                     );
                 }
                 currentDate.setDate(currentDate.getDate() + 7);
                 colIndex++;
             }
        }
        else {
             for(let i=0; i < 12; i++) {
                 const d = new Date(new Date().getFullYear(), i, 1);
                 topRow.push(
                     <div key={`mm-${i}`} style={{ gridColumn: i+1, textAlign: 'center', fontSize: 11, fontWeight: 'bold', borderRight: '1px solid #f0f0f0', padding: '12px 0' }}>
                         {d.toLocaleString('id-ID', { month: 'long' })}
                     </div>
                 );
             }
        }
        return { topRow, bottomRow };
    };

    const headers = generateHeaders();
    return {
        colWidth,
        totalCols: viewMode === 'Monthly' ? 12 : headers.bottomRow.length,
        headers
    };
  }, [viewMode, minDate, maxDate]);


  // --- 3. FIX: AKURASI TODAY MARKER ---
  // Kita ganti logika persentase waktu murni menjadi logika berbasis GRID
  const todayPositionLeft = useMemo(() => {
    const today = new Date();
    if (today < minDate || today > maxDate) return null;

    if (viewMode === 'Monthly') {
        // PERBAIKAN MONTHLY: Hitung berdasarkan Kolom Bulan (12 Kolom)
        // 1 Kolom = 100% / 12 = 8.333%
        const monthIndex = today.getMonth(); // 0 - 11
        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        const currentDay = today.getDate(); // 1 - 31
        
        // Progress dalam bulan ini (0.0 - 1.0)
        const monthProgress = (currentDay - 1) / daysInMonth; 
        
        // Posisi Total = (IndexBulan + ProgressBulan) / 12 * 100
        return ((monthIndex + monthProgress) / 12) * 100;
    } 
    
    else if (viewMode === 'Weekly') {
        // PERBAIKAN WEEKLY: Hitung berdasarkan Minggu Grid
        const diffTime = today.getTime() - minDate.getTime();
        const diffDays = diffTime / (1000 * 3600 * 24);
        
        // Posisi dalam satuan minggu (misal: 4.5 minggu)
        const currentWeekPos = diffDays / 7;
        
        // Total minggu dalam grid
        const totalWeeksInGrid = Math.ceil(totalDays / 7); // Gunakan ceil sesuai logic render header
        
        return (currentWeekPos / totalWeeksInGrid) * 100;
    } 
    
    else {
        // PERBAIKAN DAILY: Hitung berdasarkan Hari Grid
        const diffTime = today.getTime() - minDate.getTime();
        const diffDays = diffTime / (1000 * 3600 * 24);
        return (diffDays / totalDays) * 100;
    }
  }, [minDate, maxDate, viewMode, totalDays]);


  // --- 4. BAR POSITION LOGIC ---
  const getBarPosition = (startStr, endStr) => {
    const s = parseDate(startStr);
    const e = parseDate(endStr);
    const offset = Math.round(getDaysDiff(minDate, s));
    const duration = Math.round(getDaysDiff(s, e)) + 1;

    if (viewMode === 'Monthly') {
        const sm = s.getMonth();
        const em = e.getMonth();
        return { col: Math.max(0, sm) + 1, span: Math.max(1, (em - sm) + 1) };
    } else if (viewMode === 'Weekly') {
        const startWeek = Math.floor(offset / 7) + 1;
        const spanWeek = Math.max(1, Math.ceil(duration / 7));
        return { col: startWeek, span: spanWeek };
    } else {
        return { col: offset + 1, span: duration };
    }
  };

  const gridTemplateColumns = typeof config.colWidth === 'string' 
      ? `repeat(${config.totalCols}, ${config.colWidth})`
      : `repeat(${config.totalCols}, ${config.colWidth}px)`;

  const timelineWidth = viewMode === 'Monthly' ? '100%' : 'max-content';

  return (
    <div style={{ 
        background: '#fff', borderRadius: 8, border: '1px solid #f0f0f0', 
        overflowX: 'auto', overflowY: 'hidden', position: 'relative'
    }}>
      
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: '100%', width: timelineWidth }}>
        
        {/* === HEADER === */}
        <div style={{ display: 'flex', borderBottom: '1px solid #f0f0f0', height: 64 }}>
            {/* STICKY SIDEBAR: HEADER */}
            <div style={{ ...STICKY_LEFT_STYLE, background: '#fafafa', fontSize: 14 }}>
                Project Timeline
            </div>
            
            {/* SCROLLABLE TIMELINE: HEADER */}
            <div style={{ flexGrow: 1, display: 'grid', gridTemplateColumns: gridTemplateColumns, position: 'relative' }}>
                
                {/* TODAY MARKER (HEADER PART) */}
                {todayPositionLeft !== null && (
                    <div style={{
                        position: 'absolute',
                        left: `${todayPositionLeft}%`, // PAKAI LOGIKA BARU
                        top: 70, bottom: 0,
                        borderLeft: '2px dashed #ff4d4f',
                        zIndex: 10 // Pastikan di bawah sticky sidebar (yang z-index 100)
                    }}>
                        <div style={{
                            width: 8, height: 8, background: '#ff4d4f', borderRadius: '50%', 
                            position: 'absolute', top: -4, left: -5, boxShadow: '0 0 4px rgba(0,0,0,0.2)'
                        }} />
                    </div>
                )}

                {/* Grid Rows */}
                {viewMode !== 'Monthly' && (
                    <div style={{ gridColumn: `1 / -1`, display: 'grid', gridTemplateColumns: 'subgrid', borderBottom: '1px solid #f0f0f0', height: 32, alignItems: 'center' }}>
                            {config.headers.topRow}
                    </div>
                )}
                <div style={{ gridColumn: `1 / -1`, display: 'grid', gridTemplateColumns: 'subgrid', height: 32, alignItems: 'center', background: '#fff' }}>
                    {viewMode === 'Monthly' ? config.headers.topRow : config.headers.bottomRow}
                </div>
            </div>
        </div>

        {/* === BODY === */}
        <div style={{ background: '#fff' }}>
            {data.length === 0 ? <Empty description="Tidak ada data project" style={{margin: 20}} /> : (
                <>
                {data.map((cat, idx) => {
                    const isExpanded = expandedKeys.includes(String(idx));
                    
                    return (
                        <React.Fragment key={idx}>
                            
                            {/* CATEGORY ROW */}
                            <div 
                                style={{ display: 'flex', borderBottom: '1px solid #f0f0f0', cursor: 'pointer', height: 40, position: 'relative' }}
                                onClick={() => toggleCategory(String(idx))}
                            >
                                {/* STICKY SIDEBAR: CATEGORY */}
                                <div style={{ 
                                    ...STICKY_LEFT_STYLE, 
                                    zIndex: 100, // Di bawah header
                                    background: '#f8f8f8', 
                                    gap: 8
                                }}>
                                    {isExpanded ? <DownOutlined style={{fontSize:10}}/> : <RightOutlined style={{fontSize:10}}/>}
                                    <span style={{fontWeight:'bold', fontSize: 12, textTransform:'uppercase', color: '#555'}}>{cat.title}</span>
                                    <Tag style={{marginLeft:'auto', borderRadius:10, fontSize: 10, border:'none'}}>{cat.projects.length}</Tag>
                                </div>

                                {/* TIMELINE GRID BACKGROUND */}
                                <div style={{ flexGrow: 1, display: 'grid', gridTemplateColumns: gridTemplateColumns, position: 'relative' }}>
                                    
                                     {/* Background Lines */}
                                     {Array.from({length: config.totalCols}).map((_, c) => (
                                        <div key={c} style={{ gridColumn: c+1, borderRight:'1px solid #f9f9f9', height:'100%' }}></div>
                                    ))}

                                    {/* TODAY MARKER (CATEGORY PART) */}
                                    {todayPositionLeft !== null && (
                                        <div style={{
                                            position: 'absolute', left: `${todayPositionLeft}%`, top: 0, bottom: 0,
                                            borderLeft: '2px dashed #ff4d4f', zIndex: 1
                                        }}></div>
                                    )}
                                </div>
                            </div>

                            {/* PROJECT ROWS */}
                            {isExpanded && cat.projects.map(proj => {
                                const pos = getBarPosition(proj.startDate, proj.endDate);
                                if (pos.col < 1) return null;
                                const colors = getColors(proj.status);

                                return (
                                    <div key={proj.id} style={{ display: 'flex', height: 50, borderBottom: '1px solid #f5f5f5', alignItems:'center', position: 'relative' }}>
                                        
                                        {/* STICKY SIDEBAR: PROJECT NAME */}
                                        <div style={{ 
                                            ...STICKY_LEFT_STYLE, 
                                            zIndex: 100, // Base level sticky
                                            display: 'block', paddingTop: 30
                                        }}>
                                            <div style={{ fontSize:13, fontWeight:600, color: '#262626', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{proj.name}</div>
                                            <div style={{ fontSize:10, color:'#8c8c8c', fontFamily: 'monospace', marginTop: 2 }}>{proj.id}</div>
                                        </div>

                                        {/* TIMELINE AREA */}
                                        <div style={{ flexGrow: 1, height: '100%', display: 'grid', gridTemplateColumns: gridTemplateColumns, position: 'relative' }}>
                                            
                                            {/* Grid Lines */}
                                            {Array.from({length: config.totalCols}).map((_, c) => (
                                                <div key={c} style={{ gridColumn: c+1, borderRight:'1px solid #fafafa', height:'100%' }}></div>
                                            ))}

                                            {/* TODAY MARKER (PROJECT PART) */}
                                            {todayPositionLeft !== null && (
                                                <div style={{
                                                    position: 'absolute',
                                                    left: `${todayPositionLeft}%`,
                                                    top: 0, bottom: 0,
                                                    borderLeft: '2px dashed #ff4d4f',
                                                    zIndex: 2, 
                                                    pointerEvents: 'none'
                                                }}></div>
                                            )}

                                            {/* PROJECT BAR */}
                                            <Tooltip title={`${proj.name} (${proj.progress}%)`}>
                                                <div 
                                                    onClick={() => onProjectClick && onProjectClick(proj)}
                                                    style={{
                                                        gridColumn: `${pos.col} / span ${pos.span}`,
                                                        background: `linear-gradient(to right, ${colors.main} ${proj.progress}%, ${colors.light} ${proj.progress}%)`,
                                                        height: 24, marginTop: 13, borderRadius: 4, cursor: 'pointer',
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                        fontSize: 10, color: '#fff', display:'flex', alignItems:'center', paddingLeft: 8, fontWeight:'bold', 
                                                        whiteSpace: 'nowrap', overflow: 'hidden', position:'relative', 
                                                        zIndex: 5,
                                                        transition: 'all 0.2s',
                                                        border: `1px solid ${colors.main}`
                                                    }}
                                                    onMouseEnter={(e)=>e.currentTarget.style.transform='scaleY(1.1)'}
                                                    onMouseLeave={(e)=>e.currentTarget.style.transform='scaleY(1)'}
                                                >
                                                    {pos.span > 2 && proj.name}
                                                </div>
                                            </Tooltip>
                                        </div>
                                    </div>
                                );
                            })}
                        </React.Fragment>
                    );
                })}
                </>
            )}
        </div>
      </div>
    </div>
  );
};

export default GanttChart;