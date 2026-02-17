import React, { useMemo, useState } from 'react';
import { Tag, Tooltip, Empty, Progress } from 'antd';
import { DownOutlined, RightOutlined } from '@ant-design/icons';

/**
 * helper function untuk mendapatkan warna project bar berdasarkan status
 * @param {string} status - status project (Berjalan, Kritis, Tertunda, dll)
 * @returns {Object} object dengan main color dan light color untuk gradient
 */
const getColors = (status) => {
  switch (status) {
    case 'Berjalan': return { main: '#00b96b', light: '#d9f7be' };
    case 'Kritis': return { main: '#ff4d4f', light: '#ffccc7' };
    case 'Tertunda': return { main: '#faad14', light: '#ffe58f' };
    default: return { main: '#d9d9d9', light: '#f5f5f5' };
  }
};

/**
 * parse string tanggal menjadi date object
 * @param {string} dateStr - string tanggal
 * @returns {Date} date object
 */
const parseDate = (dateStr) => new Date(dateStr);

/**
 * menghitung selisih hari antara dua tanggal
 * @param {Date} start - tanggal awal
 * @param {Date} end - tanggal akhir
 * @returns {number} jumlah hari
 */
const getDaysDiff = (start, end) => {
  const oneDay = 1000 * 60 * 60 * 24;
  return (end - start) / oneDay;
};

// konstanta style
const SIDEBAR_WIDTH = 280; 

/**
 * komponen gantt chart untuk menampilkan timeline project
 * mendukung 3 mode tampilan: daily, weekly, monthly
 * @param {Object} props - props komponen
 * @param {Array} props.data - array of categories dengan projects di dalamnya
 * @param {string} props.viewMode - mode tampilan: 'Daily', 'Weekly', atau 'Monthly'
 * @param {Function} props.onProjectClick - callback ketika project bar diklik
 * @returns {JSX.Element} gantt chart dengan category grouping dan expand/collapse
 */
