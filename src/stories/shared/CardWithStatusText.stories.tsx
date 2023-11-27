import type { Meta, StoryObj } from '@storybook/react';

import CardWithStatusText from '~v5/shared/CardWithStatusText';

const cardWithStatusTextMeta: Meta<typeof CardWithStatusText> = {
  title: 'Shared/Card/With Status Text',
  component: CardWithStatusText,
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

export const Base: StoryObj<typeof CardWithStatusText> = {};
