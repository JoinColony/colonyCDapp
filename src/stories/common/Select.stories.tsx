import React, { useState } from 'react';

import { tabList } from '~common/Extensions/UserHub/consts';
import { UserHubTabs } from '~common/Extensions/UserHub/types';
import Select from '~v5/common/Fields/Select';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Select> = {
  title: 'Common/Fields/Select',
  component: Select,
};

export default meta;
type Story = StoryObj<typeof Select>;

const SelectWithLogic = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <Select
      options={tabList}
      defaultValue={selectedTab}
      value={selectedTab}
      onChange={(value) => setSelectedTab(value?.value as UserHubTabs)}
    />
  );
};

export const Base: Story = {
  render: () => <SelectWithLogic />,
};
