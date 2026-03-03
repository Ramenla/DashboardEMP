/**
 * @file ProjectTooltip.jsx
 * @description Kumpulan komponen tooltip premium untuk menampilkan informasi proyek.
 *
 * Ekspor:
 * - default: `PremiumTooltip` — tooltip dasar dengan style konsisten (shadow, rounded).
 * - named: `ProjectTooltip` — tooltip khusus proyek (status, progress, budget, isu).
 * - named: `IssueTooltip` — tooltip daftar proyek yang memiliki isu tertentu.
 */

import React from 'react';
import { Tooltip, Tag, Progress } from 'antd';

/**
 * Mengembalikan nama warna Ant Design Tag berdasarkan status proyek.
 *
 * @param {string} status - Status proyek (Berjalan, Tertunda, Beresiko, Selesai).
 * @returns {string} Nama warna untuk komponen Tag.
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
 * Mengembalikan nama warna Ant Design Tag berdasarkan prioritas proyek.
 *
 * @param {string} priority - Prioritas proyek (HIGH, MEDIUM, LOW).
 * @returns {string} Nama warna untuk komponen Tag.
 */
const getPriorityColor = (priority) => {
    switch (priority) {
        case 'HIGH': return 'red';
        case 'MEDIUM': return 'gold';
        case 'LOW': return 'green';
        default: return 'default';
    }
};

/**
 * Komponen tooltip dasar dengan styling premium (shadow, rounded corner).
 * Digunakan sebagai wrapper oleh tooltip-tooltip spesifik lainnya.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.title - Konten yang ditampilkan di dalam tooltip.
 * @param {React.ReactNode} props.children - Elemen trigger tooltip (hover target).
 * @param {string} [props.placement='top'] - Posisi tooltip relatif terhadap trigger.
 * @returns {JSX.Element}
 */
const PremiumTooltip = ({ title, children, placement = 'top' }) => {
    return (
        <Tooltip
            title={title}
            placement={placement}
            color="#ffffff"
            overlayInnerStyle={{
                borderRadius: 6,
                padding: title && typeof title === 'object' ? 0 : 6,
                boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
                color: '#333',
                fontSize: 11,
            }}
        >
            {children}
        </Tooltip>
    );
};

/**
 * Tooltip khusus untuk isu, menampilkan daftar proyek yang memiliki isu tersebut.
 *
 * @param {Object} props
 * @param {string} props.issueName - Nama isu yang ditampilkan.
 * @param {Array<Object>} [props.projects=[]] - Daftar proyek terkait isu.
 * @param {Function} [props.onProjectClick] - Callback saat proyek di-klik dalam tooltip.
 * @param {React.ReactNode} props.children - Elemen trigger tooltip.
 * @param {string} [props.placement='top'] - Posisi tooltip.
 * @returns {JSX.Element}
 */
export const IssueTooltip = ({ issueName, projects = [], onProjectClick, children, placement = 'top' }) => {
    if (!projects || projects.length === 0) return children;

    const tooltipTitle = (
        <div className="min-w-[160px] p-1 text-gray-700">
            <div className="font-bold text-[10px] mb-1.5 text-gray-900 border-b border-gray-100 pb-1">
                Ditemukan di {projects.length} Proyek
            </div>
            <div className="flex flex-col gap-0.5 max-h-[160px] overflow-y-auto pr-1 custom-scrollbar">
                {projects.map((proj, i) => (
                    <div
                        key={i}
                        className={`text-[10px] leading-tight shrink-0 flex flex-col gap-0 p-0.5 rounded ${onProjectClick ? 'cursor-pointer hover:bg-gray-50 transition-colors' : ''}`}
                        onClick={(e) => {
                            if (onProjectClick) {
                                e.preventDefault();
                                e.stopPropagation();
                                onProjectClick(proj);
                            }
                        }}
                    >
                        <div className="flex items-start gap-1">
                            <span className="w-1 h-1 rounded-full bg-blue-500 mt-1 shrink-0"></span>
                            <span className="font-medium text-gray-800">{proj.name}</span>
                        </div>
                        <div className="pl-2">
                            <span className="text-[8px] px-1 py-0 bg-gray-100 text-gray-500 rounded uppercase tracking-wider font-semibold">
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
 * Tooltip khusus proyek yang menampilkan ringkasan lengkap:
 * nama, ID, status, prioritas, progress vs target, budget, periode, manajer, dan daftar isu.
 *
 * @param {Object} props
 * @param {Object} props.project - Data proyek yang akan ditampilkan.
 * @param {React.ReactNode} props.children - Elemen trigger tooltip.
 * @param {string} [props.placement='top'] - Posisi tooltip.
 * @returns {JSX.Element}
 */
export const ProjectTooltip = ({ project, children, placement = 'top' }) => {
    if (!project) return children;

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: '2-digit' });
    };

    const tooltipTitle = (
        <div className="min-w-[200px] p-1.5 text-gray-700">
            <div className="font-bold text-[11px] mb-0 text-gray-900">{project.name}</div>
            <div className="text-[10px] text-gray-500 mb-2 font-mono border-b border-gray-100 pb-1.5">{project.id}</div>

            <div className="flex gap-1 mb-2">
                <Tag color={getStatusColor(project.status)} className="text-[9px] m-0 leading-[16px] font-semibold border-none">{project.status?.replace('_', ' ')}</Tag>
                <Tag color={getPriorityColor(project.priority)} className="text-[9px] m-0 leading-[16px] border-none">{project.priority}</Tag>
            </div>

            <div className="mb-1.5">
                <div className="flex justify-between text-[10px] mb-0.5 text-gray-500">
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

            <div className="flex justify-between text-[10px] mb-0.5 text-gray-500">
                <span>Budget Terpakai</span>
                <span className="font-semibold text-gray-700">{project.budgetUsed ? project.budgetUsed.toLocaleString() : 0}</span>
            </div>

            <div className="flex justify-between text-[10px] mb-0.5 text-gray-500">
                <span>Periode</span>
                <span className="font-semibold text-gray-700">{formatDate(project.startDate)} — {formatDate(project.endDate)}</span>
            </div>

            <div className={`flex justify-between text-[10px] text-gray-500 ${project.issues?.length > 0 ? 'mb-1.5' : 'mb-0'}`}>
                <span>Manajer</span>
                <span className="font-semibold text-gray-700">{project.manager}</span>
            </div>

            {project.issues?.length > 0 && (
                <div className="border-t border-gray-100 pt-1.5 mt-1">
                    <div className="text-[10px] font-semibold mb-0.5 text-red-600 flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-red-500 inline-block"></span> Isu ({project.issues.length})
                    </div>
                    {project.issues.map((issue, i) => (
                        <div key={i} className="text-[9px] text-gray-600 pl-2 relative mb-0 leading-tight">
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
