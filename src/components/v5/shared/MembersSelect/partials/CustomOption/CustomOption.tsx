import React from 'react';

import { UserAvatar2 } from '~v5/shared/UserAvatar/UserAvatar.tsx';

import { type MembersSelectOption } from '../../types.ts';

const CustomOption: React.FC<MembersSelectOption> = ({ label, avatar }) => (
  <span className="flex items-center w-full text-md gap-2">
    <UserAvatar2 userAvatarSrc={avatar} userAddress={label} size={20} />
    {label}
  </span>
);

export default CustomOption;
