import React, { type FC, type PropsWithChildren } from 'react';

import { formatText } from '~utils/intl.ts';
import UserStatus from '~v5/common/Pills/UserStatus/index.ts';

import Avatar from './Avatar.tsx';
import { badgeTextMapping } from './consts.ts';
import { type AvatarWithStatusBadgeProps } from './types.ts';

const displayName = 'v5.AvatarWithStatusBadge';

const AvatarWithStatusBadge: FC<
  PropsWithChildren<AvatarWithStatusBadgeProps>
> = ({ mode, badgeText, isFilled, ...rest }) => (
  <div className="flex justify-center items-center flex-col">
    <Avatar mode={mode} {...rest} />
    {mode && (
      <UserStatus
        mode={mode}
        text={
          badgeText || badgeTextMapping[mode]
            ? formatText({ id: badgeTextMapping[mode] })
            : undefined
        }
        isFilled={isFilled}
        className="-mt-3.5 relative z-[1]"
      />
    )}
  </div>
);

AvatarWithStatusBadge.displayName = displayName;

export default AvatarWithStatusBadge;
