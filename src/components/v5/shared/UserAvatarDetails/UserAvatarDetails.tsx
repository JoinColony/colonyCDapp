import React, { FC } from 'react';
import clsx from 'clsx';

import Avatar from '~v5/shared/Avatar';
import Icon from '~shared/Icon';
import { useCopyToClipboard } from '~hooks/useCopyToClipboard';
import CopyWalletAddressButton from '~v5/shared/CopyWalletAddressButton';
import { UserAvatarDetailsProps } from './types';
import UserStatus from '~v5/common/Pills/UserStatus';
import { UserStatusMode } from '~v5/common/Pills/types';

const displayName = 'v5.UserAvatarDetails';

const UserAvatarDetails: FC<UserAvatarDetailsProps> = ({
  userName,
  walletAddress,
  userStatus,
  avatar,
}) => {
  const { handleClipboardCopy, isCopied } = useCopyToClipboard(
    walletAddress || '',
  );

  const mode: UserStatusMode =
    (userStatus === 'new' && 'active-new') ||
    (userStatus === 'active' && 'active-filled') ||
    (userStatus === 'dedicated' && 'dedicated-filled') ||
    (userStatus === 'top' && 'top-filled') ||
    'general';

  return (
    <div className="grid grid-cols-[auto,1fr] gap-x-4 items-center">
      {!!userStatus && userStatus === 'verified' ? (
        <Avatar size="m" title={userName} avatar={avatar} />
      ) : (
        <div className="flex relative justify-center">
          <div
            className={clsx('border-2 rounded-full [&>figure]:flex', {
              'border-success-400': userStatus === 'new',
              'border-warning-400': userStatus === 'active',
              'border-blue-400': userStatus === 'dedicated',
              'border-purple-400': userStatus === 'top',
            })}
          >
            <Avatar size="m" title={userName} avatar={avatar} />
          </div>
          {!!userStatus && (
            <span className="absolute bottom-[-0.9375rem]">
              <UserStatus mode={mode} text={{ id: userStatus }} />
            </span>
          )}
        </div>
      )}
      <div>
        <div className="grid grid-cols-[auto,1fr] gap-x-2 items-center mb-0.5">
          <p className="heading-4 truncate">{userName}</p>
          {userStatus === 'verified' && (
            <span className="flex shrink-0 text-blue-400">
              <Icon name="verified" appearance={{ size: 'tiny' }} />
            </span>
          )}
        </div>
        <CopyWalletAddressButton
          isCopied={isCopied}
          handleClipboardCopy={handleClipboardCopy}
          walletAddress={walletAddress || ''}
        />
      </div>
    </div>
  );
};

UserAvatarDetails.displayName = displayName;

export default UserAvatarDetails;
