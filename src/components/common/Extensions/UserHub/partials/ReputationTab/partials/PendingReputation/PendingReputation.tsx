import React, { type FC, useEffect, useState } from 'react';
import { defineMessages } from 'react-intl';

import UserHubInfoSection from '~common/Extensions/UserHub/partials/UserHubInfoSection/UserHubInfoSection.tsx';
import { useGetReputationMiningCycleMetadataQuery } from '~gql';
import useUserReputation from '~hooks/useUserReputation.ts';
import TimeRelative from '~shared/TimeRelative/index.ts';
import { formatText } from '~utils/intl.ts';

import { type PendingReputationProps } from './types.ts';
import {
  getNextMiningCycleDate,
  getReputationDecayInNextDay,
} from './utils.ts';

const displayName =
  'common.Extensions.UserHub.partials.ReputationTab.partials.PendingReputation';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: 'Pending reputation',
  },
  nextUpdate: {
    id: `${displayName}.nextUpdate`,
    defaultMessage: 'Next update',
  },
  nextUpdateTooltip: {
    id: `${displayName}.nextUpdateTooltip`,
    defaultMessage: 'New reputation takes two update cycles to display ',
  },
  reputationDecay: {
    id: `${displayName}.reputationDecay`,
    defaultMessage: 'Reputation decay',
  },
  reputationDecayValue: {
    id: `${displayName}.reputationDecayValue`,
    defaultMessage:
      '{points} {points, plural, one {pt} other {pts}} in next day',
  },
});

const UPDATE_INTERVAL = 15;

const PendingReputation: FC<PendingReputationProps> = ({
  colonyAddress,
  wallet,
  nativeToken,
  className,
}) => {
  const { userReputation } = useUserReputation({
    colonyAddress,
    walletAddress: wallet?.address,
  });

  const { data } = useGetReputationMiningCycleMetadataQuery();
  const { lastCompletedAt } = data?.getReputationMiningCycleMetadata ?? {};

  const [nextMiningCycleDate, setNextMiningCycleDate] = useState(
    lastCompletedAt
      ? getNextMiningCycleDate(new Date(lastCompletedAt ?? ''))
      : null,
  );

  useEffect(() => {
    const intervalTimer = setInterval(() => {
      if (!nextMiningCycleDate) {
        return;
      }

      const halfIntervalAgo = new Date(
        Date.now() - (UPDATE_INTERVAL / 2) * 1000,
      );

      if (nextMiningCycleDate < halfIntervalAgo) {
        setNextMiningCycleDate(getNextMiningCycleDate(nextMiningCycleDate));
      }
    }, UPDATE_INTERVAL * 1000);

    return () => clearInterval(intervalTimer);
  }, [nextMiningCycleDate]);

  return (
    <UserHubInfoSection
      className={className}
      title={formatText(MSG.title)}
      items={[
        {
          key: '1',
          label: formatText(MSG.nextUpdate),
          labelTooltip: formatText(MSG.nextUpdateTooltip),
          value: nextMiningCycleDate ? (
            <TimeRelative
              value={nextMiningCycleDate}
              updateInterval={UPDATE_INTERVAL}
            />
          ) : (
            '-'
          ),
        },
        {
          key: '2',
          label: formatText(MSG.reputationDecay),
          value: formatText(MSG.reputationDecayValue, {
            points: userReputation
              ? getReputationDecayInNextDay(
                  userReputation,
                  nativeToken.decimals,
                )
              : '0',
          }),
        },
      ]}
    />
  );
};

PendingReputation.displayName = displayName;

export default PendingReputation;
