import clsx from 'clsx';
import React, { type FC } from 'react';

import Numeral from '~shared/Numeral/Numeral.tsx';

import { summaryLegendColor } from '../consts.ts';
import { type ReputationChartDataItem } from '../types.ts';

const displayName = 'v5.frame.ColonyHome.ReputationChart.partials.LegendItem';
interface LegendItemProps {
  chartItem:
    | ReputationChartDataItem
    | { color: string; label: string; value: undefined };
}

const LegendItem: FC<LegendItemProps> = ({
  chartItem: { color, label, value },
}) => {
  return (
    <div className="flex flex-row items-center gap-1">
      <div
        className={clsx(
          'h-[10px] w-[10px] rounded-full',
          summaryLegendColor[color] || summaryLegendColor.default,
        )}
      />
      <span className="text-xs font-normal text-gray-500">{label}</span>
      {value !== undefined && (
        <span className="text-xs font-semibold text-gray-900">
          <Numeral value={value.toFixed(2)} />%
        </span>
      )}
    </div>
  );
};

LegendItem.displayName = displayName;
export default LegendItem;
