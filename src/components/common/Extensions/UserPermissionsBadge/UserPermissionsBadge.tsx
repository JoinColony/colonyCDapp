import React, { type FC, type PropsWithChildren } from 'react';

import Tooltip from '~shared/Extensions/Tooltip/index.ts';
import { formatText } from '~utils/intl.ts';

import { type UserPermissionsBadgeProps } from './types.ts';

const displayName = 'common.Extensions.UserPermissionsBadge';

const UserPermissionsBadge: FC<
  PropsWithChildren<UserPermissionsBadgeProps>
> = ({
  children,
  text,
  textValues,
  description,
  descriptionValues,
  icon: Icon,
  ...rest
}) => {
  const userPermissionsBadgeText = formatText(text, textValues);
  const userPermissionsBadgeDescription = formatText(
    description,
    descriptionValues,
  );

  const content = (
    <>
      <span className="flex shrink-0 items-center">
        <Icon size={12} />
      </span>
      <span className="ml-1.5">{userPermissionsBadgeText || children}</span>
    </>
  );

  return (
    <Tooltip
      {...rest}
      tooltipContent={
        <>
          <span className="mb-2.5 flex h-[1.875rem] items-center rounded-3xl border border-base-white px-3 py-1.5 text-center">
            {content}
          </span>
          {userPermissionsBadgeText}: {userPermissionsBadgeDescription}
        </>
      }
    >
      <span className="inline-flex h-[1.875rem] items-center rounded-3xl border border-gray-100 bg-base-white px-3 py-1.5 text-center text-3">
        {content}
      </span>
    </Tooltip>
  );
};

UserPermissionsBadge.displayName = displayName;

export default UserPermissionsBadge;
