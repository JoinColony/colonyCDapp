import { CoinVertical, CopySimple } from '@phosphor-icons/react';
import React from 'react';

import MeatBallMenu from '~v5/shared/MeatBallMenu/index.ts';

import type { Meta, StoryObj } from '@storybook/react';

const meatBallMenuMeta: Meta<typeof MeatBallMenu> = {
  title: 'Shared/Meat Ball Menu',
  component: MeatBallMenu,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="relative w-full">
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
        icon: CoinVertical,
      },
      {
        key: '2',
        label: 'Duplicate row',
        icon: CopySimple,
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
      },
      {
        key: '2',
        label: 'Duplicate row',
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
      },
      {
        key: '2',
        label: 'Duplicate row',
      },
      {
        key: '3',
        label: 'Add token',
      },
      {
        key: '4',
        label: 'Duplicate row',
      },
      {
        key: '5',
        label: 'Add token',
      },
      {
        key: '6',
        label: 'Duplicate row',
      },
      {
        key: '7',
        label: 'Add token',
      },
      {
        key: '8',
        label: 'Duplicate row',
      },
    ],
  },
};
