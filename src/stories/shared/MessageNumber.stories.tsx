import type { Meta, StoryObj } from '@storybook/react';

import MessageNumber from '~v5/shared/MessageNumber';

const messageNumberMeta: Meta<typeof MessageNumber> = {
  title: 'Shared/Message number',
  component: MessageNumber,
  argTypes: {
    message: {
      name: 'Number',
      control: {
        type: 'number',
      },
    },
  },
};

export default messageNumberMeta;

export const Base: StoryObj<typeof MessageNumber> = {
  args: {
    message: 1,
  },
};
