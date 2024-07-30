import React from 'react';

import { type MembersSelectOption } from '~v5/shared/MembersSelect/types.ts';
import { UserAvatar } from '~v5/shared/UserAvatar/UserAvatar.tsx';

const CustomOption: React.FC<MembersSelectOption> = ({ label, avatar }) => (
  <span className="flex w-full items-center gap-2 text-md">
    <UserAvatar userAvatarSrc={avatar} userAddress={label} size={20} />
    {label}
  </span>
);

export default CustomOption;
