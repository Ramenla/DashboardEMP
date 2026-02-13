import React, { useMemo } from 'react';
import { Card, Table, Tag } from 'antd';

/**
 * konfigurasi kolom untuk tabel top 5 issue
 * menampilkan rank, issue description, kategori terdampak, dan total count
 */
const columns = [
  {
    title: 'Rank',
    dataIndex: 'rank',
    key: 'rank',
    width: 60,
    align: 'center',
    render: (text) => <span className="font-bold">#{text}</span>,
  },
  {
    title: 'Issue',
    dataIndex: 'issue',
    key: 'issue',
    render: (text) => <span className="font-medium text-sm">{text}</span>,
  },
  {
    title: 'Kategori Terdampak',
    dataIndex: 'category',
    key: 'category',
    render: (cats) => (
        <div className="flex flex-wrap gap-1">
            {cats.map(c => <span key={c} className="text-[10px] text-gray-500 bg-gray-100 px-1 rounded">{c}</span>)}
        </div>
    ),
  },
  {
    title: 'Total',
    dataIndex: 'total',
    key: 'total',
    align: 'right',
    render: (text) => <b className="text-sm">{text}</b>,
  },
];

/**
 * komponen card untuk menampilkan top 5 issue yang paling sering muncul
 * data diurutkan berdasarkan frekuensi tertinggi (rank 1 = paling banyak)
 * @param {Array} data - array project data yang sudah difilter
 * @returns {JSX.Element} card dengan tabel top 5 issue
 */
const IssueCard = ({ data = [] }) => {
  const topIssues = useMemo(() => {
    const issueMap = {};

    data.forEach(p => {
      if (p.issues && Array.isArray(p.issues)) {
        p.issues.forEach(issue => {
          if (!issueMap[issue]) {
            issueMap[issue] = { count: 0, categories: new Set() };
          }
          issueMap[issue].count += 1;
          issueMap[issue].categories.add(p.category);
        });
      }
    });

    const sortedIssues = Object.entries(issueMap)
      .map(([issue, detail]) => ({
        issue,
        total: detail.count,
        category: Array.from(detail.categories),
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)
      .map((item, index) => ({
        key: index,
        rank: index + 1,
        ...item
      }));

    return sortedIssues;
  }, [data]);

  return (
    <Card title="Top 5 Issue" bordered={false} className="h-full rounded-lg">
      <Table 
        columns={columns} 
        dataSource={topIssues} 
        pagination={false} 
        size="small"
        rowClassName="text-xs"
        locale={{ emptyText: 'Tidak ada issue' }}
      />
    </Card>
  );
};

export default IssueCard;