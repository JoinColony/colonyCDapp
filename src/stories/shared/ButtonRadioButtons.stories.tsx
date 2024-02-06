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
          colorClassName: 'text-negative-300',
          checkedColorClassName: 'text-negative-400',
          iconClassName: 'text-negative-400',
          hoverColorClassName: 'md:hover:text-negative-400',
          icon: ThumbsDown,
        },
        {
          label: 'Support',
          id: 'support',
          value: 'support',
          colorClassName: 'text-purple-200',
          checkedColorClassName: 'text-purple-400',
          iconClassName: 'text-purple-400',
          hoverColorClassName: 'md:hover:text-purple-400',
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
