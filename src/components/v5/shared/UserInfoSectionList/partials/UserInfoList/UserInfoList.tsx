import clsx from 'clsx';
import React, { type FC } from 'react';

import UserAvatar from '~v5/shared/UserAvatar/index.ts';

import { type UserInfoListProps } from './types.ts';

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
          <UserAvatar avatarSize="xs" user={user} showUsername />
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
