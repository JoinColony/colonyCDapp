import React, { type FC, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import reputationTabClasses from '~common/Extensions/UserHub/partials/BalanceTab/BalanceTab.styles.ts';
import { type PendingReputationProps } from '~common/Extensions/UserHub/partials/BalanceTab/types.ts';
import { useGetReputationMiningCycleMetadataQuery } from '~gql';
import useUserReputation from '~hooks/useUserReputation.ts';
import TimeRelative from '~shared/TimeRelative/index.ts';
import TitleLabel from '~v5/shared/TitleLabel/index.ts';

import {
  getNextMiningCycleDate,
  getReputationDecayInNextDay,
} from './utils.ts';

const displayName =
  'common.Extensions.UserHub.partials.ReputationTab.partials.PendingReputation';

const UPDATE_INTERVAL = 15;

const PendingReputation: FC<PendingReputationProps> = ({
  colonyAddress,
  wallet,
  nativeToken,
}) => {
  const { formatMessage } = useIntl();

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
    <div className="pt-6">
      <TitleLabel text={formatMessage({ id: 'userHub.pendingReputation' })} />
      <div className="flex flex-col gap-4 pt-2">
        <div className={reputationTabClasses.row}>
          <p className={reputationTabClasses.rowName}>
            {formatMessage({ id: 'userHub.reputationNextUpdate' })}
          </p>
          <span className="text-sm">
            {nextMiningCycleDate ? (
              <TimeRelative
                value={nextMiningCycleDate}
                updateInterval={UPDATE_INTERVAL}
              />
            ) : (
              '-'
            )}
          </span>
        </div>
        <div className={reputationTabClasses.row}>
          <p className={reputationTabClasses.rowName}>
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
