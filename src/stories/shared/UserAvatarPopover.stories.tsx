import type { Meta, StoryObj } from '@storybook/react';
import UserAvatarPopover from '~shared/Extensions/UserAvatarPopover';

const meta: Meta<typeof UserAvatarPopover> = {
  title: 'Shared/User Avatar Popover',
  component: UserAvatarPopover,
  argTypes: {
    userName: {
      name: 'User name',
      control: {
        type: 'text',
      },
    },
  },
  args: {
    userName: 'Panda',
  },
};

export default meta;
type Story = StoryObj<typeof UserAvatarPopover>;

export const Base: Story = {};
