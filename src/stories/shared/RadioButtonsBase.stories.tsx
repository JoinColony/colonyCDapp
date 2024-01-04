import React from 'react';

import RadioButtonsBase from '~v5/common/Fields/RadioButtons/RadioButtonsBase';

import type { Meta, StoryObj } from '@storybook/react';

const radioButtonsBaseMeta: Meta<typeof RadioButtonsBase> = {
  title: 'Common/Fields/Radio Buttons/Base',
  component: RadioButtonsBase,
};

export default radioButtonsBaseMeta;

const RadioButtonsBaseWithHooks = () => {
  const [value, setValue] = React.useState('first');

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  return (
    <RadioButtonsBase
      items={[
        {
          children: 'First',
          id: 'first',
          value: 'first',
        },
        {
          children: 'Second',
          id: 'second',
          value: 'second',
        },
        {
          children: ({ checked }) => (checked ? 'Third checked' : 'Third'),
          id: 'third',
          value: '3',
        },
      ]}
      value={value}
      onChange={handleChange}
    />
  );
};

export const Base: StoryObj<typeof RadioButtonsBase> = {
  render: () => {
    return <RadioButtonsBaseWithHooks />;
  },
};
