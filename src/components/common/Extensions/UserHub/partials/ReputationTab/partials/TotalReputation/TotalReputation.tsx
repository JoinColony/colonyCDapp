import { Star } from '@phosphor-icons/react';
import Decimal from 'decimal.js';
import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';

import UserHubInfoSection from '~common/Extensions/UserHub/partials/UserHubInfoSection/UserHubInfoSection.tsx';
import { DEFAULT_TOKEN_DECIMALS } from '~constants/index.ts';
import useUserReputation from '~hooks/useUserReputation.ts';
import Numeral from '~shared/Numeral/index.ts';
import { formatText } from '~utils/intl.ts';
import { ZeroValue, calculatePercentageReputation } from '~utils/reputation.ts';
import {
  getFormattedTokenValue,
  getTokenDecimalsWithFallback,
} from '~utils/tokens.ts';

import { type TotalReputationProps } from './types.ts';

const displayName =
  'common.Extensions.UserHub.partials.ReputationTab.partials.TotalReputation';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: 'Total reputation in THIS Colony',
  },
  influence: {
    id: `${displayName}.influence`,
    defaultMessage: 'Influence',
  },
  reputationPoints: {
    id: `${displayName}.reputationPoints`,
    defaultMessage: 'Reputation points',
  },
});

const TotalReputation: FC<TotalReputationProps> = ({
  colonyAddress,
  wallet,
  nativeToken,
  className,
}) => {
  const { userReputation, totalReputation } = useUserReputation({
    colonyAddress,
    walletAddress: wallet?.address,
  });

  const percentageReputation = calculatePercentageReputation(
    userReputation || '0',
    totalReputation || '0',
  );

  const formattedReputationPoints = getFormattedTokenValue(
    new Decimal(userReputation || 0).toString(),
    getTokenDecimalsWithFallback(nativeToken.decimals, DEFAULT_TOKEN_DECIMALS),
  );

  return (
    <UserHubInfoSection
      className={className}
      title={formatText(MSG.title)}
      items={[
        {
          key: '1',
          label: formatText(MSG.influence),
          value: (
            <div className="flex items-center justify-end gap-1">
              <Star size={14} />
              {percentageReputation && (
                <Numeral
                  value={
                    percentageReputation === ZeroValue.NearZero
                      ? 0
                      : percentageReputation || 0
                  }
                  suffix=" %"
                  appearance={{ size: 'small' }}
                />
              )}
            </div>
          ),
        },
        {
          key: '2',
          label: formatText(MSG.reputationPoints),
          value: (
            <Numeral
              value={formattedReputationPoints}
              suffix=" pts"
              appearance={{ size: 'small' }}
            />
          ),
        },
      ]}
    />
  );
};

TotalReputation.displayName = displayName;

export default TotalReputation;
