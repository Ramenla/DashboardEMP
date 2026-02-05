import React from 'react';
import Card from '../../../components/ui/Card';

const IssueCard = () => {
  return (
    <Card title="Top 5 Issue" className="h-full">
      <div className="flex items-center justify-center h-48 bg-red-50 rounded border border-red-100 border-dashed text-red-400">
        Table Issues
      </div>
    </Card>
  );
};

export default IssueCard;