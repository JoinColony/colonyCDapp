import Switch from '~v5/common/Fields/Switch/index.ts';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Switch> = {
  title: 'Common/Fields/Switch',
  component: Switch,
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Base: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