const GanttChart = ({ data = [], viewMode = 'Monthly', onProjectClick }) => {
  const [expandedKeys, setExpandedKeys] = useState(['0', '1', '2', '3', '4']);

  /**
   * toggle expand/collapse untuk category
   * @param {string} key - key category yang akan di-toggle
   */
  const toggleCategory = (key) => {
    setExpandedKeys(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  };

  // range tanggal
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

    const currentYear = new Date().getFullYear();
    let min = new Date(Math.min(...allStarts));
    let max = new Date(Math.max(...allEnds));

    // untuk semua view, pastikan dimulai dari tahun berjalan
    const yearStart = new Date(currentYear, 0, 1);
    
    if (viewMode === 'Monthly') {
        // bulanan: selalu tampilkan jan-des tahun berjalan
        min = new Date(currentYear, 0, 1);
        max = new Date(currentYear, 11, 31);
    } else {
        // harian/mingguan: tambah buffer tapi jangan sebelum tahun berjalan
        min.setDate(min.getDate() - 3);
        max.setDate(max.getDate() + 3);
        
        // jangan tampilkan tanggal sebelum 1 januari tahun berjalan
        if (min < yearStart) {
            min = yearStart;
        }
    }

    const days = getDaysDiff(min, max);
    return { minDate: min, maxDate: max, totalDays: days };
  }, [data, viewMode]);


  // konfigurasi view
  const config = useMemo(() => {
    const colWidth = viewMode === 'Daily' ? 30 : viewMode === 'Weekly' ? 40 : 'minmax(40px, 1fr)';
    
    const generateHeaders = () => {
        const topRow = [];
        const bottomRow = [];
        let currentDate = new Date(minDate);
        let colIndex = 1;

        if (viewMode === 'Daily') {
             let lastMonthShown = -1; 
             while (currentDate <= maxDate) {
                 const dayOfMonth = currentDate.getDate();
                 const currentMonth = currentDate.getMonth();
                 const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
                 
                 bottomRow.push(
                     <div key={`d-${colIndex}`} style={{ gridColumn: colIndex }} className="text-center text-[10px] border-r border-gray-100 py-1.5 text-gray-500">
                         {dayOfMonth}
                     </div>
                 );
                 
                 // Show month header only when we encounter a new month
                 if (currentMonth !== lastMonthShown) {
                     const remainingInMonth = daysInMonth - dayOfMonth + 1;
                     const remainingInGrid = Math.round(getDaysDiff(currentDate, maxDate)) + 1;
                     const span = Math.min(remainingInMonth, remainingInGrid);
                     
                     topRow.push(
                         <div key={`m-${colIndex}`} style={{ gridColumn: `${colIndex} / span ${span}` }} className="text-left pl-2 text-[11px] font-bold border-r border-gray-200 bg-gray-50 text-gray-700 uppercase tracking-wide py-1.5">
                             {currentDate.toLocaleString('id-ID', { month: 'long', year: 'numeric' })}
                         </div>
                     );
                     lastMonthShown = currentMonth;
                 }
                 currentDate.setDate(currentDate.getDate() + 1);
                 colIndex++;
             }
        } 
        else if (viewMode === 'Weekly') {
             let lastWeeklyMonth = -1;
             let monthStartCol = 1;
             let monthStartDate = new Date(minDate);
             
             while (currentDate <= maxDate) {
                 const curMonth = currentDate.getMonth();
                 
                 bottomRow.push(
                     <div key={`w-${colIndex}`} style={{ gridColumn: colIndex }} className="text-center text-[10px] border-r border-gray-100 py-1.5">
                         {currentDate.getDate()}
                     </div>
                 );
                 
                 // When month changes, push the previous month header
                 if (curMonth !== lastWeeklyMonth) {
                     if (lastWeeklyMonth !== -1) {
                         const span = colIndex - monthStartCol;
                         topRow.push(
                             <div key={`mw-${monthStartCol}`} style={{ gridColumn: `${monthStartCol} / span ${Math.max(1, span)}` }} className="text-left pl-2 text-[11px] font-bold border-r border-gray-200 bg-gray-50 py-1.5">
                                 {monthStartDate.toLocaleString('id-ID', { month: 'short' })}
                             </div>
                         );
                     }
                     monthStartCol = colIndex;
                     monthStartDate = new Date(currentDate);
                     lastWeeklyMonth = curMonth;
                 }
                 
                 currentDate.setDate(currentDate.getDate() + 7);
                 colIndex++;
             }
             
             // tambahkan header bulan terakhir
             if (lastWeeklyMonth !== -1) {
                 const span = colIndex - monthStartCol;
                 topRow.push(
                     <div key={`mw-${monthStartCol}`} style={{ gridColumn: `${monthStartCol} / span ${Math.max(1, span)}` }} className="text-left pl-2 text-[11px] font-bold border-r border-gray-200 bg-gray-50 py-1.5">
                         {monthStartDate.toLocaleString('id-ID', { month: 'short' })}
                     </div>
                 );
             }
        }
        else {
             for(let i=0; i < 12; i++) {
                 const d = new Date(new Date().getFullYear(), i, 1);
                 topRow.push(
                     <div key={`mm-${i}`} style={{ gridColumn: i+1 }} className="text-center text-[11px] font-bold border-r border-gray-100 py-3">
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


  // posisi maker hari ini 
  const todayPositionLeft = useMemo(() => {
    const today = new Date();
    if (today < minDate || today > maxDate) return null;

    if (viewMode === 'Monthly') {
        const monthIndex = today.getMonth();
        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        const currentDay = today.getDate();
        const monthProgress = (currentDay - 1) / daysInMonth; 
        return ((monthIndex + monthProgress) / 12) * 100;
    } 
    else if (viewMode === 'Weekly') {
        // hitung posisi minggu dengan lebih akurat
        const diffTime = today.getTime() - minDate.getTime();
        const diffDays = diffTime / (1000 * 3600 * 24);
        const totalGridDays = getDaysDiff(minDate, maxDate);
        // persentase langsung berdasarkan jumlah hari
        return (diffDays / totalGridDays) * 100;
    } 
    else {
        const diffTime = today.getTime() - minDate.getTime();
        const diffDays = diffTime / (1000 * 3600 * 24);
        return (diffDays / totalDays) * 100;
    }
  }, [minDate, maxDate, viewMode, totalDays]);


  // logic posisi bar
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

  // style object sidebar sticky (dinamis karena konstanta width)
  const stickyLeftStyle = {
    position: 'sticky',
    left: 0,
    width: SIDEBAR_WIDTH,
    minWidth: SIDEBAR_WIDTH,
  };

  return (
    <div className="bg-white rounded-lg overflow-x-auto overflow-y-hidden relative">
      
      <div className="flex flex-col min-w-full" style={{ width: timelineWidth }}>
        
        {/* header */}
        <div className="flex border-b border-gray-100 h-16">
            {/* sidebar sticky: header */}
            <div style={stickyLeftStyle} className="bg-gray-50 border-r border-gray-200 z-[100] flex items-center px-4 text-sm shadow-[4px_0_8px_rgba(0,0,0,0.02)]">
                Timeline Proyek
            </div>
            
            {/* timeline scrollable: header */}
            <div className="flex-grow relative" style={{ display: 'grid', gridTemplateColumns: gridTemplateColumns }}>
                
                {/* marker hari ini (bagian header) */}
                {todayPositionLeft !== null && (
                    <div className="absolute z-10" style={{ left: `${todayPositionLeft}%`, top: 70, bottom: 0, borderLeft: '2px dashed #ff4d4f' }}>
                        <div className="w-2 h-2 bg-red-500 rounded-full absolute -top-1 -left-[5px] shadow" />
                    </div>
                )}

                {/* grid rows */}
                {viewMode !== 'Monthly' && (
                    <div className="border-b border-gray-100 h-8 items-center" style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'subgrid' }}>
                            {config.headers.topRow}
                    </div>
                )}
                <div className="h-8 items-center bg-white" style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'subgrid' }}>
                    {viewMode === 'Monthly' ? config.headers.topRow : config.headers.bottomRow}
                </div>
            </div>
        </div>

        {/* isi */}
        <div className="bg-white">
            {data.length === 0 ? <Empty description="Tidak ada data project" className="m-5" /> : (
                <>
                {data.map((cat, idx) => {
                    const isExpanded = expandedKeys.includes(String(idx));
                    
                    return (
                        <React.Fragment key={idx}>
                            
                            {/* baris kategori */}
                            <div 
                                className="flex border-b border-gray-100 cursor-pointer h-10 relative"
                                onClick={() => toggleCategory(String(idx))}
                            >
                                {/* sidebar sticky: kategori */}
                                <div style={stickyLeftStyle} className="z-[100] bg-gray-50 border-r border-gray-200 flex items-center px-4 gap-2 shadow-[4px_0_8px_rgba(0,0,0,0.02)]">
                                    {isExpanded ? <DownOutlined className="text-[10px]"/> : <RightOutlined className="text-[10px]"/>}
                                    <span className="font-bold text-xs uppercase text-gray-600">{cat.title}</span>
                                    <Tag className="ml-auto rounded-[10px] text-[10px] border-none">{cat.projects.length}</Tag>
                                </div>

                                {/* latar belakang grid timeline */}
                                <div className="flex-grow relative" style={{ display: 'grid', gridTemplateColumns: gridTemplateColumns }}>
                                    
                                     {/* garis latar */}
                                     {Array.from({length: config.totalCols}).map((_, c) => (
                                        <div key={c} style={{ gridColumn: c+1 }} className="border-r border-gray-50 h-full"></div>
                                    ))}

                                    {/* marker hari ini (bagian kategori) */}
                                    {todayPositionLeft !== null && (
                                        <div className="absolute top-0 bottom-0 z-[1]" style={{ left: `${todayPositionLeft}%`, borderLeft: '2px dashed #ff4d4f' }}></div>
                                    )}
                                </div>
                            </div>

                            {/* baris project */}
                            {isExpanded && cat.projects.map(proj => {
                                const pos = getBarPosition(proj.startDate, proj.endDate);
                                if (pos.col < 1) return null;
                                const colors = getColors(proj.status);

                                return (
                                    <div key={proj.id} className="flex h-[50px] border-b border-gray-100 items-center relative">
                                        
                                        {/* sidebar sticky: nama project */}
                                        <div style={stickyLeftStyle} className="z-[100] bg-white border-r border-gray-200 flex flex-col justify-center px-4 shadow-[4px_0_8px_rgba(0,0,0,0.02)] h-full">
                                            <div className="text-[13px] font-semibold text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis">{proj.name}</div>
                                            <div className="text-[10px] text-gray-400 font-mono">{proj.id}</div>
                                        </div>

                                        {/* area timeline */}
                                        <div className="flex-grow h-full relative" style={{ display: 'grid', gridTemplateColumns: gridTemplateColumns }}>
                                            
                                            {/* garis grid */}
                                            {Array.from({length: config.totalCols}).map((_, c) => (
                                                <div key={c} style={{ gridColumn: c+1 }} className="border-r border-gray-50 h-full"></div>
                                            ))}

                                            {/* marker hari ini (bagian project) */}
                                            {todayPositionLeft !== null && (
                                                <div className="absolute top-0 bottom-0 z-[2] pointer-events-none" style={{ left: `${todayPositionLeft}%`, borderLeft: '2px dashed #ff4d4f' }}></div>
                                            )}

                                            {/* bar project dengan tooltip detail */}
                                            <Tooltip
                                                title={
                                                    <div className="min-w-[240px] p-2 text-gray-700">
                                                        {/* header: nama & id */}
                                                        <div className="font-bold text-[13px] mb-0.5 text-gray-900">{proj.name}</div>
                                                        <div className="text-[11px] text-gray-500 mb-3 font-mono border-b border-gray-100 pb-2">{proj.id}</div>

                                                        {/* tags: status & priority */}
                                                        <div className="flex gap-1.5 mb-3">
                                                            <Tag color={colors.main} className="text-[10px] m-0 leading-[18px] font-semibold border-none">{proj.status}</Tag>
                                                            <Tag color={proj.priority === 'Tinggi' ? 'red' : proj.priority === 'Sedang' ? 'orange' : 'blue'} className="text-[10px] m-0 leading-[18px] border-none">{proj.priority}</Tag>
                                                        </div>

                                                        {/* progress */}
                                                        <div className="mb-2">
                                                            <div className="flex justify-between text-[11px] mb-1 text-gray-500">
                                                                <span>Progres</span>
                                                                <span className="font-semibold text-gray-700">{proj.progress}% / Target {proj.target}%</span>
                                                            </div>
                                                            <Progress
                                                                percent={proj.progress}
                                                                success={{ percent: Math.min(proj.progress, proj.target), strokeColor: colors.main }}
                                                                strokeColor={proj.progress > proj.target ? '#52c41a' : colors.main}
                                                                trailColor="rgba(0,0,0,0.06)"
                                                                size="small"
                                                                showInfo={false}
                                                            />
                                                        </div>

                                                        {/* budget */}
                                                        <div className="flex justify-between text-[11px] mb-1 text-gray-500">
                                                            <span>Budget Terpakai</span>
                                                            <span className="font-semibold text-gray-700">{proj.budgetUsed}%</span>
                                                        </div>

                                                        {/* timeline */}
                                                        <div className="flex justify-between text-[11px] mb-1 text-gray-500">
                                                            <span>Periode</span>
                                                            <span className="font-semibold text-gray-700">{proj.startDate} — {proj.endDate}</span>
                                                        </div>

                                                        {/* manager */}
                                                        <div className={`flex justify-between text-[11px] text-gray-500 ${proj.issues?.length > 0 ? 'mb-2' : 'mb-0'}`}>
                                                            <span>Manajer</span>
                                                            <span className="font-semibold text-gray-700">{proj.manager}</span>
                                                        </div>

                                                        {/* issues */}
                                                        {proj.issues?.length > 0 && (
                                                            <div className="border-t border-gray-100 pt-2 mt-2">
                                                                <div className="text-[11px] font-semibold mb-1 text-red-600 flex items-center gap-1">
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block"></span> Isu ({proj.issues.length})
                                                                </div>
                                                                {proj.issues.map((issue, i) => (
                                                                    <div key={i} className="text-[10px] text-gray-600 pl-2 relative mb-0.5 leading-tight">
                                                                        • {issue}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                }
                                                placement="top"
                                                color="#ffffff"
                                                overlayInnerStyle={{ 
                                                    borderRadius: 8, 
                                                    padding: 0,
                                                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                                                    color: '#333'
                                                }}
                                            >
                                                <div 
                                                    onClick={() => onProjectClick && onProjectClick(proj)}
                                                    className="h-6 mt-[13px] rounded cursor-pointer shadow-sm text-[10px] text-white flex items-center pl-2 font-bold whitespace-nowrap overflow-hidden relative z-[5] transition-all duration-200 hover:scale-y-110 hover:shadow-md"
                                                    style={{
                                                        gridColumn: `${pos.col} / span ${pos.span}`,
                                                        background: `linear-gradient(to right, ${colors.main} ${proj.progress}%, ${colors.light} ${proj.progress}%)`,
                                                        border: `1px solid ${colors.main}`,
                                                        textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                                                    }}
                                                >
                                                    {(pos.span > 2 || viewMode === 'Monthly') && `${proj.id} : ${proj.name}`}
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