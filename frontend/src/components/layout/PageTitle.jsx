import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

/**
 * Komponen PageTitle - Reusable title component untuk halaman
 * @param {string} children - Text judul halaman
 * @param {number} level - Level heading (1-5), default 3
 * @param {React.ReactNode} icon - Optional icon di sebelah kiri title
 * @param {string} subtitle - Optional subtitle di bawah title
 * @param {React.ReactNode} actions - Optional action buttons di sebelah kanan
 * @param {string|number} marginTop - Optional distance from the top (margin)
 */
const PageTitle = ({
    children,
    level = 3,
    icon,
    subtitle,
    actions,
    marginTop = 0,
}) => {
    return (
        <div 
            className={`flex justify-between mb-3 ${subtitle ? 'items-start' : 'items-center'}`}
            style={{ marginTop }}
        >
            <div className="flex-1">
                <Title
                    level={level}
                    className={`flex items-center gap-2 bg-white py-2.5 px-5 rounded-lg text-[#001529] ${subtitle ? 'mb-2' : 'mb-0'}`}
                >
                    {icon && <span className="flex items-center">{icon}</span>}
                    {children}
                </Title>
                {subtitle && (
                    <div className="text-gray-500 text-sm mt-1">
                        {subtitle}
                    </div>
                )}
            </div>
            {actions && (
                <div className="ml-4">
                    {actions}
                </div>
            )}
        </div>
    );
};

export default PageTitle;
