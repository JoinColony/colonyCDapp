import React, { FC } from 'react';
import clsx from 'clsx';
import { useIntl } from 'react-intl';
import { VoteChartProps } from './types';
import VoteChartBar from './partials/VoteChartBar';
import { VOTE_CHART_BAR_DIRECTION } from './partials/VoteChartBar/types';
import VoteChartThresholdIndicator from './partials/VoteChartThresholdIndicator';

const displayName = 'v5.VoteChart';

const VoteChart: FC<VoteChartProps> = ({
  percentageVotesFor = 0,
  forLabel,
  percentageVotesAgainst = 0,
  againstLabel,
  threshold,
  thresholdLabel,
  className,
}) => {
  const intl = useIntl();

  const forValue =
    (percentageVotesFor < 0 && 0) ||
    (percentageVotesFor > 100 && 100) ||
    percentageVotesFor;

  const againstValue =
    (percentageVotesAgainst < 0 && 0) ||
    (percentageVotesAgainst > 100 && 100) ||
    percentageVotesAgainst;

  return (
    <div className={clsx(className, 'w-full')}>
      {!!threshold && (
        <p className="text-xs font-medium text-center mb-1 text-blue-400">
          {thresholdLabel ||
            intl.formatMessage(
              { id: 'motion.staking.threshold.label' },
              { threshold: `${threshold}%` },
            )}
        </p>
      )}
      <div
        className={clsx('flex', {
          'pt-2': !!threshold,
        })}
      >
        <div className="flex flex-1 flex-col items-center gap-1">
          <VoteChartBar
            value={againstValue}
            barBackgroundClassName="bg-red-300"
            direction={VOTE_CHART_BAR_DIRECTION.Left}
          />
          <span
            className={clsx('text-xs text-center transition-[color]', {
              'text-red-300 font-medium': againstValue > 0,
              'text-gray-500': againstValue === 0,
            })}
          >
            {againstValue}% {againstLabel}
          </span>
        </div>
        <div className="flex flex-1 flex-col items-center gap-1">
          <div className="relative w-full">
            {!!threshold && (
              <div
                className="absolute top-0 bottom-0 h-full z-[1]"
                style={{
                  left: `${threshold}%`,
                }}
              >
                <VoteChartThresholdIndicator />
              </div>
            )}
            <VoteChartBar
              value={forValue}
              barBackgroundClassName="bg-purple-200"
              direction={VOTE_CHART_BAR_DIRECTION.Right}
            />
          </div>
          <span
            className={clsx('text-xs text-center transition', {
              'text-purple-200 font-medium': forValue > 0,
              'text-gray-500': forValue === 0,
            })}
          >
            {forValue}% {forLabel}
          </span>
        </div>
      </div>
    </div>
  );
};

VoteChart.displayName = displayName;

export default VoteChart;
