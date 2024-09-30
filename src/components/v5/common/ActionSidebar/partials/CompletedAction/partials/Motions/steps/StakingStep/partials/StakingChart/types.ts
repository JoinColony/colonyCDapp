import { type VoteChartProps } from '~v5/shared/VoteChart/types.ts';

export interface StakingChartProps {
  chartProps: Omit<
    VoteChartProps,
    'thresholdLabel' | 'againstLabel' | 'forLabel'
  >;
  tokenSymbol: string;
  tokenDecimals: number;
  requiredStake?: string;
}
