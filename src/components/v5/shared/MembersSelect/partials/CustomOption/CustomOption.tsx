import { UserCircle } from '@phosphor-icons/react';
import React from 'react';

import Avatar from '~v5/shared/Avatar/index.ts';

import { type MembersSelectOption } from '../../types.ts';

const CustomOption: React.FC<MembersSelectOption> = ({ label, avatar }) => (
  <span className="flex items-center w-full text-md gap-2">
    <Avatar
      avatar={avatar || undefined}
      seed={label.toLowerCase()}
      placeholderIcon={UserCircle}
    />
    {label}
  </span>
);

export default CustomOption;
