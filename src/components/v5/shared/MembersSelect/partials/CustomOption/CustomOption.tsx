import React from 'react';

import Avatar from '~v5/shared/Avatar';

import { MembersSelectOption } from '../../types';

const CustomOption: React.FC<MembersSelectOption> = ({ label, avatar }) => (
  <span className="flex items-center w-full text-md gap-2">
    <Avatar
      avatar={avatar || undefined}
      seed={label.toLowerCase()}
      placeholderIcon="circle-person"
    />
    {label}
  </span>
);

export default CustomOption;
