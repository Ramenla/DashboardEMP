import React from 'react';
import Card from '../../../components/ui/Card';

const StatusCard = () => {
  return (
    <Card title="Status Project" className="h-full">
       <div className="flex items-center justify-center h-48 bg-green-50 rounded border border-green-100 border-dashed text-green-400">
        Donut Chart
      </div>
    </Card>
  );
};

export default StatusCard;