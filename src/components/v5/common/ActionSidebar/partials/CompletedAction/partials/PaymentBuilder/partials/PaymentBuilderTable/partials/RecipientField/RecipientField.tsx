import React, { type FC } from 'react';

import LoadingSkeleton from '~common/LoadingSkeleton/LoadingSkeleton.tsx';
import useUserByAddress from '~hooks/useUserByAddress.ts';
import UserPopover from '~v5/shared/UserPopover/UserPopover.tsx';

import { type RecipientFieldProps } from './types.ts';

const RecipientField: FC<RecipientFieldProps> = ({ address, isLoading }) => {
  const { user, loading: isUserLoading } = useUserByAddress(address, true);

  return (
    <LoadingSkeleton
      isLoading={isLoading || isUserLoading}
      className="h-4 w-full rounded"
    >
      <UserPopover
        size={18}
        walletAddress={user?.walletAddress ?? address}
        withVerifiedBadge
      />
    </LoadingSkeleton>
  );
};

export default RecipientField;
