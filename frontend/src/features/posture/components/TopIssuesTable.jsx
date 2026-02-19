import React, { useMemo } from 'react';
import { Card, Tag } from 'antd';
import { IssueTooltip } from '../../../components/ui/ProjectTooltip';

/**
 * komponen tabel top 5 issues yang paling sering muncul
 * menghitung frekuensi issue dari semua project,
 * menampilkan ranking, nama issue, kategori terkait, dan total kemunculan
 * @param {Array} data - array project data yang sudah difilter
 * @returns {JSX.Element} card dengan tabel top 5 issues
 */
const TopIssuesTable = ({ data = [] }) => {
  const issues = useMemo(() => {
    const map = {};
    data.forEach((p) => {
      if (p.issues && Array.isArray(p.issues)) {
        p.issues.forEach((issue) => {
          const issueName = (issue && typeof issue === 'object') ? issue.title : issue;
          if (issueName) {
            if (!map[issueName]) map[issueName] = { count: 0, categories: new Set(), projects: [] };
            map[issueName].count++;
            map[issueName].categories.add(p.category);
            map[issueName].projects.push({ name: p.name, category: p.category });
          }
        });
      }
    });

    return Object.entries(map)
      .map(([name, d]) => ({ name, count: d.count, categories: Array.from(d.categories), projects: d.projects }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [data]);

  // warna untuk ranking badge
  const rankColors = ['#ff4d4f', '#fa8c16', '#faad14', '#1890ff', '#8c8c8c'];

  return (
    <Card
      title="5 Isu Teratas"
      bordered={false}
      className="h-full rounded-lg [&>.ant-card-head]:!px-5 [&>.ant-card-head]:!border-b-0 [&>.ant-card-head-title]:!text-[13px] [&>.ant-card-head-title]:!font-semibold [&>.ant-card-body]:!px-5 [&>.ant-card-body]:!pb-4 [&>.ant-card-body]:!pt-0"
    >
      {issues.length === 0 ? (
        <div className="text-center text-gray-400 text-xs py-8">Tidak ada issue</div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {issues.map((issue, idx) => (
            <IssueTooltip
              key={idx}
              issueName={issue.name}
              projects={issue.projects}
            >
              <div
                className="flex items-start gap-3 p-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                {/* rank badge */}
                <div
                  className="flex items-center justify-center w-6 h-6 rounded-full shrink-0 text-white text-[10px] font-bold"
                  style={{ backgroundColor: rankColors[idx] || '#8c8c8c' }}
                >
                  {idx + 1}
                </div>

                {/* content */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-800 m-0 leading-snug">{issue.name}</p>
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    {issue.categories.map((cat) => (
                      <Tag key={cat} className="text-[9px] m-0 leading-none border-0 bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">
                        {cat}
                      </Tag>
                    ))}
                  </div>
                </div>

                {/* count */}
                <div className="text-right shrink-0">
                  <span className="text-sm font-bold text-gray-700">{issue.count}</span>
                  <p className="text-[9px] text-gray-400 m-0">project</p>
                </div>
              </div>
            </IssueTooltip>
          ))}
        </div>
      )}
    </Card>
  );
};

export default TopIssuesTable;
