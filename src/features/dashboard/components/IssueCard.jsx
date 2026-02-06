import React from 'react';
import { Card, Table, Tag } from 'antd';

const columns = [
  {
    title: 'Rank',
    dataIndex: 'rank',
    key: 'rank',
    width: 60,
    align: 'center',
    render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>,
  },
  {
    title: 'Issue',
    dataIndex: 'issue',
    key: 'issue',
    render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
  },
  {
    title: 'Kategori Terdampak',
    dataIndex: 'category',
    key: 'category',
    render: (text) => (
        <span style={{ fontSize: 12, color: '#666' }}>{text}</span>
    ),
  },
  {
    title: 'Total',
    dataIndex: 'total',
    key: 'total',
    align: 'right',
    render: (text) => <b>{text}</b>,
  },
];

const data = [
  { key: '1', rank: 1, issue: 'Kendala Cuaca', category: 'Eksplorasi, Drilling', total: 20 },
  { key: '2', rank: 2, issue: 'Masalah Perizinan Lahan', category: 'Eksplorasi', total: 15 },
  { key: '3', rank: 3, issue: 'Keterlambatan Material', category: 'Facility', total: 12 },
  { key: '4', rank: 4, issue: 'ESP Bermasalah', category: 'Operation', total: 9 },
  { key: '5', rank: 5, issue: 'Tanah dan Pondasi', category: 'Facility', total: 5 },
];

const IssueCard = () => {
  return (
    <Card title="Top 5 Issue" bordered={false} style={{ height: '100%', borderRadius: 8 }}>
      <Table 
        columns={columns} 
        dataSource={data} 
        pagination={false} 
        size="small"
        rowClassName="text-xs"
        scroll={{ y: 220 }} // Agar bisa discroll jika data panjang
      />
    </Card>
  );
};

export default IssueCard;