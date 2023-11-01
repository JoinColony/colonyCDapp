import type { Meta, StoryObj } from '@storybook/react';

import Textarea from '~v5/common/Fields/Textarea';

const meta: Meta<typeof Textarea> = {
  title: 'Common/Fields/Textarea',
  component: Textarea,
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Base: Story = {};

export const WithLabelAndPlaceholder: Story = {
  args: {
    textareaTitle: 'Payment description (Optional)',
    placeholder: 'This is the placeholder content',
  },
};

export const WithDifferentMaxCharNumber: Story = {
  args: {
    textareaTitle: 'Payment description (Optional)',
    placeholder: 'This is the placeholder content',
    maxCharNumber: 500,
  },
};

export const WithShowedFieldLimit: Story = {
  args: {
    textareaTitle: 'Payment description (Optional)',
    placeholder: 'This is the placeholder content',
    maxCharNumber: 90,
    showFieldLimit: true,
    shouldNumberOfCharsBeVisible: true,
  },
};
