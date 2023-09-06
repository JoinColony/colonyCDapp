import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import IconedText from '~v5/shared/IconedText';

const iconedTextMeta: Meta<typeof IconedText> = {
  title: 'Shared/Iconed Text',
  component: IconedText,
  argTypes: {
    status: {
      name: 'Status',
      control: {
        type: 'select',
      },
      options: ['success', 'warning', 'error'],
    },
    title: {
      name: 'Title',
      control: {
        type: 'text',
      },
    },
    withIcon: {
      name: 'With Icon',
      control: {
        type: 'boolean',
      },
    },
  },
  args: {
    status: 'success',
    title:
      'The required permissions have been updated. You can now enable the extension.',
    withIcon: true,
  },
};

export default iconedTextMeta;

export const Base: StoryObj<typeof IconedText> = {
  render: (args) => <IconedText {...args} />,
};
