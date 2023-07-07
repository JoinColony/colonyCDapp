import React, { FC } from 'react';

import Avatar from '~v5/shared/Avatar';
import Icon from '~shared/Icon';
import { useCopyToClipboard } from '~hooks/useCopyToClipboard';
import CopyWalletAddressButton from '~v5/shared/CopyWalletAddressButton';
import { UserAvatarDetailsProps } from './types';

const displayName = 'v5.UserAvatarDetails';

const UserAvatarDetails: FC<UserAvatarDetailsProps> = ({
  userName,
  walletAddress,
  isVerified,
  avatar,
}) => {
  const { handleClipboardCopy, isCopied } = useCopyToClipboard(
    walletAddress || '',
  );

  return (
    <div className="grid grid-cols-[auto,1fr] gap-x-4 items-center">
      <Avatar size="m" title={userName} avatar={avatar} />
      <div>
        <div className="flex items-center mb-0.5">
          <p className="heading-4">{userName}</p>
          {isVerified && (
            <span className="ml-2 flex shrink-0 text-blue-400">
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
