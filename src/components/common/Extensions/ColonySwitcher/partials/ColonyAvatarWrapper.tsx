import React, { FC } from 'react';
import clsx from 'clsx';

import ColonyAvatar from '~shared/ColonyAvatar';
import Icon from '~shared/Icon';
import { Colony } from '~types';
import { ColonyAvatarProps } from '../types';
import styles from '../ColonySwitcher.module.css';

const displayName =
  'common.Extensions.ColonySwitcher.partials.ColonyAvatarWrapper';

const ColonyAvatarWrapper: FC<ColonyAvatarProps> = ({
  colonyToDisplay,
  colonyToDisplayAddress,
  isMobile,
  isArrowVisible,
  setTriggerRef,
}) => {
  return (
    <>
      <div className="relative">
        <span className="flex items-center justify-center bg-blue-300 rounded-full">
          <ColonyAvatar
            colony={colonyToDisplay as Colony}
            colonyAddress={colonyToDisplayAddress || ''}
            size="sm"
          />
        </span>
        <div className={styles.avatar}>
          <Icon name="gnosis" />
        </div>
      </div>
      {isMobile && colonyToDisplay && (
        <div className="text-2 ml-2 shrink-0">
          {colonyToDisplay?.metadata?.displayName ||
            colonyToDisplay?.name ||
            'Colony name'}
        </div>
      )}
      <span
        className={clsx('ml-2', {
          'opacity-0 pointer-events-none': !isArrowVisible,
        })}
        ref={setTriggerRef}
      >
        <Icon name="caret-down" appearance={{ size: 'extraExtraTiny' }} />
      </span>
    </>
  );
};

ColonyAvatarWrapper.displayName = displayName;

export default ColonyAvatarWrapper;
