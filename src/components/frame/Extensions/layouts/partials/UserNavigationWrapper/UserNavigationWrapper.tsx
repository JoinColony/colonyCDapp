import React, { FC } from 'react';
import clsx from 'clsx';

import HeaderAvatar from '~common/Extensions/UserNavigation/partials/HeaderAvatar';
import UserNavigation from '~common/Extensions/UserNavigation';

import { UserNavigationWrapperProps } from './types';

const displayName = 'frame.Extensions.partials.UserNavigationWrapper';

const UserNavigationWrapper: FC<UserNavigationWrapperProps> = ({
  userHub,
  txButtons,
  extra,
  isHidden,
}) => {
  const userHubComponent = userHub || <HeaderAvatar />;
  const userNavigation = (
    <UserNavigation
      txButtons={txButtons}
      userHub={userHubComponent}
      extra={extra}
    />
  );

  return (
    <div className="w-full flex">
      <div
        className={clsx('transition-all ml-auto', {
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
