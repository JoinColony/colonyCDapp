import clsx from 'clsx';
import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';

import { formatText } from '~utils/intl.ts';
import PaymentCounter from '~v5/common/CompletedAction/partials/PaymentBuilder/partials/PaymentCounter/PaymentCounter.tsx';
import PillsBase from '~v5/common/Pills/PillsBase.tsx';

import { type ClaimStatusBadgeProps } from './types.ts';

const MSG = defineMessages({
  claimNow: {
    id: 'claimStatusBadge.claimNow',
    defaultMessage: 'Claim now',
  },
  claimIn: {
    id: 'claimStatusBadge.claimIn',
    defaultMessage: 'Claim in {time}',
  },
  claimed: {
    id: 'claimStatusBadge.claimed',
    defaultMessage: 'Claimed',
  },
});

const ClaimStatusBadge: FC<ClaimStatusBadgeProps> = ({
  claimDelay,
  finalizedTimestamp,
  isClaimed,
  isClaimable,
  onTimeEnd,
}) => {
  if (!finalizedTimestamp) {
    return null;
  }

  const getPillLabelAndClassName = () => {
    if (isClaimed) {
      return {
        text: formatText(MSG.claimed),
        className: 'bg-blue-100 text-blue-400',
      };
    }

    if (isClaimable) {
      return {
        text: formatText(MSG.claimNow),
        className: 'bg-success-100 text-success-400',
      };
    }

    return {
      text: formatText(MSG.claimIn, {
        time: (
          <PaymentCounter
            claimDelay={claimDelay}
            finalizedTimestamp={finalizedTimestamp}
            onTimeEnd={onTimeEnd}
            showSingleValue
          />
        ),
      }),
      className: 'bg-purple-100 text-purple-400',
    };
  };

  return (
    <PillsBase
      text={getPillLabelAndClassName().text}
      isCapitalized={false}
      className={clsx(
        getPillLabelAndClassName().className,
        'whitespace-nowrap',
      )}
    />
  );
};

export default ClaimStatusBadge;
