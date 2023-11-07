import React, { FC, useEffect } from 'react';
import { FormattedDate } from 'react-intl';

import ExtensionsStatusBadge from '~v5/common/Pills/ExtensionStatusBadge';
import { ExtensionStatusBadgeMode } from '~v5/common/Pills/types';
import Numeral from '~shared/Numeral';
import { motionTags } from '~shared/Tag';
import { getMotionState } from '~utils/colonyMotions';

import { StakeItemProps } from '../types';

import styles from './StakeItem.css';
import { useNetworkMotionState } from '~hooks/useNetworkMotionState';

const displayName =
  'common.Extensions.UserHub.partials.StakesTab.partials.StakesTabItem';

const StakeItem: FC<StakeItemProps> = ({
  title,
  date,
  stake,
  transfer,
  status,
  nativeToken,
  userStake,
  onMotionStateFetched,
}) => {
  const motionState = useNetworkMotionState(
    userStake.action?.motionData?.nativeMotionId ?? 0,
  );

  // Sync motion state with the parent component
  useEffect(() => {
    if (!motionState) {
      return;
    }

    onMotionStateFetched(userStake.id, motionState);
  }, [motionState, onMotionStateFetched, userStake.action, userStake.id]);

  const tagMotionState =
    motionState && userStake.action?.motionData
      ? getMotionState(motionState, userStake.action.motionData)
      : undefined;
  const MotionTag = tagMotionState ? motionTags[tagMotionState] : () => null;

  return (
    <li className={styles.stakesItem}>
      <div className="relative w-full">
        <div className="flex justify-between items-center">
          <div className="flex items-center mr-2 flex-grow">
            <p className="text-1 mr-2">{title}</p>
            <span className="text-gray-400 text-xs">
              <FormattedDate value={date} />
            </span>
          </div>
          <ExtensionsStatusBadge
            mode={status as ExtensionStatusBadgeMode}
            text={status as ExtensionStatusBadgeMode}
          />
          <MotionTag />
        </div>
        <div className="flex text-xs">
          <div className="font-medium mr-2">
            <Numeral
              value={stake}
              decimals={nativeToken.decimals}
              suffix={nativeToken.symbol}
            />
          </div>
          <div className="text-gray-600">{transfer}</div>
        </div>
      </div>
    </li>
  );
};

StakeItem.displayName = displayName;

export default StakeItem;
