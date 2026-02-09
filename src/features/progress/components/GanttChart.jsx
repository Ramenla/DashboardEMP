import React, { useMemo, useState } from 'react';
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
  return (end - start) / oneDay;
};

// --- STYLE CONSTANTS ---
const SIDEBAR_WIDTH = 280; 

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

    const currentYear = new Date().getFullYear();
    let min = new Date(Math.min(...allStarts));
    let max = new Date(Math.max(...allEnds));

    // For all views, ensure we start from current year
    const yearStart = new Date(currentYear, 0, 1);
    
    if (viewMode === 'Monthly') {
        // Monthly: always show Jan-Dec of current year
        min = new Date(currentYear, 0, 1);
        max = new Date(currentYear, 11, 31);
    } else {
        // Daily/Weekly: add buffer but don't go before current year
        min.setDate(min.getDate() - 3);
        max.setDate(max.getDate() + 3);
        
        // Don't show dates before January 1 of current year
        if (min < yearStart) {
            min = yearStart;
        }
    }

    const days = getDaysDiff(min, max);
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
                     <div key={`d-${colIndex}`} style={{ gridColumn: colIndex }} className="text-center text-[10px] border-r border-gray-100 py-1.5 text-gray-500">
                         {dayOfMonth}
                     </div>
                 );
                 
                 if (dayOfMonth === 1 || colIndex === 1) {
                     const remainingInMonth = daysInMonth - dayOfMonth + 1;
                     const remainingInGrid = Math.round(getDaysDiff(currentDate, maxDate)) + 1;
                     const span = Math.min(remainingInMonth, remainingInGrid);
                     
                     topRow.push(
                         <div key={`m-${colIndex}`} style={{ gridColumn: `${colIndex} / span ${span}` }} className="text-left pl-2 text-[11px] font-bold border-r border-gray-200 bg-gray-50 text-gray-700 uppercase tracking-wide py-1.5">
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
                     <div key={`w-${colIndex}`} style={{ gridColumn: colIndex }} className="text-center text-[10px] border-r border-gray-100 py-1.5">
                         {currentDate.getDate()}
                     </div>
                 );
                 if ((colIndex - 1) % 4 === 0) {
                     topRow.push(
                        <div key={`mw-${colIndex}`} style={{ gridColumn: `${colIndex} / span 4` }} className="text-left pl-2 text-[11px] font-bold border-r border-gray-200 bg-gray-50 py-1.5">
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


  // --- 3. TODAY MARKER POSITION ---
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
        // Calculate more accurate week position
        const diffTime = today.getTime() - minDate.getTime();
        const diffDays = diffTime / (1000 * 3600 * 24);
        const totalGridDays = getDaysDiff(minDate, maxDate);
        // Direct percentage based on days
        return (diffDays / totalGridDays) * 100;
    } 
    else {
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

  // Sticky sidebar style object (dynamic due to width constant)
  const stickyLeftStyle = {
    position: 'sticky',
    left: 0,
    width: SIDEBAR_WIDTH,
    minWidth: SIDEBAR_WIDTH,
  };

  return (
    <div className="bg-white rounded-lg border border-gray-100 overflow-x-auto overflow-y-hidden relative">
      
      <div className="flex flex-col min-w-full" style={{ width: timelineWidth }}>
        
        {/* === HEADER === */}
        <div className="flex border-b border-gray-100 h-16">
            {/* STICKY SIDEBAR: HEADER */}
            <div style={stickyLeftStyle} className="bg-gray-50 border-r border-gray-200 z-[100] flex items-center px-4 text-sm shadow-[4px_0_8px_rgba(0,0,0,0.02)]">
                Project Timeline
            </div>
            
            {/* SCROLLABLE TIMELINE: HEADER */}
            <div className="flex-grow relative" style={{ display: 'grid', gridTemplateColumns: gridTemplateColumns }}>
                
                {/* TODAY MARKER (HEADER PART) */}
                {todayPositionLeft !== null && (
                    <div className="absolute z-10" style={{ left: `${todayPositionLeft}%`, top: 70, bottom: 0, borderLeft: '2px dashed #ff4d4f' }}>
                        <div className="w-2 h-2 bg-red-500 rounded-full absolute -top-1 -left-[5px] shadow" />
                    </div>
                )}

                {/* Grid Rows */}
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

        {/* === BODY === */}
        <div className="bg-white">
            {data.length === 0 ? <Empty description="Tidak ada data project" className="m-5" /> : (
                <>
                {data.map((cat, idx) => {
                    const isExpanded = expandedKeys.includes(String(idx));
                    
                    return (
                        <React.Fragment key={idx}>
                            
                            {/* CATEGORY ROW */}
                            <div 
                                className="flex border-b border-gray-100 cursor-pointer h-10 relative"
                                onClick={() => toggleCategory(String(idx))}
                            >
                                {/* STICKY SIDEBAR: CATEGORY */}
                                <div style={stickyLeftStyle} className="z-[100] bg-gray-50 border-r border-gray-200 flex items-center px-4 gap-2 shadow-[4px_0_8px_rgba(0,0,0,0.02)]">
                                    {isExpanded ? <DownOutlined className="text-[10px]"/> : <RightOutlined className="text-[10px]"/>}
                                    <span className="font-bold text-xs uppercase text-gray-600">{cat.title}</span>
                                    <Tag className="ml-auto rounded-[10px] text-[10px] border-none">{cat.projects.length}</Tag>
                                </div>

                                {/* TIMELINE GRID BACKGROUND */}
                                <div className="flex-grow relative" style={{ display: 'grid', gridTemplateColumns: gridTemplateColumns }}>
                                    
                                     {/* Background Lines */}
                                     {Array.from({length: config.totalCols}).map((_, c) => (
                                        <div key={c} style={{ gridColumn: c+1 }} className="border-r border-gray-50 h-full"></div>
                                    ))}

                                    {/* TODAY MARKER (CATEGORY PART) */}
                                    {todayPositionLeft !== null && (
                                        <div className="absolute top-0 bottom-0 z-[1]" style={{ left: `${todayPositionLeft}%`, borderLeft: '2px dashed #ff4d4f' }}></div>
                                    )}
                                </div>
                            </div>

                            {/* PROJECT ROWS */}
                            {isExpanded && cat.projects.map(proj => {
                                const pos = getBarPosition(proj.startDate, proj.endDate);
                                if (pos.col < 1) return null;
                                const colors = getColors(proj.status);

                                return (
                                    <div key={proj.id} className="flex h-[50px] border-b border-gray-100 items-center relative">
                                        
                                        {/* STICKY SIDEBAR: PROJECT NAME */}
                                        <div style={stickyLeftStyle} className="z-[100] bg-white border-r border-gray-200 flex flex-col justify-center px-4 shadow-[4px_0_8px_rgba(0,0,0,0.02)] h-full">
                                            <div className="text-[13px] font-semibold text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis">{proj.name}</div>
                                            <div className="text-[10px] text-gray-400 font-mono">{proj.id}</div>
                                        </div>

                                        {/* TIMELINE AREA */}
                                        <div className="flex-grow h-full relative" style={{ display: 'grid', gridTemplateColumns: gridTemplateColumns }}>
                                            
                                            {/* Grid Lines */}
                                            {Array.from({length: config.totalCols}).map((_, c) => (
                                                <div key={c} style={{ gridColumn: c+1 }} className="border-r border-gray-50 h-full"></div>
                                            ))}

                                            {/* TODAY MARKER (PROJECT PART) */}
                                            {todayPositionLeft !== null && (
                                                <div className="absolute top-0 bottom-0 z-[2] pointer-events-none" style={{ left: `${todayPositionLeft}%`, borderLeft: '2px dashed #ff4d4f' }}></div>
                                            )}

                                            {/* PROJECT BAR */}
                                            <Tooltip title={`${proj.name} (${proj.progress}%)`}>
                                                <div 
                                                    onClick={() => onProjectClick && onProjectClick(proj)}
                                                    className="h-6 mt-[13px] rounded cursor-pointer shadow text-[10px] text-white flex items-center pl-2 font-bold whitespace-nowrap overflow-hidden relative z-[5] transition-all duration-200 hover:scale-y-110"
                                                    style={{
                                                        gridColumn: `${pos.col} / span ${pos.span}`,
                                                        background: `linear-gradient(to right, ${colors.main} ${proj.progress}%, ${colors.light} ${proj.progress}%)`,
                                                        border: `1px solid ${colors.main}`
                                                    }}
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