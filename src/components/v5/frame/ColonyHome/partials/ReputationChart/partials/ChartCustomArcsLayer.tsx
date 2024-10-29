import { ArcsLayer } from '@nivo/arcs';
import { type ComputedDatum, type PieCustomLayerProps } from '@nivo/pie';
import { useTooltip } from '@nivo/tooltip';
import { pie as d3Pie } from 'd3-shape';
import React, { type FC } from 'react';

import { useReputationChartContext } from '~context/ReputationChartContext/ReputationChartContext.ts';
import { ChartCustomTooltip } from '~v5/frame/ColonyHome/partials/ChartCustomTooltip/ChartCustomTooltip.tsx';

import { pieChartArcsLayerConfig } from '../consts.ts';
import { type ReputationChartDataItem } from '../types.ts';

interface ChartCustomBarGroupLayerProps
  extends PieCustomLayerProps<ReputationChartDataItem> {}

export const ChartCustomArcsLayer: FC<ChartCustomBarGroupLayerProps> = ({
  dataWithArc,
  arcGenerator,
  centerX,
  centerY,
}) => {
  const { showTooltipFromEvent, hideTooltip } = useTooltip();
  const { setActiveLegendItem, resetActiveLegendItem } =
    useReputationChartContext();

  const getScaledPieArcValues = d3Pie<
    Omit<ComputedDatum<ReputationChartDataItem>, 'arc' | 'fill'>
  >()
    .value((d) => d.value * 100)
    .startAngle(pieChartArcsLayerConfig.startAngle)
    .endAngle(pieChartArcsLayerConfig.endAngle)
    // This needs to be smaller than the one used for nivo due to library internal adjustments
    .padAngle(0.15);

  const scaledPieArcValues = getScaledPieArcValues([...dataWithArc]);

  const updatedData = dataWithArc.map((datum, index) => ({
    ...datum,
    arc: {
      ...datum.arc,
      startAngle: scaledPieArcValues[index].startAngle,
      endAngle: scaledPieArcValues[index].endAngle,
    },
  }));

  const mouseInteractionHandler = (datum, event) => {
    setActiveLegendItem(datum.id);
    showTooltipFromEvent(
      <ChartCustomTooltip>
        {datum.label} {datum.value}%
      </ChartCustomTooltip>,
      event,
    );
  };

  const mouseLeaveHandler = () => {
    hideTooltip();
    resetActiveLegendItem();
  };

  const toggleTooltipHandler = (datum, event) => {
    mouseInteractionHandler(datum, event);
  };

  return (
    <ArcsLayer
      center={[centerX, centerY]}
      data={updatedData}
      arcGenerator={arcGenerator}
      borderWidth={pieChartArcsLayerConfig.borderWidth}
      borderColor={pieChartArcsLayerConfig.borderColor}
      transitionMode="startAngle"
      onClick={toggleTooltipHandler}
      onMouseEnter={mouseInteractionHandler}
      onMouseMove={mouseInteractionHandler}
      onMouseLeave={mouseLeaveHandler}
    />
  );
};
