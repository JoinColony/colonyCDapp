import type { Meta, StoryObj } from '@storybook/react';

import CardWithBios from '~v5/shared/CardWithBios';

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
  },
};

export default meta;
type Story = StoryObj<typeof CardWithBios>;

export const Base: Story = {
  args: {
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incidide...',
    isContributorsList: true,
  },
};

export const Dedicated: Story = {
  args: {
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incidide...',
    isContributorsList: true,
  },
};

export const Banned: Story = {
  args: {
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incidide...',
    isContributorsList: true,
  },
};
