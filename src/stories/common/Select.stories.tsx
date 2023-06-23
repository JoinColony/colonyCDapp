import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

import { tabList } from '~common/Extensions/UserHub/consts';
import Select from '~v5/common/Fields/Select';

const meta: Meta<typeof Select> = {
  title: 'Common/Fields/Select',
  component: Select,
};

export default meta;
type Story = StoryObj<typeof Select>;

const SelectWithLogic = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleChange = (selectedOption: number) => {
    setSelectedTab(selectedOption);
  };

  return (
    <Select
      list={tabList}
      selectedElement={selectedTab}
      handleChange={handleChange}
    />
  );
};

export const Base: Story = {
  render: () => <SelectWithLogic />,
};
