import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import InputBase from '~v5/common/Fields/InputBase';

const inputBaseMeta: Meta<typeof InputBase> = {
  title: 'Common/Fields/Input Base',
  component: InputBase,
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
        options: ['primary', 'secondary', 'tertiary'],
      },
    },
  },
};

export default inputBaseMeta;

export const Base: StoryObj<typeof InputBase> = {
  args: {
    mode: 'primary',
    placeholder: 'Placeholder',
  },
};

export const WithError: StoryObj<typeof InputBase> = {
  args: {
    mode: 'primary',
    hasError: true,
    defaultValue: 'Default value',
  },
};

export const WithErrorMessage: StoryObj<typeof InputBase> = {
  args: {
    mode: 'primary',
    errorMessage: 'Something went wrong',
    defaultValue: 'Default value',
  },
};

export const WithPrefix: StoryObj<typeof InputBase> = {
  args: {
    mode: 'secondary',
    defaultValue: 0,
    prefix: <span className="text-md">Prefix</span>,
  },
};

export const WithSuffix: StoryObj<typeof InputBase> = {
  args: {
    mode: 'secondary',
    defaultValue: 0,
    suffix: <span className="text-md">%</span>,
  },
};
