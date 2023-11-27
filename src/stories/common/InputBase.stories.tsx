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
        options: ['primary', 'secondary'],
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
    state: 'error',
    defaultValue: 'Default value',
  },
};

export const WithErrorMessage: StoryObj<typeof InputBase> = {
  args: {
    mode: 'primary',
    message: (
      <span className="text-sm text-negative-400 block mt-1">
        Something went wrong
      </span>
    ),
    defaultValue: 'Default value',
  },
};

export const WithPrefix: StoryObj<typeof InputBase> = {
  args: {
    mode: 'secondary',
    defaultValue: 0,
    wrapperClassName: 'relative',
    prefix: <span className="text-md">Prefix</span>,
  },
};

export const WithSuffix: StoryObj<typeof InputBase> = {
  args: {
    mode: 'secondary',
    defaultValue: 0,
    wrapperClassName: 'relative',
    suffix: <span className="text-md">%</span>,
  },
};

export const WithPrefixAndSuffix: StoryObj<typeof InputBase> = {
  args: {
    mode: 'secondary',
    defaultValue: 0,
    wrapperClassName: 'flex items-center gap-2',
    suffix: <span className="text-md">%</span>,
    prefix: <span className="text-md">Prefix</span>,
  },
};

export const WithPrefixSuffixAndError: StoryObj<typeof InputBase> = {
  name: 'With prefix, suffix and error',
  args: {
    mode: 'secondary',
    defaultValue: 'Input text',
    wrapperClassName: 'relative',
    className: 'ml-12',
    suffix: <span className="text-md absolute top-[.1875rem] right-0">%</span>,
    prefix: (
      <span className="text-md absolute top-[.1875rem] left-0">Prefix</span>
    ),
    message: (
      <span className="text-sm text-negative-400 block mt-1">
        Something went wrong
      </span>
    ),
  },
};
