import clsx from 'clsx';
import React, { type PropsWithChildren, type FC, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useReputationChartContext } from '~context/ReputationChartContext/ReputationChartContext.ts';
import Tooltip from '~shared/Extensions/Tooltip/Tooltip.tsx';
import Numeral from '~shared/Numeral/Numeral.tsx';
import { multiLineTextEllipsis } from '~utils/strings.ts';

import { summaryLegendColor } from '../consts.ts';
import { type ReputationChartDataItem } from '../types.ts';

const displayName = 'v5.frame.ColonyHome.ReputationChart.partials.LegendItem';
interface LegendItemProps {
  chartItem: ReputationChartDataItem;
}

const LEGEND_LABEL_LENGTH = 12;

const LegendItemOuter: FC<
  PropsWithChildren<{ id?: string; searchParam?: string }>
> = ({ children, id, searchParam }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const handleClick = useCallback(() => {
    if (id && searchParam) {
      searchParams.set(searchParam, id);
      setSearchParams(searchParams);
    }
  }, [id, searchParam, searchParams, setSearchParams]);
  if (searchParam) {
    return (
      <button
        type="button"
        className="flex flex-row items-center gap-1"
        onClick={handleClick}
      >
        {children}
      </button>
    );
  }
  return <div className="flex flex-row items-center gap-1">{children}</div>;
};

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
      <LegendItemOuter id={id} searchParam={searchParam}>
        <div
          className={clsx(
            'h-[10px] w-[10px] rounded-full',
            summaryLegendColor[color] || summaryLegendColor.default,
          )}
        />
        <span
          className={clsx('text-xs font-normal text-gray-500', {
            'text-gray-900': isLegendItemActive,
            // @TODO here we'll need to add if the search param exists once another PR gets merged
            'cursor-pointer hover:text-gray-900': !!value,
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
      </LegendItemOuter>
    </Tooltip>
  );
};

LegendItem.displayName = displayName;

export default LegendItem;
