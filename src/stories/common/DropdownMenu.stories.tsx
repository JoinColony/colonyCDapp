import { User } from 'phosphor-react';
import React, { type FC } from 'react';

import { useMobile } from '~hooks/index.ts';
import DropdownMenu from '~v5/common/DropdownMenu/index.ts';
import { type DropdownMenuProps } from '~v5/common/DropdownMenu/types.ts';

import type { Meta, StoryObj } from '@storybook/react';

const dropdownMenuMeta: Meta<typeof DropdownMenu> = {
  title: 'Common/Dropdown Menu',
  component: DropdownMenu,
  parameters: {
    layout: 'centered',
  },
  args: {
    groups: [
      {
        key: '1',
        items: [
          {
            key: '1.1',
            to: '/',
            label: 'Label',
            icon: User,
          },
          {
            key: '1.2',
            label: 'Label',
            icon: User,
            tooltipProps: {
              tooltipContent: 'Tooltip content',
            },
          },
        ],
      },
      {
        key: '2',
        items: [
          {
            key: '2.1',
            label: 'Label',
          },
        ],
      },
      {
        key: '3',
        items: [
          {
            key: '3.1',
            label: 'Label',
            items: [
              {
                key: '3.1.1',
                label: 'Label',
              },
              {
                key: '3.1.2',
                label: 'Label',
              },
            ],
          },
        ],
      },
    ],
  },
};

export default dropdownMenuMeta;

export const Base: StoryObj<typeof DropdownMenu> = {};

export const WithPopover: StoryObj<typeof DropdownMenu> = {
  args: {
    showSubMenuInPopover: true,
  },
};

const DropdownMenuWithHooks: FC<DropdownMenuProps> = ({
  showSubMenuInPopover,
  ...rest
}) => {
  const isMobile = useMobile();

  return (
    <DropdownMenu
      showSubMenuInPopover={!isMobile && showSubMenuInPopover}
      {...rest}
    />
  );
};

export const WithPopoverOnDesktop: StoryObj<typeof DropdownMenu> = {
  render: (args) => <DropdownMenuWithHooks {...args} />,
  args: {
    showSubMenuInPopover: true,
  },
};
