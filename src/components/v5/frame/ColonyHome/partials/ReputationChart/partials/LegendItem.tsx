import clsx from 'clsx';
import React, { type FC } from 'react';

import { useReputationChartContext } from '~context/ReputationChartContext/ReputationChartContext.ts';
import Tooltip from '~shared/Extensions/Tooltip/Tooltip.tsx';
import Numeral from '~shared/Numeral/Numeral.tsx';
import { multiLineTextEllipsis } from '~utils/strings.ts';

import { summaryLegendColor } from '../consts.ts';
import { type ReputationChartDataItem } from '../types.ts';

import LegendItemWrapper from './LegendItemWrapper.tsx';

const displayName = 'v5.frame.ColonyHome.ReputationChart.partials.LegendItem';
interface LegendItemProps {
  chartItem: ReputationChartDataItem;
}

const LEGEND_LABEL_LENGTH = 20;

const LegendItem: FC<LegendItemProps> = ({
  chartItem: {
    color,
    id,
    label,
    searchParam,
    shouldTruncateLegendLabel = true,
    value,
  },
}) => {
  const isTruncated =
    shouldTruncateLegendLabel && label.length > LEGEND_LABEL_LENGTH;

  const { activeLegendItemId } = useReputationChartContext();
  const isLegendItemActive = activeLegendItemId === id;

  return (
    <Tooltip tooltipContent={isTruncated ? label : null}>
      <LegendItemWrapper id={id} searchParam={searchParam}>
        <div
          className={clsx(
            'h-[10px] w-[10px] rounded-full',
            summaryLegendColor[color] || summaryLegendColor.default,
          )}
        />
        <span
          className={clsx('text-xs font-normal text-gray-500', {
            'text-gray-900': isLegendItemActive,
            'hover:text-gray-900': !!value,
            'cursor-pointer': !!searchParam,
          })}
        >
          {isTruncated
            ? multiLineTextEllipsis(label, LEGEND_LABEL_LENGTH)
            : label}
        </span>
        {value !== undefined && (
          <span className="text-xs font-semibold text-gray-900">
            <Numeral value={value.toFixed(2)} />%
          </span>
        )}
      </LegendItemWrapper>
    </Tooltip>
  );
};

LegendItem.displayName = displayName;

export default LegendItem;
