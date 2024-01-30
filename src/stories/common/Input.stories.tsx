import Input from '~v5/common/Fields/Input/index.ts';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Input> = {
  title: 'Common/Fields/Input',
  component: Input,
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Base: Story = {};

export const WithLabelAndPlaceholder: Story = {
  args: {
    placeholder: 'This is the placeholder content',
  },
};

export const WithDifferentMaxCharNumber: Story = {
  args: {
    placeholder: 'This is the placeholder content',
    maxCharNumber: 90,
  },
};

export const WithShowedFieldLimit: Story = {
  args: {
    placeholder: 'This is the placeholder content',
    maxCharNumber: 10,
    shouldNumberOfCharsBeVisible: true,
  },
};

export const WithCustomErrorMessage: Story = {
  args: {
    placeholder: 'This is the placeholder content',
    shouldNumberOfCharsBeVisible: false,
    customErrorMessage:
      'Please select a governance style option before enabling',
  },
};

export const WithDisableInput: Story = {
  args: {
    placeholder: 'This is the placeholder content',
    shouldNumberOfCharsBeVisible: false,
    isDisabled: true,
  },
};

export const WithDecoratedSuccessfulMessage: Story = {
  args: {
    placeholder: 'This is the placeholder content',
    successfulMessage: 'Username avaliable',
  },
};
