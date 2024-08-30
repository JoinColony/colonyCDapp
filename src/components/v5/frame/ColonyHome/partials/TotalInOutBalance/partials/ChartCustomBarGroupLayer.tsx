import { type BarCustomLayerProps } from '@nivo/bar';
import { groupBy } from 'lodash';
import React, { type FC, Fragment, useState } from 'react';

import { CHART_CONFIG_VALUES } from '../consts.ts';
import { type GroupedBarItems, type BarChartDataItem } from '../types.ts';

import { ChartCustomBar } from './ChartCustomBar.tsx';

interface ChartCustomBarGroupLayerProps
  extends BarCustomLayerProps<BarChartDataItem> {
  hoveredColor: string;
  isLoading?: boolean;
}

export const ChartCustomBarGroupLayer: FC<ChartCustomBarGroupLayerProps> = ({
  bars,
  innerHeight,
  hoveredColor,
  isLoading,
}) => {
  const [hoveredGroup, setHoveredGroup] = useState('');
  const barGroups: GroupedBarItems = groupBy(
    bars,
    (item) => item.data.indexValue,
  );

  const handleMouseEnter = (groupIndex) => {
    if (!isLoading) {
      setHoveredGroup(groupIndex);
    }
  };

  const handleMouseLeave = () => {
    setHoveredGroup('');
  };

  return (
    <>
      {Object.entries(barGroups).map(([barGroupIndex, barGroup]) => {
        const firstBar = barGroup?.[0];
        const numberOfBars = barGroup.length;
        const groupStartX =
          (firstBar?.x ?? 0) - CHART_CONFIG_VALUES.BAR_GROUP_PADDING; // we need to subtract the groupped bar left padding
        const groupWidth =
          numberOfBars *
            (CHART_CONFIG_VALUES.BAR_WIDTH +
              CHART_CONFIG_VALUES.BAR_GROUP_PADDING) +
          CHART_CONFIG_VALUES.INNER_PADDING;

        return (
          <Fragment key={`barGroup-${barGroupIndex}`}>
            <g
              onMouseEnter={() => handleMouseEnter(barGroupIndex)}
              onMouseLeave={handleMouseLeave}
            >
              <rect
                x={groupStartX}
                y={CHART_CONFIG_VALUES.BAR_Y_OFFSET}
                width={groupWidth}
                height={innerHeight}
                fill={
                  hoveredGroup === barGroupIndex ? hoveredColor : 'transparent'
                }
                rx={CHART_CONFIG_VALUES.BORDER_RADIUS}
                ry={CHART_CONFIG_VALUES.BORDER_RADIUS}
              />
            </g>
            {barGroup.map((bar, index) => (
              <ChartCustomBar
                // eslint-disable-next-line react/no-array-index-key
                key={`bar-group-${index}`}
                bar={bar}
                innerHeight={innerHeight}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                isLoading={isLoading}
              />
            ))}
          </Fragment>
        );
      })}
    </>
  );
};
