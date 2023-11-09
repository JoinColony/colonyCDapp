import React, { FC } from 'react';

import { useUserReputation } from '~hooks';
import { useGetReputationMiningCycleMetadataQuery } from '~gql';
import TimeRelative from '~shared/TimeRelative';
import { formatText } from '~utils/intl';

import ReputationTabSection from '../ReputationTabSection';
import { getNextMiningCycleDate, getReputationDecayInNextDay } from './utils';
import { PendingReputationProps } from './types';

const displayName =
  'common.Extensions.UserHub.partials.ReputationTab.partials.PendingReputation';

const PendingReputation: FC<PendingReputationProps> = ({
  colonyAddress,
  wallet,
  nativeToken,
  className,
}) => {
  const { userReputation } = useUserReputation(colonyAddress, wallet?.address);

  const { data } = useGetReputationMiningCycleMetadataQuery();
  const { lastCompletedAt } = data?.getReputationMiningCycleMetadata ?? {};
  const nextMiningCycleDate = lastCompletedAt
    ? getNextMiningCycleDate(new Date(lastCompletedAt ?? ''))
    : null;

  return (
    <ReputationTabSection
      title={formatText({ id: 'userHub.pendingReputation' }) || ''}
      items={[
        {
          key: '1',
          title: formatText({ id: 'userHub.reputationNextUpdate' }) || '',
          value: nextMiningCycleDate ? (
            <TimeRelative value={nextMiningCycleDate} />
          ) : (
            '-'
          ),
        },
        {
          key: '2',
          title: formatText({ id: 'userHub.reputationDecayLabel' }) || '',
          value: formatText(
            { id: 'userHub.reputationDecayValue' },
            {
              points: userReputation
                ? getReputationDecayInNextDay(
                    userReputation,
                    nativeToken.decimals,
                  )
                : '0',
            },
          ),
        },
      ]}
      className={className}
    />
  );
};

PendingReputation.displayName = displayName;

export default PendingReputation;
