import React, { type FC } from 'react';

import Icon from '~shared/Icon/index.ts';
import UserAvatarPopover from '~v5/shared/UserAvatarPopover/index.ts';

import { type RevealInformationListItem } from './types.ts';

const displayName =
  'v5.common.ActionSidebar.partials.motions.MotionSimplePayment.steps.RevealStep.partials.RevealInformationItem';

const RevealInformationItem: FC<RevealInformationListItem> = ({
  address,
  hasRevealed,
}) => {
  return (
    <div className="flex items-center justify-between gap-2 text-gray-900">
      <UserAvatarPopover walletAddress={address} />
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
