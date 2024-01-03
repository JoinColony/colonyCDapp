import React from 'react';

import { FormattedInput } from '~v5/common/Fields/InputBase';

import type { Meta, StoryObj } from '@storybook/react';

const formattedInputMeta: Meta<typeof FormattedInput> = {
  title: 'Common/Fields/Formatted Input',
  component: FormattedInput,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div className="max-w-[17.125rem]">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    mode: {
      name: 'Mode',
      control: {
        type: 'select',
        options: ['primary', 'secondary'],
      },
    },
  },
};

export default formattedInputMeta;

export const Base: StoryObj<typeof FormattedInput> = {
  args: {
    mode: 'primary',
    placeholder: 'Placeholder',
  },
};

export const WithButton: StoryObj<typeof FormattedInput> = {
  args: {
    mode: 'primary',
    placeholder: 'Placeholder',
    buttonProps: {
      label: 'Max',
      // eslint-disable-next-line no-console
      onClick: () => console.log('Clicked'),
    },
  },
};
