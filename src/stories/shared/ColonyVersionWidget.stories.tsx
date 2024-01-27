import ColonyVersionWidget from '~v5/shared/ColonyVersionWidget/index.tsx';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ColonyVersionWidget> = {
  title: 'Shared/Colony version widget',
  component: ColonyVersionWidget,
};

export default meta;
type Story = StoryObj<typeof ColonyVersionWidget>;

export const Success: Story = {
  args: {
    status: 'success',
    currentVersion: 12,
    latestVersion: 12,
  },
};

export const Error: Story = {
  args: {
    status: 'error',
    currentVersion: 10,
    latestVersion: 12,
  },
};
