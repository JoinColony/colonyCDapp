import React, { FC } from 'react';
import { FormattedDate } from 'react-intl';

import ExtensionsStatusBadge from '~v5/common/Pills/ExtensionStatusBadge';
import { ExtensionStatusBadgeMode } from '~v5/common/Pills/types';
import Numeral from '~shared/Numeral';
import { useGetMotionStateQuery } from '~gql';

import { StakesTabItemProps } from '../types';

import styles from './StakesTabItem.module.css';
import { motionTags } from '~shared/Tag';
import { getMotionState } from '~utils/colonyMotions';

const displayName =
  'common.Extensions.UserHub.partials.StakesTab.partials.StakesTabItem';

const StakesTabItem: FC<StakesTabItemProps> = ({
  title,
  date,
  stake,
  transfer,
  status,
  nativeToken,
  userStake,
  colonyAddress,
}) => {
  const motionId = userStake.action?.motionData?.id;
  const { data } = useGetMotionStateQuery({
    variables: {
      input: {
        colonyAddress,
        databaseMotionId: motionId ?? '',
      },
    },
    skip: !motionId,
  });
  const motionState =
    data?.getMotionState && userStake.action?.motionData
      ? getMotionState(data.getMotionState, userStake.action.motionData)
      : null;

  const MotionTag = motionState ? motionTags[motionState] : () => null;

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

StakesTabItem.displayName = displayName;

export default StakesTabItem;
