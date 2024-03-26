import React from 'react';

import { UserAvatar } from '~v5/shared/UserAvatar/UserAvatar.tsx';

import { type MembersSelectOption } from '../../types.ts';

const CustomOption: React.FC<MembersSelectOption> = ({ label, avatar }) => (
  <span className="flex w-full items-center gap-2 text-md">
    <UserAvatar userAvatarSrc={avatar} userAddress={label} size={20} />
    {label}
  </span>
);

export default CustomOption;
