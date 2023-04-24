import type { Meta, StoryObj } from '@storybook/react';
import Tabs from '~shared/Extensions/Tabs';
import { tabsItems } from '~shared/Extensions/Tabs/consts';

const meta: Meta<typeof Tabs> = {
  title: 'Shared/Tabs',
  component: Tabs,
  args: {
    items: tabsItems,
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Base: Story = {};
