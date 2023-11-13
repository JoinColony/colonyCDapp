import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import MeatBallMenu from '~v5/shared/MeatBallMenu';

const meatBallMenuMeta: Meta<typeof MeatBallMenu> = {
  title: 'Shared/Meat Ball Menu',
  component: MeatBallMenu,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-full relative">
        <Story />
      </div>
    ),
  ],
};

export default meatBallMenuMeta;

export const Base: StoryObj<typeof MeatBallMenu> = {
  args: {
    items: [
      {
        key: '1',
        label: 'Add token',
        iconName: 'coin-vertical',
        onClick: () => {},
      },
      {
        key: '2',
        label: 'Duplicate row',
        iconName: 'copy-simple',
        onClick: () => {},
      },
    ],
  },
};

export const MenuWithoutIcons: StoryObj<typeof MeatBallMenu> = {
  args: {
    items: [
      {
        key: '1',
        label: 'Add token',
        onClick: () => {},
      },
      {
        key: '2',
        label: 'Duplicate row',
        onClick: () => {},
      },
    ],
  },
};

export const MenuWithScroll: StoryObj<typeof MeatBallMenu> = {
  args: {
    items: [
      {
        key: '1',
        label: 'Add token',
        onClick: () => {},
      },
      {
        key: '2',
        label: 'Duplicate row',
        onClick: () => {},
      },
      {
        key: '3',
        label: 'Add token',
        onClick: () => {},
      },
      {
        key: '4',
        label: 'Duplicate row',
        onClick: () => {},
      },
      {
        key: '5',
        label: 'Add token',
        onClick: () => {},
      },
      {
        key: '6',
        label: 'Duplicate row',
        onClick: () => {},
      },
      {
        key: '7',
        label: 'Add token',
        onClick: () => {},
      },
      {
        key: '8',
        label: 'Duplicate row',
        onClick: () => {},
      },
    ],
  },
};
