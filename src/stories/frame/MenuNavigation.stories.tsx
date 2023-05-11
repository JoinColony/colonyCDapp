import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import MenuNavigation from '~frame/Extensions/MenuNavigation';

const meta: Meta<typeof MenuNavigation> = {
  title: 'Frame/Menu navigation',
  component: MenuNavigation,
  decorators: [
    (Story) => (
      <div className="bg-gray-400 p-2">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MenuNavigation>;

export const Base: Story = {
  render: () => <MenuNavigation />,
};
