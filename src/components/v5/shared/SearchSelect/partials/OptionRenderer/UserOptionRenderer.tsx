import { SealCheck } from '@phosphor-icons/react';
import React from 'react';

import { formatText } from '~utils/intl.ts';
import { type UserOptionRendererProps } from '~v5/shared/SearchSelect/types.ts';
import UserAvatar from '~v5/shared/UserAvatar/UserAvatar.tsx';

export const UserOptionRenderer: UserOptionRendererProps = (
  option,
  isLabelVisible,
) => {
  const { showAvatar, avatar, walletAddress = '', label, isVerified } = option;
  const labelText = formatText(label || '');

  return (
    <>
      {showAvatar && (
        <UserAvatar
          className="mr-2"
          userAvatarSrc={avatar && avatar.length > 0 ? avatar : undefined}
          userAddress={walletAddress}
          size={20}
        />
      )}
      {isLabelVisible && labelText}
      {!label && <span className="truncate">{walletAddress}</span>}
      {isVerified && (
        <SealCheck size={14} className="ml-1 flex-shrink-0 text-blue-400" />
      )}
    </>
  );
};
