import React, { FC } from 'react';
import Numeral from '~shared/Numeral';
import { formatText } from '~utils/intl';
import VoteChart from '~v5/shared/VoteChart';
import { StakingChartProps } from './types';

const displayName =
  'v5.common.ActionSidebar.partials.motions.MotionSimplePayment.steps.StakingStep.partials.StakingChart';

const StakingChart: FC<StakingChartProps> = ({
  requiredStake,
  tokenDecimals,
  tokenSymbol,
  chartProps,
}) => {
  const { threshold } = chartProps;

  return (
    <>
      {requiredStake && (
        <h4 className="text-1 text-center text-gray-900 mb-3">
          {formatText(
            {
              id: 'motion.staking.form.title',
            },
            {
              requiredStake: (
                <Numeral
                  value={requiredStake}
                  suffix={tokenSymbol}
                  decimals={tokenDecimals}
                />
              ),
            },
          )}
        </h4>
      )}
      <VoteChart
        {...chartProps}
        againstLabel={
          formatText({ id: 'motion.staking.chart.againstLabel' }) || ''
        }
        forLabel={formatText({ id: 'motion.staking.chart.forLabel' }) || ''}
        thresholdLabel={
          formatText(
            { id: 'motion.staking.chart.thresholdLabel' },
            {
              value: `${threshold}%`,
            },
          ) || ''
        }
      />
    </>
  );
};

StakingChart.displayName = displayName;

export default StakingChart;
