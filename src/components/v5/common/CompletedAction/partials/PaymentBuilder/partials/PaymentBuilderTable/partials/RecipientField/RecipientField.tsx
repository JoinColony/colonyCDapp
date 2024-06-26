import React, { type FC } from 'react';

import useUserByAddress from '~hooks/useUserByAddress.ts';
import UserPopover from '~v5/shared/UserPopover/UserPopover.tsx';

import { type RecipientFieldProps } from './types.ts';

const RecipientField: FC<RecipientFieldProps> = ({ address }) => {
  const { user, loading } = useUserByAddress(address, true);

  return (
    <>
      {!loading && (
        <div className="flex items-center">
          <UserPopover
            size={18}
            walletAddress={user?.walletAddress ?? address}
            className="flex items-center sm:hover:text-blue-400"
          />
        </div>
      )}
    </>
  );
};

export default RecipientField;
