import React, { FC } from 'react';
import { FormattedDate } from 'react-intl';

import ExtensionsStatusBadge from '~v5/common/Pills/ExtensionStatusBadge';
import { ExtensionStatusBadgeMode } from '~v5/common/Pills/types';
import Numeral from '~shared/Numeral';

import { StakesTabItemProps } from '../types';

import styles from './StakesTabItem.module.css';

const displayName =
  'common.Extensions.UserHub.partials.StakesTab.partials.StakesTabItem';

const StakesTabItem: FC<StakesTabItemProps> = ({
  title,
  date,
  stake,
  transfer,
  status,
  nativeToken,
}) => {
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
