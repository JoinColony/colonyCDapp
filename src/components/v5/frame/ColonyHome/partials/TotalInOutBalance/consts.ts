import { defineMessages } from 'react-intl';

export const displayName = 'v5.frame.ColonyHome.TotalInOutBalance';

export const MSG = defineMessages({
  paymentsLegendTitle: {
    id: `${displayName}.paymentsLegendTitle`,
    defaultMessage: 'Payments',
  },
  incomeLegendTitle: {
    id: `${displayName}.incomeLegendTitle`,
    defaultMessage: 'Income',
  },
});

export const CHART_CONFIG_VALUES = {
  MARGIN_TOP: 8,
  MARGIN_BOTTOM: 24,
  MARGIN_LEFT: 30,
  MARGIN_RIGHT: -8,
  PADDING: 0.3,
  INNER_PADDING: 4,
  BAR_Y_OFFSET: -0.5,
  BAR_WIDTH: 21,
  BAR_MIN_HEIGHT: 4,
  BORDER_RADIUS: 4,
  BAR_GROUP_PADDING: 12,
  FONT_SIZE: 10,
  FONT_FAMILY: 'Inter',
  GRID_LINE_WIDTH: 1,
  GRID_LINE_DASHED: '6,6',
  Y_AXIS_SPACING: 12,
  X_AXIS_TOP_MARGIN: 14,
  X_AXIS_LABEL_RIGHT_MARGIN: 8,
};
