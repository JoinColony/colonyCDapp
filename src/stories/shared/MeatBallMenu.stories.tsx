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
    cardClassName: 'min-w-[12rem]',
    items: [
      {
        key: '1',
        label: 'Add token',
        iconName: 'coin-vertical',
        onClick: () => alert('Add token'),
      },
      {
        key: '2',
        label: 'Duplicate row',
        iconName: 'copy-simple',
        onClick: () => alert('Duplicate row'),
      },
    ],
  },
};

export const MenuWithoutIcons: StoryObj<typeof MeatBallMenu> = {
  args: {
    cardClassName: 'min-w-[10rem]',
    items: [
      {
        key: '1',
        label: 'Add token',
        onClick: () => alert('Add token'),
      },
      {
        key: '2',
        label: 'Duplicate row',
        onClick: () => alert('Duplicate row'),
      },
    ],
  },
};

export const MenuWithScroll: StoryObj<typeof MeatBallMenu> = {
  args: {
    cardClassName: 'min-w-[12rem]',
    items: [
      {
        key: '1',
        label: 'Add token',
        onClick: () => alert('Add token'),
      },
      {
        key: '2',
        label: 'Duplicate row',
        onClick: () => alert('Duplicate row'),
      },
      {
        key: '3',
        label: 'Add token',
        onClick: () => alert('Add token'),
      },
      {
        key: '4',
        label: 'Duplicate row',
        onClick: () => alert('Duplicate row'),
      },
      {
        key: '5',
        label: 'Add token',
        onClick: () => alert('Add token'),
      },
      {
        key: '6',
        label: 'Duplicate row',
        onClick: () => alert('Duplicate row'),
      },
      {
        key: '7',
        label: 'Add token',
        onClick: () => alert('Add token'),
      },
      {
        key: '8',
        label: 'Duplicate row',
        onClick: () => alert('Duplicate row'),
      },
    ],
  },
};

export const EmptyMenu: StoryObj<typeof MeatBallMenu> = {
  args: {
    cardClassName: 'min-w-[12rem]',
    items: [],
  },
};
