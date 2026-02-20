import React from 'react';
import { Tooltip, Tag, Progress } from 'antd';

/**
 * helper function untuk mendapatkan warna tag berdasarkan status project
 */
const getStatusColor = (status) => {
    switch (status) {
        case 'Berjalan': return 'success';
        case 'Tertunda': return 'warning';
        case 'Beresiko': return 'error';
        case 'Selesai': return 'processing';
        default: return 'default';
    }
};

/**
 * helper function untuk mendapatkan warna tag berdasarkan priority
 */
const getPriorityColor = (priority) => {
    switch (priority) {
        case 'HIGH': return 'red';
        case 'MEDIUM': return 'gold';
        case 'LOW': return 'green'; // changed from default to green for better visibility
        default: return 'default';
    }
};

/**
 * Reusable premium tooltip component with consistent styling
 */
const PremiumTooltip = ({ title, children, placement = 'top' }) => {
    return (
        <Tooltip
            title={title}
            placement={placement}
            color="#ffffff"
            overlayInnerStyle={{
                borderRadius: 8,
                padding: title && typeof title === 'object' ? 0 : 8,
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                color: '#333'
            }}
        >
            {children}
        </Tooltip>
    );
};

/**
 * Specialized tooltip for issues, listing projects and their categories
 */
export const IssueTooltip = ({ issueName, projects = [], children, placement = 'top' }) => {
    if (!projects || projects.length === 0) return children;

    const tooltipTitle = (
        <div className="min-w-[200px] p-1.5 text-gray-700">
            <div className="font-bold text-[12px] mb-2 text-gray-900 border-b border-gray-100 pb-1.5">
                Ditemukan di {projects.length} Proyek
            </div>
            <div className="flex flex-col gap-2">
                {projects.map((proj, i) => (
                    <div key={i} className="text-[11px] leading-tight">
                        <div className="flex items-start gap-1.5 mb-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1 shrink-0"></span>
                            <span className="font-medium text-gray-800">{proj.name}</span>
                        </div>
                        <div className="pl-3">
                            <span className="text-[9px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded uppercase tracking-wider font-semibold">
                                {proj.category}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <PremiumTooltip title={tooltipTitle} placement={placement}>
            {children}
        </PremiumTooltip>
    );
};

/**
 * Specialized project tooltip that uses the premium style
 */
export const ProjectTooltip = ({ project, children, placement = 'top' }) => {
    if (!project) return children;
    
    // Formatting date
    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: '2-digit' });
    };

    const tooltipTitle = (
        <div className="min-w-[240px] p-2 text-gray-700">
            <div className="font-bold text-[13px] mb-0.5 text-gray-900">{project.name}</div>
            <div className="text-[11px] text-gray-500 mb-3 font-mono border-b border-gray-100 pb-2">{project.id}</div>

            <div className="flex gap-1.5 mb-3">
                <Tag color={getStatusColor(project.status)} className="text-[10px] m-0 leading-[18px] font-semibold border-none">{project.status?.replace('_', ' ')}</Tag>
                <Tag color={getPriorityColor(project.priority)} className="text-[10px] m-0 leading-[18px] border-none">{project.priority}</Tag>
            </div>

            <div className="mb-2">
                <div className="flex justify-between text-[11px] mb-1 text-gray-500">
                    <span>Progres</span>
                    <span className="font-semibold text-gray-700">{project.progress}% / Target {project.target ? project.target.toFixed(0) : 0}%</span>
                </div>
                <Progress
                    percent={project.progress}
                    success={{ percent: Math.min(project.progress, project.target || 0), strokeColor: '#1890ff' }}
                    strokeColor={project.progress > (project.target || 0) ? '#52c41a' : '#1890ff'}
                    trailColor="rgba(0,0,0,0.06)"
                    size="small"
                    showInfo={false}
                />
            </div>

            <div className="flex justify-between text-[11px] mb-1 text-gray-500">
                <span>Budget Terpakai</span>
                <span className="font-semibold text-gray-700">{project.budgetUsed ? project.budgetUsed.toLocaleString() : 0}</span>
            </div>

            <div className="flex justify-between text-[11px] mb-1 text-gray-500">
                <span>Periode</span>
                <span className="font-semibold text-gray-700">{formatDate(project.startDate)} — {formatDate(project.endDate)}</span>
            </div>

            <div className={`flex justify-between text-[11px] text-gray-500 ${project.issues?.length > 0 ? 'mb-2' : 'mb-0'}`}>
                <span>Manajer</span>
                <span className="font-semibold text-gray-700">{project.manager}</span>
            </div>

            {project.issues?.length > 0 && (
                <div className="border-t border-gray-100 pt-2 mt-2">
                    <div className="text-[11px] font-semibold mb-1 text-red-600 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block"></span> Isu ({project.issues.length})
                    </div>
                    {project.issues.map((issue, i) => (
                        <div key={i} className="text-[10px] text-gray-600 pl-2 relative mb-0.5 leading-tight">
                            • {(issue && typeof issue === 'object') ? issue.title : issue}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <PremiumTooltip title={tooltipTitle} placement={placement}>
            {children}
        </PremiumTooltip>
    );
};

export default PremiumTooltip;
