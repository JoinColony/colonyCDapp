import React, { FC } from 'react';
import clsx from 'clsx';

import { formatText } from '~utils/intl';

import { VoteChartProps } from './types';
import VoteChartBar from './partials/VoteChartBar';
import { VOTE_CHART_BAR_DIRECTION } from './partials/VoteChartBar/types';
import VoteChartThresholdIndicator from './partials/VoteChartThresholdIndicator';

const displayName = 'v5.VoteChart';

const VoteChart: FC<VoteChartProps> = ({
  percentageVotesFor = 0,
  predictPercentageVotesFor,
  forLabel,
  percentageVotesAgainst = 0,
  predictPercentageVotesAgainst,
  againstLabel,
  threshold,
  thresholdLabel,
  className,
}) => {
  const forValue =
    (percentageVotesFor < 0 && 0) ||
    (percentageVotesFor > 100 && 100) ||
    percentageVotesFor;

  const againstValue =
    (percentageVotesAgainst < 0 && 0) ||
    (percentageVotesAgainst > 100 && 100) ||
    percentageVotesAgainst;

  const predictedForValue = predictPercentageVotesFor
    ? (predictPercentageVotesFor < 0 && 0) ||
      (predictPercentageVotesFor > 100 && 100) ||
      predictPercentageVotesFor
    : undefined;

  const predictedAgainstValue = predictPercentageVotesAgainst
    ? (predictPercentageVotesAgainst < 0 && 0) ||
      (predictPercentageVotesAgainst > 100 && 100) ||
      predictPercentageVotesAgainst
    : undefined;

  return (
    <div className={clsx(className, 'w-full')}>
      {!!threshold && (
        <p className="text-xs font-medium text-center mb-1 text-blue-400">
          {thresholdLabel ||
            formatText(
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
            barBackgroundClassName="bg-negative-300"
            predictionBarClassName="border-negative-300 bg-negative-100"
            predictedValue={predictedAgainstValue}
            direction={VOTE_CHART_BAR_DIRECTION.Left}
          />
          <span
            className={clsx('text-xs text-center transition-[color]', {
              'text-negative-400 font-medium':
                predictedAgainstValue || againstValue > 0,
              'text-gray-500': againstValue === 0 && !predictedAgainstValue,
            })}
          >
            {predictedAgainstValue || againstValue}% {againstLabel}
          </span>
        </div>
        <div className="flex flex-1 flex-col items-center gap-1">
          <div className="relative w-full">
            {!!threshold && (
              <div
                className="absolute top-0 bottom-0 h-full z-[3]"
                style={{
                  left: `${threshold}%`,
                }}
              >
                <VoteChartThresholdIndicator />
              </div>
            )}
            <VoteChartBar
              value={forValue}
              predictedValue={predictedForValue}
              barBackgroundClassName="bg-purple-200"
              predictionBarClassName="border-purple-200 bg-purple-100"
              direction={VOTE_CHART_BAR_DIRECTION.Right}
            />
          </div>
          <span
            className={clsx('text-xs text-center transition', {
              'text-purple-400 font-medium':
                predictedAgainstValue || forValue > 0,
              'text-gray-500': forValue === 0 && !predictedAgainstValue,
            })}
          >
            {predictedForValue || forValue}% {forLabel}
          </span>
        </div>
      </div>
    </div>
  );
};

VoteChart.displayName = displayName;

export default VoteChart;
