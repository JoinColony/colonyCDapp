import type { Meta, StoryObj } from '@storybook/react';

import MenuWithStatusText from '~v5/shared/MenuWithStatusText';

const cardWithStatusTextMeta: Meta<typeof MenuWithStatusText> = {
  title: 'Shared/Card/With Status Text',
  component: MenuWithStatusText,
  args: {
    statusTextSectionProps: {
      status: 'info',
      children: 'This is a status text.',
      content: 'This is an additional content.',
    },
    sections: [
      {
        key: '1',
        content: 'Section 1',
      },
      {
        key: '2',
        content: 'Section 2',
      },
    ],
  },
};

export default cardWithStatusTextMeta;

export const Base: StoryObj<typeof MenuWithStatusText> = {};
