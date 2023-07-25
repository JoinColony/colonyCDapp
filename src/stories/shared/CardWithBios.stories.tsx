import type { Meta, StoryObj } from '@storybook/react';

import CardWithBios from '~v5/shared/CardWithBios';
import { permissions } from '~v5/shared/CardWithBios/partials/CardPermissions/consts';

const meta: Meta<typeof CardWithBios> = {
  title: 'Shared/Card With Bios',
  component: CardWithBios,
  argTypes: {
    description: {
      name: 'description',
      control: {
        type: 'text',
      },
    },
    userStatus: {
      name: 'user status',
      options: ['dedicated', 'active', 'new', 'top', 'banned'],
      control: {
        type: 'select',
      },
    },
    isVerified: {
      name: 'is verified',
      control: {
        type: 'boolean',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CardWithBios>;

export const Base: Story = {
  args: {
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incidide...',
    userStatus: 'general',
    permissions,
    isVerified: true,
    isContributorsList: true,
  },
};

export const Dedicated: Story = {
  args: {
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incidide...',
    userStatus: 'dedicated',
    permissions,
    isVerified: false,
    isContributorsList: true,
  },
};

export const Banned: Story = {
  args: {
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incidide...',
    userStatus: 'banned',
    permissions,
    isVerified: false,
    isContributorsList: true,
  },
};
