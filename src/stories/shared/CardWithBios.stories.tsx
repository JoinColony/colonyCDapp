import type { Meta, StoryObj } from '@storybook/react';

import CardWithBios from '~v5/shared/CardWithBios';
import {
  permissions,
  userStatustooltipDetails,
} from '~v5/shared/CardWithBios/partials/CardPermissions/consts';

const meta: Meta<typeof CardWithBios> = {
  title: 'Shared/CardWithBios',
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
    percentage: {
      name: 'percentage',
      control: {
        type: 'text',
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
    userStatus: 'dedicated',
    permissions,
    userStatusTooltipDetails: userStatustooltipDetails[3],
    percentage: 20,
    isVerified: true,
  },
};
