import clsx from 'clsx';
import React, { type FC } from 'react';

import Tooltip from '~shared/Extensions/Tooltip/Tooltip.tsx';
import Numeral from '~shared/Numeral/Numeral.tsx';
import { multiLineTextEllipsis } from '~utils/strings.ts';

import { summaryLegendColor } from '../consts.ts';
import { type ReputationChartDataItem } from '../types.ts';

const displayName = 'v5.frame.ColonyHome.ReputationChart.partials.LegendItem';
interface LegendItemProps {
  chartItem:
    | ReputationChartDataItem
    | {
        color: string;
        label: string;
        value: undefined;
        shouldTruncateLegendLabel?: boolean;
      };
}

const LEGEND_LABEL_LENGTH = 12;

const LegendItem: FC<LegendItemProps> = ({
  chartItem: { color, label, value, shouldTruncateLegendLabel = true },
}) => {
  const isTruncated =
    shouldTruncateLegendLabel && label.length > LEGEND_LABEL_LENGTH;
  return (
    <Tooltip tooltipContent={isTruncated ? label : null}>
      <div className="flex flex-row items-center gap-1">
        <div
          className={clsx(
            'h-[10px] w-[10px] rounded-full',
            summaryLegendColor[color] || summaryLegendColor.default,
          )}
        />
        <span className="text-xs font-normal text-gray-500">
          {isTruncated
            ? multiLineTextEllipsis(label, LEGEND_LABEL_LENGTH)
            : label}
        </span>
        {value !== undefined && (
          <span className="text-xs font-semibold text-gray-900">
            <Numeral value={value.toFixed(2)} />%
          </span>
        )}
      </div>
    </Tooltip>
  );
};

LegendItem.displayName = displayName;
export default LegendItem;
