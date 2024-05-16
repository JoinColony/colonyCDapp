import { Eye, EyeClosed } from '@phosphor-icons/react';
import React, { type FC } from 'react';

import UserPopover from '~v5/shared/UserPopover/index.ts';

import { type RevealInformationListItem } from './types.ts';

const displayName =
  'v5.common.ActionSidebar.partials.motions.MotionSimplePayment.steps.RevealStep.partials.RevealInformationItem';

const RevealInformationItem: FC<RevealInformationListItem> = ({
  address,
  hasRevealed,
}) => {
  return (
    <div className="flex items-center justify-between gap-2 text-gray-900">
      <UserPopover size={20} walletAddress={address} textClassName="text-sm" />
      <div className="flex items-center gap-2 text-gray-900">
        {hasRevealed ? <Eye size={14} /> : <EyeClosed size={14} />}
        <span className="text-sm">{hasRevealed ? 'Revealed' : 'Hidden'}</span>
      </div>
    </div>
  );
};

RevealInformationItem.displayName = displayName;

export default RevealInformationItem;
