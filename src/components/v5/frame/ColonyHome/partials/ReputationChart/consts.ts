import { type PieSvgProps } from '@nivo/pie';

import { DomainColor } from '~types/graphql.ts';

import { type ReputationChartDataItem } from './types.ts';

export const EMPTY_ITEM_ID = 'noTeamsId';

export const summaryLegendColor = {
  '--color-teams-yellow-500': 'bg-teams-yellow-500',
  '--color-teams-red-400': 'bg-teams-red-400',
  '--color-teams-red-600': 'bg-teams-red-600',
  '--color-teams-pink-400': 'bg-teams-pink-400',
  '--color-teams-pink-500': 'bg-teams-pink-500',
  '--color-teams-pink-600': 'bg-teams-pink-600',
  '--color-teams-purple-400': 'bg-teams-purple-400',
  '--color-teams-purple-500': 'bg-teams-purple-500',
  '--color-teams-green-300': 'bg-teams-green-300',
  '--color-teams-green-400': 'bg-teams-green-400',
  '--color-teams-green-500': 'bg-teams-green-500',
  '--color-teams-teal-500': 'bg-teams-teal-500',
  '--color-teams-blue-500': 'bg-teams-blue-500',
  '--color-teams-blue-400': 'bg-teams-blue-400',
  '--color-teams-indigo-500': 'bg-teams-indigo-500',
  '--color-teams-grey-500': 'bg-teams-grey-500',
  '--color-teams-grey-100': 'bg-gray-100',
  '--color-gray-400': 'bg-gray-400',
  '--color-gray-200': 'bg-gray-200',
  default: 'bg-blue-400',
};

export const pieChartArcsLayerConfig = {
  startAngle: 0,
  endAngle: 2 * Math.PI,
  borderColor: 'none',
  borderWidth: 0,
};

export const pieChartConfig: Partial<PieSvgProps<ReputationChartDataItem>> = {
  colors: ({ data }) => `var(${data.color})`,
  innerRadius: 0.75,
  enableArcLabels: false,
  enableArcLinkLabels: false,
  padAngle: 1.5,
};

export const CONTRIBUTORS_COLORS_LIST = [
  undefined,
  DomainColor.PurpleGrey,
  DomainColor.LightPink,
  DomainColor.Green,
];
