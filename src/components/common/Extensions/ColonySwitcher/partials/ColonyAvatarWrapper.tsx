import React, { FC } from 'react';

import ColonyAvatar from '~shared/ColonyAvatar';
import Icon from '~shared/Icon';
import { ColonyAvatarProps } from '../types';
import styles from '../ColonySwitcher.module.css';

const displayName =
  'common.Extensions.ColonySwitcher.partials.ColonyAvatarWrapper';

const ColonyAvatarWrapper: FC<ColonyAvatarProps> = ({
  colony,
  colonyAddress,
  isMobile,
  setTriggerRef,
}) => {
  return (
    <>
      <div className="relative" ref={setTriggerRef}>
        <span className="flex items-center justify-center bg-blue-300 rounded-full">
          <ColonyAvatar
            colony={colony}
            colonyAddress={colonyAddress || ''}
            size="sm"
          />
        </span>
        <div className={styles.avatar}>
          <Icon name="gnosis" />
        </div>
      </div>
      {isMobile && colony && (
        <div className="text-2 ml-2 shrink-0">
          {colony?.metadata?.displayName || colony?.name || 'Colony name'}
        </div>
      )}
    </>
  );
};

ColonyAvatarWrapper.displayName = displayName;

export default ColonyAvatarWrapper;
