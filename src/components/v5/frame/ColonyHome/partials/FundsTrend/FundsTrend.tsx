import { ArrowUp } from '@phosphor-icons/react';
import React, { type FC } from 'react';

interface FundsTrendProps {
  isIncrease?: boolean;
  value: React.ReactNode;
}

export const FundsTrend: FC<FundsTrendProps> = ({ isIncrease, value }) => {
  return (
    <div className="flex flex-row items-center gap-0.5 text-xs font-medium text-blue-400">
      <ArrowUp size={10} transform={`rotate(${isIncrease ? '0' : '180'})`} />
      <span>{value}</span>
    </div>
  );
};
