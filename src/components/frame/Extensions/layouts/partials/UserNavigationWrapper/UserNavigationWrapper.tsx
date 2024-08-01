import clsx from 'clsx';
import React, { type FC } from 'react';

import UserNavigation from '~common/Extensions/UserNavigation/index.ts';
import HeaderAvatar from '~common/Extensions/UserNavigation/partials/HeaderAvatar/index.ts';

import { type UserNavigationWrapperProps } from './types.ts';

const displayName = 'frame.Extensions.partials.UserNavigationWrapper';

const UserNavigationWrapper: FC<UserNavigationWrapperProps> = ({
  userHub,
  txButton,
  extra,
  isHidden,
  className,
}) => {
  const userHubComponent = userHub || <HeaderAvatar />;
  const userNavigation = (
    <UserNavigation
      txButton={txButton}
      userHub={userHubComponent}
      extra={extra}
    />
  );

  return (
    <div className={clsx(className, 'z-header flex')}>
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
