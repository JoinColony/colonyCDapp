import type { Meta, StoryObj } from '@storybook/react';
import Accordion from '~v5/shared/Accordion';

const accordionMeta: Meta<typeof Accordion> = {
  title: 'Shared/Accordion',
  component: Accordion,
  args: {
    items: [
      {
        key: '1',
        title: 'Item 1',
        content: 'Item 1 content',
      },
      {
        key: '2',
        title: 'Item 2',
        content: 'Item 2 content',
      },
    ],
  },
};

export default accordionMeta;

export const Base: StoryObj<typeof Accordion> = {};

export const WithOpenedItem: StoryObj<typeof Accordion> = {
  args: {
    openedItemIndexes: [0],
  },
};
