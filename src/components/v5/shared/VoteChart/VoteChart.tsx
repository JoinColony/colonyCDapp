import clsx from 'clsx';
import React, { type FC } from 'react';

import { usePageThemeContext } from '~context/PageThemeContext/PageThemeContext.ts';
import { formatText } from '~utils/intl.ts';

import VoteChartBar from './partials/VoteChartBar/index.ts';
import { VoteChartBarDirection } from './partials/VoteChartBar/types.ts';
import VoteChartThresholdIndicator from './partials/VoteChartThresholdIndicator/index.ts';
import { type VoteChartProps } from './types.ts';

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
  const { isDarkMode } = usePageThemeContext();
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

  const isStakePublic =
    threshold &&
    ((predictedForValue && predictedForValue > threshold) ||
      forValue > threshold);

  const shouldHideIndicator = !!threshold && forValue < threshold;

  return (
    <div className={clsx(className, 'w-full')}>
      {shouldHideIndicator && (
        <p className="mb-1 text-center text-xs font-medium text-blue-400">
          {thresholdLabel ||
            formatText(
              {
                id: isStakePublic
                  ? 'motion.staking.threshold.label.public'
                  : 'motion.staking.threshold.label',
              },
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
            barBackgroundClassName={
              isDarkMode ? 'bg-negative-400' : 'bg-negative-300'
            }
            predictionBarClassName={
              isDarkMode
                ? 'bg-negative-400 border-negative-400'
                : 'border-negative-300 bg-negative-300'
            }
            predictedValue={predictedAgainstValue}
            direction={VoteChartBarDirection.Left}
          />
          <span
            className={clsx('text-center text-xs transition-[color]', {
              'font-medium text-negative-400':
                predictedAgainstValue || againstValue > 0,
              'text-gray-500': againstValue === 0 && !predictedAgainstValue,
            })}
          >
            {predictedAgainstValue || againstValue}% {againstLabel}
          </span>
        </div>
        <div className="flex flex-1 flex-col items-center gap-1">
          <div className="relative w-full">
            {shouldHideIndicator && (
              <div
                className="absolute bottom-0 top-0 z-base h-full"
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
              barBackgroundClassName={
                isDarkMode ? 'bg-purple-400' : 'bg-purple-200'
              }
              predictionBarClassName={
                isDarkMode
                  ? 'bg-purple-400 border-purple-400'
                  : 'border-purple-200 bg-purple-200'
              }
              direction={VoteChartBarDirection.Right}
            />
          </div>
          <span
            className={clsx('text-center text-xs transition', {
              'font-medium text-purple-400': predictedForValue || forValue > 0,
              'text-gray-500': forValue === 0 && !predictedForValue,
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
