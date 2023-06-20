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
  isOpen,
  setTriggerRef,
}) => {
  const isArrowVisible = !isMobile || (isMobile && isOpen);

  return (
    <>
      <div className="relative">
        <span className="flex items-center justify-center bg-blue-300 w-[2.25rem] h-[2.25rem] rounded-full">
          <ColonyAvatar
            colony={colonyToDisplay as Colony}
            colonyAddress={colonyToDisplayAddress || ''}
            size="xxs"
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
      {isArrowVisible && (
        <span
          className={clsx(
            'text-base-black transition-transform duration-normal ml-2',
            {
              'rotate-180': isOpen,
            },
          )}
          ref={setTriggerRef}
        >
          <Icon name="caret-up" appearance={{ size: 'extraTiny' }} />
        </span>
      )}
    </>
  );
};

ColonyAvatarWrapper.displayName = displayName;

export default ColonyAvatarWrapper;
