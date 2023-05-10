import React, { FC } from 'react';
import ColonyAvatar from '~shared/ColonyAvatar';
import Icon from '~shared/Icon';
import { Colony } from '~types';
import { IColonyAvatar } from './types';

const displayName = 'common.Extensions.ColonySwitcher.ColonyAvatarWrapper';

const ColonyAvatarWrapper: FC<IColonyAvatar> = ({
  colonyToDisplay,
  colonyToDisplayAddress,
  isMobile,
  isOpen,
  setTriggerRef,
}) => (
  <>
    <div className="relative">
      <span
        className="flex items-center justify-center bg-blue-300 w-[2.2725rem] h-[2.2725rem]
            rounded-full"
      >
        <ColonyAvatar colony={colonyToDisplay as Colony} colonyAddress={colonyToDisplayAddress || ''} size="xxs" />
      </span>
      <div
        className="w-[1.175rem] h-[1.175rem] flex items-center justify-center absolute top-0 right-0 bg-base-white
            rounded-full border border-gray-200[&>i>svg]:stroke-base-white [&>i]:flex [&>i]:items-center
            [&>i]:justify-center [&>i>svg]:w-[0.6875rem] [&>i>svg]:h-[0.6875rem]"
      >
        <Icon name="gnosis" />
      </div>
    </div>

    {isMobile && (
      <div className="font-semibold text-md text-gray-900 mx-2">
        {colonyToDisplay?.metadata?.displayName || colonyToDisplay?.name || 'Colony name'}
      </div>
    )}

    <span className=" [&>i>svg]:fill-base-black [&>i>svg]:stroke-base-black" ref={setTriggerRef}>
      <Icon name={isOpen ? 'caret-up' : 'caret-down'} appearance={{ size: 'extraTiny' }} />
    </span>
  </>
);

ColonyAvatarWrapper.displayName = displayName;

export default ColonyAvatarWrapper;
