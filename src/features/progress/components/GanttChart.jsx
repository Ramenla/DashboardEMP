import React, { useRef, useEffect, useMemo } from 'react';
import { Tag, Collapse, Tooltip, Empty } from 'antd';

const { Panel } = Collapse;

// --- Helper Warna & Tanggal ---
const getStatusColor = (status) => {
  switch (status) {
    case 'Berjalan': return '#52c41a';
    case 'Terhenti': return '#ff4d4f';
    case 'Kritis': return '#ff4d4f';
    case 'Tertunda': return '#faad14';
    default: return '#d9d9d9';
  }
};

const parseDate = (dateStr) => new Date(dateStr);

// Menghitung selisih hari antar dua tanggal
const getDaysDiff = (start, end) => {
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.round((end - start) / oneDay);
};

const GanttChart = ({ data = [], viewMode = 'Monthly', onProjectClick }) => {
  const scrollContainerRef = useRef(null);

  // --- 1. LOGIC: HITUNG RANGE TANGGAL OTOMATIS (AUTO-ZOOM) ---
  const { minDate, maxDate, totalDays } = useMemo(() => {
    // Kumpulkan semua tanggal start dan end dari seluruh project
    let allStarts = [];
    let allEnds = [];
    
    data.forEach(cat => {
      cat.projects.forEach(p => {
        allStarts.push(parseDate(p.startDate));
        allEnds.push(parseDate(p.endDate));
      });
    });

    if (allStarts.length === 0) {
        // Default tahun ini jika kosong
        return { minDate: new Date(2026, 0, 1), maxDate: new Date(2026, 11, 31), totalDays: 365 };
    }

    // Cari batas paling kiri dan paling kanan
    let min = new Date(Math.min(...allStarts));
    let max = new Date(Math.max(...allEnds));

    // Tambahkan Buffer (Jarak aman)
    // Jika Monthly: Paksa 1 Jan - 31 Dec (Biar rapi setahun)
    // Jika Daily/Weekly: Tambahkan buffer 1 minggu sebelum & sesudah biar gak mepet
    if (viewMode === 'Monthly') {
        min = new Date(min.getFullYear(), 0, 1);
        max = new Date(min.getFullYear(), 11, 31);
    } else {
        min.setDate(min.getDate() - 7); // Buffer kiri 7 hari
        max.setDate(max.getDate() + 7); // Buffer kanan 7 hari
    }

    const days = getDaysDiff(min, max);
    return { minDate: min, maxDate: max, totalDays: days };
  }, [data, viewMode]);


  // --- 2. CONFIG GRID BERDASARKAN MODE ---
  const config = useMemo(() => {
    switch (viewMode) {
      case 'Daily':
        return {
          colWidth: 30, // Pixel kecil agar muat banyak
          totalCols: totalDays,
          // Header Loop per Hari
          renderHeader: () => {
             // Agar tidak berat, kita render header per BULAN saja melingkupi hari-harinya
             // Logic manual untuk grouping header hari
             const headers = [];
             let currentDate = new Date(minDate);
             let colIndex = 1;
             
             while (currentDate <= maxDate) {
                const month = currentDate.toLocaleString('id-ID', { month: 'short' });
                const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
                const remainingDays = getDaysDiff(currentDate, maxDate) + 1;
                // Span selebar sisa bulan atau sisa range (mana yg lebih kecil)
                // Dikurangi tgl saat ini agar presisi (e.g. mulai tgl 15)
                const currentDay = currentDate.getDate();
                const daysLeftInMonth = daysInMonth - currentDay + 1;
                const span = Math.min(daysLeftInMonth, remainingDays);

                headers.push(
                    <div key={colIndex} style={{ 
                        gridColumn: `${colIndex} / span ${span}`, 
                        textAlign:'center', borderLeft:'1px solid #eee', fontSize:11, fontWeight:'bold', background:'#fafafa',
                        position: 'sticky', top: 0
                    }}>
                        {month} {currentDate.getDate()} - {new Date(currentDate.getTime() + (span-1)*86400000).getDate()}
                    </div>
                );
                
                // Maju ke loop berikutnya
                colIndex += span;
                currentDate.setDate(currentDate.getDate() + span);
             }
             return headers;
          }
        };
      case 'Weekly':
        return {
          colWidth: 20, // Lebih sempit agar "Setahun" bisa muat tanpa scroll parah
          totalCols: Math.ceil(totalDays / 7),
          renderHeader: () => {
             const headers = [];
             let col = 1;
             for(let i=0; i < Math.ceil(totalDays/7); i++) {
                 headers.push(
                    <div key={i} style={{ gridColumn: col, fontSize:10, textAlign:'center', borderLeft:'1px solid #eee' }}>
                        W{i+1}
                    </div>
                 );
                 col++;
             }
             return headers;
          }
        };
      case 'Monthly':
      default:
        return {
          colWidth: '1fr', // Fit screen (tanpa scroll)
          totalCols: 12,
          renderHeader: () => Array.from({length: 12}).map((_, i) => (
             <div key={i} style={{ textAlign:'center', fontSize:12, fontWeight:'bold', borderLeft: i===0?'none':'1px solid #f0f0f0' }}>
                 {new Date(2026, i, 1).toLocaleString('id-ID', { month: 'short' })}
             </div>
          ))
        };
    }
  }, [viewMode, totalDays, minDate, maxDate]);

  // CSS Grid Style
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: typeof config.colWidth === 'string' 
        ? `repeat(${config.totalCols}, ${config.colWidth})`
        : `repeat(${config.totalCols}, ${config.colWidth}px)`,
    width: viewMode === 'Monthly' ? '100%' : 'max-content', // Monthly fit screen, others scroll
    minWidth: '100%'
  };

  // --- 3. HELPER POSISI BAR ---
  const getBarPosition = (startStr, endStr) => {
    const s = parseDate(startStr);
    const e = parseDate(endStr);
    
    // Offset hari dari minDate (Titik 0 grafik)
    const startOffset = getDaysDiff(minDate, s);
    const duration = getDaysDiff(s, e); // Durasi real hari

    if (viewMode === 'Monthly') {
        // Konversi hari ke skala 12 kolom
        // Rumus kasar: (OffsetHari / 365) * 12
        // Tapi kita pakai startMonth saja agar rapi di grid
        const startMonth = s.getMonth(); 
        const endMonth = e.getMonth();
        const span = (endMonth - startMonth) + 1;
        return { colStart: startMonth + 1, span: span };
    } 
    else if (viewMode === 'Weekly') {
        // Konversi hari ke minggu
        const startWeek = Math.floor(startOffset / 7) + 1;
        const spanWeek = Math.ceil(duration / 7);
        return { colStart: startWeek, span: spanWeek || 1 };
    }
    else {
        // Daily: Mapping 1:1
        return { colStart: startOffset + 1, span: duration || 1 };
    }
  };


  // Scroll Reset
  useEffect(() => {
    if(scrollContainerRef.current) scrollContainerRef.current.scrollLeft = 0;
  }, [viewMode]);

  return (
    <div style={{ background: '#fff', padding: 24, borderRadius: 8 }}>
      
      {/* HEADER: PROJECT + TIMELINE */}
      <div style={{ display: 'flex', borderBottom: '1px solid #f0f0f0', paddingBottom: 10, marginBottom: 10 }}>
        <div style={{ width: 220, flexShrink: 0, fontWeight: 'bold', paddingLeft: 10 }}>Project Name</div>
        
        <div ref={scrollContainerRef} className="scrollbar-hide" style={{ flex: 1, overflowX: 'auto', ...gridStyle }}>
           {config.renderHeader()}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ maxHeight: '600px', overflowY: 'auto' }} className="scrollbar-hide">
        {data.length === 0 ? <Empty description="Tidak ada data project" /> : (
            <Collapse defaultActiveKey={['0', '1', '2']} ghost>
                {data.map((cat, idx) => (
                    <Panel header={<span style={{fontWeight:'bold'}}>{cat.title} <Tag>{cat.projects.length}</Tag></span>} key={idx}>
                        {cat.projects.map(proj => {
                            const pos = getBarPosition(proj.startDate, proj.endDate);
                            
                            // Skip jika project diluar range view (misal filter kalender memotongnya)
                            if (pos.colStart < 1) return null;

                            return (
                                <div key={proj.id} style={{ display: 'flex', height: 45, borderBottom: '1px dashed #f5f5f5', alignItems:'center' }}>
                                    
                                    {/* FIXED LEFT COL */}
                                    <div style={{ width: 220, flexShrink: 0, paddingLeft: 24, borderRight:'1px solid #f0f0f0' }}>
                                        <div style={{ fontSize:13, fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', width:180 }}>{proj.name}</div>
                                        <div style={{ fontSize:10, color:'#999' }}>{proj.startDate} - {proj.endDate}</div>
                                    </div>

                                    {/* SCROLLABLE RIGHT COL */}
                                    <div style={{ flex: 1, overflowX: 'auto', overflowY:'hidden', height:'100%' }}>
                                        <div style={{ ...gridStyle, height:'100%', position:'relative' }}>
                                            
                                            {/* GRID LINES */}
                                            {Array.from({length: config.totalCols}).map((_, c) => (
                                                <div key={c} style={{ gridColumn: c+1, borderLeft:'1px solid #f9f9f9', height:'100%' }}></div>
                                            ))}

                                            {/* BAR */}
                                            <Tooltip title={`${proj.name} (${proj.progress}%)`}>
                                                <div 
                                                    onClick={() => onProjectClick && onProjectClick(proj)}
                                                    style={{
                                                        gridColumn: `${pos.colStart} / span ${pos.span}`,
                                                        background: getStatusColor(proj.status),
                                                        height: 24,
                                                        marginTop: 10,
                                                        borderRadius: 4,
                                                        cursor: 'pointer',
                                                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                                                        fontSize: 10, color: '#fff', display:'flex', alignItems:'center', paddingLeft: 8, fontWeight:'bold',
                                                        whiteSpace: 'nowrap', overflow: 'hidden', position:'relative', zIndex: 5,
                                                        opacity: 0.9,
                                                        transition: 'all 0.2s'
                                                    }}
                                                    onMouseEnter={(e)=>{e.currentTarget.style.transform='scaleY(1.1)'; e.currentTarget.style.zIndex=10}}
                                                    onMouseLeave={(e)=>{e.currentTarget.style.transform='scaleY(1)'; e.currentTarget.style.zIndex=5}}
                                                >
                                                    {viewMode !== 'Daily' && proj.id}
                                                </div>
                                            </Tooltip>

                                        </div>
                                    </div>

                                </div>
                            );
                        })}
                    </Panel>
                ))}
            </Collapse>
        )}
      </div>
    </div>
  );
};

export default GanttChart;