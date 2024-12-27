import clsx from 'clsx';
import React, { type FC } from 'react';

import UserNavigation from '~common/Extensions/UserNavigation/index.ts';
import HeaderAvatar from '~common/Extensions/UserNavigation/partials/HeaderAvatar/index.ts';

import { type UserNavigationWrapperProps } from './types.ts';

const displayName = 'frame.Extensions.partials.UserNavigationWrapper';

// @TODO: Come up with a better name other than UserNavigationWrapper
const UserNavigationWrapper: FC<UserNavigationWrapperProps> = ({
  userHub,
  txButton,
  extra,
  isHidden,
  className,
  isInColony,
}) => {
  const userHubComponent = userHub || <HeaderAvatar />;
  const userNavigation = (
    // @TODO: Come up with a better name other than UserNavigation
    <UserNavigation
      txButton={txButton}
      userHub={userHubComponent}
      extra={extra}
      isInColony={isInColony}
    />
  );

  return (
    <div className={clsx(className, 'flex')}>
      <div
        className={clsx('ml-auto transition-all', {
          'opacity-0': isHidden,
        })}
      >
        {userNavigation}
      </div>
    </div>
  );
};

UserNavigationWrapper.displayName = displayName;

export default UserNavigationWrapper;
