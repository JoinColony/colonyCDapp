import React from 'react';
import Avatar from '~v5/shared/Avatar';
import { MembersSelectOption } from '../../types';

const CustomOption: React.FC<MembersSelectOption> = ({ label, user }) =>
  user ? (
    <span className="flex items-center w-full text-md gap-2">
      <Avatar
        avatar={user.profile?.avatar || user.profile?.thumbnail || undefined}
        seed={user.walletAddress.toLowerCase()}
        placeholderIcon="circle-person"
      />
      {label}
    </span>
  ) : (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>{label}</>
  );

export default CustomOption;
