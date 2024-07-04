import React, { type FC } from 'react';

import UserPopover from '~v5/shared/UserPopover/UserPopover.tsx';

import { type RecipientFieldProps } from './types.ts';

const RecipientField: FC<RecipientFieldProps> = ({ address }) => (
  <UserPopover size={18} walletAddress={address} withVerifiedBadge />
);

export default RecipientField;
