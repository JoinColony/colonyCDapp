import React, { type FC } from 'react';

import useUserByAddress from '~hooks/useUserByAddress.ts';
import UserPopover from '~v5/shared/UserPopover/UserPopover.tsx';

import { type RecipientFieldProps } from './types.ts';

const RecipientField: FC<RecipientFieldProps> = ({ address, isLoading }) => {
  const { user, loading: isUserLoading } = useUserByAddress(address, true);

  if (isLoading || isUserLoading) {
    return (
      <div className="flex w-full items-center">
        <div className="h-4 w-full overflow-hidden rounded skeleton" />
      </div>
    );
  }

  return (
    <UserPopover
      size={18}
      walletAddress={user?.walletAddress ?? address}
      withVerifiedBadge
    />
  );
};

export default RecipientField;
