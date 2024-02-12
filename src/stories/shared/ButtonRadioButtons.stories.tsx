import { ThumbsDown, ThumbsUp } from '@phosphor-icons/react';
import { type Meta, type StoryObj } from '@storybook/react';
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
          className:
            'text-gray-900 hover:text-negative-400 border-negative-400',
          checkedClassName: 'text-base-white bg-negative-400',
          iconClassName: 'text-negative-400',
          checkedIconClassName: 'text-base-white',
          icon: ThumbsDown,
        },
        {
          label: 'Support',
          id: 'support',
          value: 'support',
          className: 'text-gray-900 hover:text-purple-400 border-purple-400',
          checkedClassName: 'text-base-white bg-purple-400',
          iconClassName: 'text-purple-400',
          checkedIconClassName: 'text-base-white',
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
