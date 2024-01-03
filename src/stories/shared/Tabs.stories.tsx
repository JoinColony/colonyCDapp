import React, { useState } from 'react';

import Tabs from '~shared/Extensions/Tabs';
import { tabsItems } from '~shared/Extensions/Tabs/consts';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Tabs> = {
  title: 'Shared/Tabs',
  component: Tabs,
  args: {
    items: tabsItems,
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

const TabsWithHooks = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleOnTabClick = (_, id) => {
    setActiveTab(id);
  };
  return (
    <Tabs
      items={tabsItems}
      activeTab={activeTab}
      onTabClick={handleOnTabClick}
    />
  );
};

export const Base: Story = {
  render: () => <TabsWithHooks />,
};
