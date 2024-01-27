import React, { FC } from 'react';

import useUserByAddress from '~hooks/useUserByAddress.ts';
import Icon from '~shared/Icon/index.ts';
import AvatarUser from '~v5/shared/AvatarUser/index.ts';

import { RevealInformationListItem } from './types.ts';

const displayName =
  'v5.common.ActionSidebar.partials.motions.MotionSimplePayment.steps.RevealStep.partials.RevealInformationItem';

const RevealInformationItem: FC<RevealInformationListItem> = ({
  address,
  hasRevealed,
}) => {
  const { user } = useUserByAddress(address);
  const { profile } = user || {};
  const { avatar, displayName: userName } = profile || {};

  return (
    <div className="flex items-center justify-between gap-2 text-gray-900">
      <AvatarUser avatar={avatar} userName={userName || ''} size="xs" />
      <div className="flex items-center gap-2 text-gray-900">
        <Icon
          name={hasRevealed ? 'eye' : 'eye-closed'}
          appearance={{ size: 'tiny' }}
        />
        <span className="text-sm">{hasRevealed ? 'Revealed' : 'Hidden'}</span>
      </div>
    </div>
  );
};

RevealInformationItem.displayName = displayName;

export default RevealInformationItem;
