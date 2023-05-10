import type { Meta, StoryObj } from '@storybook/react';
import Avatar from '~shared/Extensions/Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Shared/Avatar',
  component: Avatar,
  argTypes: {
    size: {
      name: 'Size',
      options: ['xxs', 'xs', 's', 'm', 'l', 'xl'],
      control: {
        type: 'select',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Base: Story = {};
