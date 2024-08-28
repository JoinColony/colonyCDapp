/* eslint-disable @typescript-eslint/no-unused-vars */
import { WarningCircle } from '@phosphor-icons/react';
import { differenceInMonths, differenceInSeconds } from 'date-fns';
import React, { useState, type FC, useEffect } from 'react';
import { defineMessages } from 'react-intl';

import Tooltip from '~shared/Extensions/Tooltip/Tooltip.tsx';
import TimerValue from '~shared/TimerValue/TimerValue.tsx';
import { formatText } from '~utils/intl.ts';
import { splitTimeLeft } from '~v5/common/ActionSidebar/partials/Motions/partials/MotionCountDownTimer/helpers.ts';

const displayName =
  'v5.common.CompletedAction.partials.StagedPaymentTable.partials.ClaimDelayTooltip';

interface ClaimDelayTooltipProps {
  finalizedAt: number;
  claimDelay: string;
}

const MSG = defineMessages({
  claimDelay: {
    id: `${displayName}.claimDelay`,
    defaultMessage:
      'This payment has a low claim delay timer, it will be payable by anyone when the claim delay timer ends.',
  },
  timeRemaining: {
    id: `${displayName}.timeRemaining`,
    defaultMessage: 'Time remaining:',
  },
});

const ClaimDelayTooltip: FC<ClaimDelayTooltipProps> = ({
  finalizedAt,
  claimDelay,
}) => {
  const currentTime = new Date();
  const maxClaimDelayTime = new Date(
    (finalizedAt + parseFloat(claimDelay)) * 1000,
  );

  const secondsLeft = differenceInSeconds(maxClaimDelayTime, currentTime);
  const moreThanMonth =
    differenceInMonths(maxClaimDelayTime, currentTime) !== 0;

  const [timeLeft, setTimeLeft] = useState<number>(-1);

  useEffect(() => {
    setTimeLeft(secondsLeft > 0 ? secondsLeft : -1);
  }, [secondsLeft]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (timeLeft) {
        setTimeLeft((oldTimeLeft) => oldTimeLeft - 1);
      }
    }, 1000);

    if (timeLeft === 0) {
      clearInterval(timer);
    }

    return () => {
      clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  const splitTime = splitTimeLeft(timeLeft);

  return timeLeft > 0 && !moreThanMonth ? (
    <Tooltip
      tooltipContent={
        <div>
          <p>{formatText(MSG.claimDelay)}</p>
          <p className="mt-3">{formatText(MSG.timeRemaining)}</p>
          <TimerValue splitTime={splitTime} />
        </div>
      }
      placement="top-end"
    >
      <div className="text-warning-400">
        <WarningCircle size={16} />
      </div>
    </Tooltip>
  ) : null;
};

ClaimDelayTooltip.displayName = displayName;

export default ClaimDelayTooltip;
