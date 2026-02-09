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
 * @param {object} style - Custom style override
 */
const PageTitle = ({
    children,
    level = 3,
    icon,
    subtitle,
    actions,
    marginTop = 0,
    style = { background: 'white', padding: '10px 20px', borderRadius: '8px' }
}) => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: subtitle ? 'flex-start' : 'center',
            marginBottom: 24,
            marginTop: marginTop
        }}>
            <div style={{ flex: 1 }}>
                <Title
                    level={level}
                    style={{
                        marginBottom: subtitle ? 8 : 0,
                        color: '#001529',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        ...style
                    }}
                >
                    {icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
                    {children}
                </Title>
                {subtitle && (
                    <div style={{
                        color: '#6b7280',
                        fontSize: 14,
                        marginTop: 4
                    }}>
                        {subtitle}
                    </div>
                )}
            </div>
            {actions && (
                <div style={{ marginLeft: 16 }}>
                    {actions}
                </div>
            )}
        </div>
    );
};

export default PageTitle;
