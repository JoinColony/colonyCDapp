import React, { FC } from 'react';
import clsx from 'clsx';

import ExtensionsStatusBadge from '~v5/common/Pills/ExtensionStatusBadge';
import { ExtensionStatusBadgeMode } from '~v5/common/Pills/types';
import { StakesProps } from '../types';
import styles from './StakesTabItem.module.css';

const displayName =
  'common.Extensions.UserHub.partials.StakesTab.partials.StakesItems';

const StakesItems: FC<StakesProps> = ({
  title,
  date,
  stake,
  transfer,
  status,
}) => {
  return (
    <li
      className={clsx(
        styles.stakesItem,
        'first:pt-2 last:pb-6 sm:first:pt-0 sm:last:pb-1.5',
      )}
    >
      <div className="relative w-full">
        <div className="flex justify-between items-center">
          <div className="flex items-center mr-2 flex-grow">
            <p className="text-1 mr-2">{title}</p>
            <span className="text-gray-400 text-xs">{date}</span>
          </div>
          <ExtensionsStatusBadge
            mode={status as ExtensionStatusBadgeMode}
            text={status as ExtensionStatusBadgeMode}
          />
        </div>
        <div className="flex text-xs">
          <div className="font-medium mr-2">{stake}</div>
          <div className="text-gray-600">{transfer}</div>
        </div>
      </div>
    </li>
  );
};

StakesItems.displayName = displayName;

export default StakesItems;
