import React from 'react';
import Card from '../../../components/ui/Card';

const BudgetCard = () => {
  return (
    <Card title="Budget" className="h-full">
      <div className="flex items-center justify-center h-48 bg-blue-50 rounded border border-blue-100 border-dashed text-blue-400">
        Area Chart Visualization
      </div>
    </Card>
  );
};

export default BudgetCard;