import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import TitleLabel from '~v5/shared/TitleLabel';
import { useUserReputation } from '~hooks';
import { useGetReputationMiningCycleMetadataQuery } from '~gql';
import TimeRelative from '~shared/TimeRelative';

import { getNextMiningCycleDate, getReputationDecayInNextDay } from './utils';
import { PendingReputationProps } from '../../types';

import styles from '../../ReputationTab.module.css';

const displayName =
  'common.Extensions.UserHub.partials.ReputationTab.partials.PendingReputation';

const PendingReputation: FC<PendingReputationProps> = ({
  colonyAddress,
  wallet,
  nativeToken,
}) => {
  const { formatMessage } = useIntl();

  const { userReputation } = useUserReputation(colonyAddress, wallet?.address);

  const { data } = useGetReputationMiningCycleMetadataQuery();
  const { lastCompletedAt } = data?.getReputationMiningCycleMetadata ?? {};
  const nextMiningCycleDate = lastCompletedAt
    ? getNextMiningCycleDate(new Date(lastCompletedAt ?? ''))
    : null;

  return (
    <div className="pt-6 border-b border-gray-200 pb-6 sm:border-none sm:pb-0">
      <TitleLabel text={formatMessage({ id: 'userHub.pendingReputation' })} />
      <div className="flex flex-col gap-4 pt-2">
        <div className={styles.row}>
          <p className={styles.rowName}>
            {formatMessage({ id: 'userHub.reputationNextUpdate' })}
          </p>
          <span className="text-sm">
            {nextMiningCycleDate ? (
              <TimeRelative value={nextMiningCycleDate} />
            ) : (
              '-'
            )}
          </span>
        </div>
        <div className={styles.row}>
          <p className={styles.rowName}>
            {formatMessage({ id: 'userHub.reputationDecayLabel' })}
          </p>
          <span className="text-sm">
            {formatMessage(
              { id: 'userHub.reputationDecayValue' },
              {
                points: userReputation
                  ? getReputationDecayInNextDay(
                      userReputation,
                      nativeToken.decimals,
                    )
                  : '0',
              },
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

PendingReputation.displayName = displayName;

export default PendingReputation;
