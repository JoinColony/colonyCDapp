import { CircleWavyCheck, WarningCircle } from '@phosphor-icons/react';
import clsx from 'clsx';
import { isAddress } from 'ethers/lib/utils';
import React, { type ReactNode, type FC } from 'react';

import { formatText } from '~utils/intl.ts';
import UserAvatar, {
  type UserAvatarProps,
} from '~v5/shared/UserAvatar/index.ts';

interface AvatarWithAddressProps
  extends Omit<UserAvatarProps, 'userAddress' | 'size'> {
  address: string;
  isVerified?: boolean;
  title?: ReactNode | string;
  size?: UserAvatarProps['size'];
}
const AvatarWithAddress: FC<AvatarWithAddressProps> = ({
  address,
  isVerified,
  userName,
  userAvatarSrc,
  size = 20,
  title,
  ...rest
}) => {
  const isUserAddressValid = isAddress(address);
  return isUserAddressValid ? (
    <>
      <UserAvatar
        userName={userName}
        userAddress={address}
        userAvatarSrc={userAvatarSrc}
        size={size}
        {...rest}
      />
      <p
        className={clsx('ml-2 truncate text-md font-medium', {
          'text-warning-400': !isVerified,
          'text-gray-900': isVerified,
        })}
      >
        {title ?? address}
      </p>
      {isVerified && (
        <CircleWavyCheck
          size={14}
          className="ml-1 flex-shrink-0 text-blue-400"
        />
      )}
    </>
  ) : (
    <div className="flex items-center gap-1 text-negative-400">
      <WarningCircle size={16} />
      <span className="text-md">
        {formatText({
          id: 'actionSidebar.addressError',
        })}
      </span>
    </div>
  );
};

export default AvatarWithAddress;
