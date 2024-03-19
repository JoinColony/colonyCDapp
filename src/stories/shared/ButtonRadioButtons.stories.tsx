import { ThumbsDown, ThumbsUp } from '@phosphor-icons/react';
import { type Meta, type StoryObj } from '@storybook/react';
import clsx from 'clsx';
import React from 'react';

import ButtonRadioButtons from '~v5/common/Fields/RadioButtons/ButtonRadioButtons/index.ts';

const ButtonRadioButtonsMeta: Meta<typeof ButtonRadioButtons> = {
  title: 'Common/Fields/Radio Buttons/Button',
  component: ButtonRadioButtons,
};

export default ButtonRadioButtonsMeta;

const ButtonRadioButtonsWithHooks = () => {
  const [value, setValue] = React.useState('first');

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  return (
    <ButtonRadioButtons
      items={[
        {
          label: 'Oppose',
          id: 'oppose',
          value: 'oppose',
          className: (checked, disabled) =>
            clsx({
              'border-negative-300 text-gray-900 [&_.icon]:text-negative-400':
                !checked && !disabled,
              'border-gray-300 text-gray-300 [&_.icon]:text-gray-300': disabled,
              'border-negative-400 bg-negative-400 text-base-white':
                checked && !disabled,
            }),
          icon: ThumbsDown,
        },
        {
          label: 'Support',
          id: 'support',
          value: 'support',
          className: (checked, disabled) =>
            clsx({
              'border-purple-200 text-gray-900 [&_.icon]:text-purple-400':
                !checked && !disabled,
              'border-gray-300 text-gray-300 [&_.icon]:text-gray-300': disabled,
              'border-purple-400 bg-purple-400 text-base-white':
                checked && !disabled,
            }),
          icon: ThumbsUp,
        },
      ]}
      value={value}
      onChange={handleChange}
    />
  );
};

export const Base: StoryObj<typeof ButtonRadioButtons> = {
  render: () => {
    return <ButtonRadioButtonsWithHooks />;
  },
};
