import React, { useState } from 'react';

import { tabList } from '~common/Extensions/UserHub/consts.ts';
import { type UserHubTab } from '~common/Extensions/UserHub/types.ts';
import Select from '~v5/common/Fields/Select/index.ts';

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
      onChange={(value) => setSelectedTab(value?.value as UserHubTab)}
    />
  );
};

export const Base: Story = {
  render: () => <SelectWithLogic />,
};
