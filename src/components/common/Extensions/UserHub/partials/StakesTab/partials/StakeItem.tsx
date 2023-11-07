import React, { FC } from 'react';
import { FormattedDate } from 'react-intl';

import ExtensionsStatusBadge from '~v5/common/Pills/ExtensionStatusBadge';
import { ExtensionStatusBadgeMode } from '~v5/common/Pills/types';
import Numeral from '~shared/Numeral';

import { StakeItemProps } from '../types';

import styles from './StakeItem.css';

const displayName =
  'common.Extensions.UserHub.partials.StakesTab.partials.StakeItem';

const StakeItem: FC<StakeItemProps> = ({
  title,
  date,
  stake,
  transfer,
  status,
  nativeToken,
  userStake,
}) => (
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
        {userStake.status}
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

StakeItem.displayName = displayName;

export default StakeItem;
