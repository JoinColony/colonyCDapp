import React, { type FC } from 'react';

import Numeral from '~shared/Numeral/index.ts';
import { formatText } from '~utils/intl.ts';
import VoteChart from '~v5/shared/VoteChart/index.ts';

import { type StakingChartProps } from './types.ts';

const displayName =
  'v5.common.ActionSidebar.partials.motions.MotionSimplePayment.steps.StakingStep.partials.StakingChart';

const StakingChart: FC<StakingChartProps> = ({
  requiredStake,
  tokenDecimals,
  tokenSymbol,
  chartProps,
}) => (
  <>
    {requiredStake && (
      <h4 className="mb-3 text-center text-gray-900 text-1">
        {formatText(
          {
            id: 'motion.staking.form.title',
          },
          {
            requiredStake: (
              <Numeral
                value={requiredStake}
                suffix={` ${tokenSymbol}`}
                decimals={tokenDecimals}
              />
            ),
          },
        )}
      </h4>
    )}
    <VoteChart
      {...chartProps}
      againstLabel={formatText({ id: 'motion.staking.chart.againstLabel' })}
      forLabel={formatText({ id: 'motion.staking.chart.forLabel' })}
    />
  </>
);
StakingChart.displayName = displayName;

export default StakingChart;
