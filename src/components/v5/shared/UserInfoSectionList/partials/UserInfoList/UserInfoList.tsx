import React, { FC } from 'react';
import clsx from 'clsx';

import UserAvatar from '~v5/shared/UserAvatar';
import UserPopover from '~v5/shared/UserPopover';

import { UserInfoListProps } from './types';

const displayName = 'v5.UserInfoSectionList.partials.UserInfoList';

const UserInfoList: FC<UserInfoListProps> = ({ items, className }) => {
  const infoClassName = 'flex-shrink-0 text-right text-sm text-gray-900';

  return items.length > 0 ? (
    <ul className={clsx(className, 'w-full flex flex-col gap-3')}>
      {items.map(({ key: itemKey, info, userProps: { user } }) => (
        <li
          key={itemKey}
          className="w-full flex items-center justify-between gap-4"
        >
          <UserPopover user={user} userName={user?.profile?.displayName}>
            <UserAvatar avatarSize="xs" user={user} showUsername />
          </UserPopover>
          {typeof info === 'string' ? (
            <p className={infoClassName}>{info}</p>
          ) : (
            <div className={infoClassName}>{info}</div>
          )}
        </li>
      ))}
    </ul>
  ) : null;
};

UserInfoList.displayName = displayName;

export default UserInfoList;
