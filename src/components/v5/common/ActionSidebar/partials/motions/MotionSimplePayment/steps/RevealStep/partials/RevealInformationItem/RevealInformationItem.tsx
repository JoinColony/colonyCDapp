import React, { FC } from 'react';
import { RevealInformationListItem } from './types';
import { useUserByAddress } from '~hooks';
import AvatarUser from '~v5/shared/AvatarUser';
import Icon from '~shared/Icon';

const RevealInformationItem: FC<RevealInformationListItem> = ({
  address,
  hasRevealed,
}) => {
  const { user } = useUserByAddress(address);
  const { profile } = user || {};
  const { avatar, displayName } = profile || {};

  return (
    <div className="flex items-center justify-between gap-2">
      <AvatarUser avatar={avatar} userName={displayName || ''} size="xs" />
      <div className="flex items-center gap-2">
        <Icon
          name={hasRevealed ? 'eye' : 'eye-closed'}
          appearance={{ size: 'tiny' }}
        />
        <span className="text-sm">{hasRevealed ? 'Revealed' : 'Hidden'}</span>
      </div>
    </div>
  );
};

export default RevealInformationItem;
