import type { Meta, StoryObj } from '@storybook/react';
import React, { FC, useState } from 'react';

import Select from '~v5/common/Fields/Select';
import { SelectProps } from '~v5/common/Fields/Select/types';

const meta: Meta<typeof Select> = {
  title: 'Common/Fields/Select',
  component: Select,
  args: {
    list: [
      {
        key: '1',
        label: 'Option 1',
        value: 'Option 1',
      },
      {
        key: '2',
        label: 'Option 2',
        value: 'Option 2',
      },
      {
        key: '3',
        label: 'Option 3',
        value: 'Option 3',
      },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof Select>;
interface SelectOption {
  key: string;
  label: string;
  value: string;
}

const SelectWithLogic: FC<Pick<SelectProps<SelectOption[]>, 'list'>> = ({
  list,
}) => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleChange = (selectedOption: number) => {
    setSelectedTab(selectedOption);
  };

  return (
    <Select<SelectOption[]>
      list={list}
      selectedElement={selectedTab}
      handleChange={handleChange}
    />
  );
};

export const Base: Story = {
  render: ({ list }) => <SelectWithLogic list={list} />,
};
