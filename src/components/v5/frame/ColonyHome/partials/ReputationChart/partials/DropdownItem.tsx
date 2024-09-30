import { type IconProps } from '@phosphor-icons/react';
import React, { type ComponentType, type FC } from 'react';

import { tw } from '~utils/css/index.ts';

// eslint-disable-next-line max-len
const dropdownItemClassName = tw`flex w-full items-center gap-2 rounded-s px-3 py-2 text-md text-gray-900 hover:font-medium md:hover:bg-gray-50`;

interface DropdownItemProps {
  onClick?: () => void;
  icon: ComponentType<IconProps>;
  label: string;
}

export const DropdownItem: FC<DropdownItemProps> = ({
  icon: Icon,
  label,
  onClick,
}) => (
  <button type="button" className={dropdownItemClassName} onClick={onClick}>
    <Icon size={18} />
    <span>{label}</span>
  </button>
);
