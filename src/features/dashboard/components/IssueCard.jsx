import React from 'react';
import { Card, Table, Tag } from 'antd';
import { topIssuesData } from '../../../shared/data/mockData';

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
    render: (text) => (
        <span className="text-xs text-gray-500">{text}</span>
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

const IssueCard = () => {
  return (
    <Card title="Top 5 Issue" bordered={false} className="h-full rounded-lg">
      <Table 
        columns={columns} 
        dataSource={topIssuesData} 
        pagination={false} 
        size="small"
        rowClassName="text-xs"
        scroll={{ y: 220 }}
      />
    </Card>
  );
};

export default IssueCard;