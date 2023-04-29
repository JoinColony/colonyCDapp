import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import RadioList from '~shared/Extensions/Fields/RadioList';
import { radioItems } from '~shared/Extensions/Fields/RadioList/consts';

const meta: Meta<typeof RadioList> = {
  title: 'Shared/Fields/Radio List',
  component: RadioList,
  argTypes: {
    items: {
      name: 'Items',
      control: {
        type: 'object',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof RadioList>;

// eslint-disable-next-line react/prop-types
const Template = ({ items, ...args }) => {
  // eslint-disable-next-line react/prop-types
  const [currentValue, setCurrentValue] = React.useState(items[0].value);

  return (
    <RadioList
      {...{ items, ...args }}
      // title=""
      // label=""
      value={currentValue}
      onChange={(value): void => {
        setCurrentValue(value || '');
      }}
    />
  );
};

export const Base: Story = {
  args: {
    title: 'Choose your governance style:',
    items: radioItems,
  },
  render: (args) => <Template {...args} />,
};

export const WithError: Story = {
  args: {
    title: 'Choose your governance style:',
    error: 'Please select a governance style option before enabling',
    items: radioItems,
  },
  render: (args) => <Template {...args} />,
};
