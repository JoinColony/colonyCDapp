import type { Meta, StoryObj } from '@storybook/react';

import CardWithSections from '~v5/shared/CardWithSections';

const cardWithSectionsMeta: Meta<typeof CardWithSections> = {
  title: 'Shared/Card/With Sections',
  component: CardWithSections,
  args: {
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

export default cardWithSectionsMeta;

export const Base: StoryObj<typeof CardWithSections> = {};

export const WithCustomClasses: StoryObj<typeof CardWithSections> = {
  args: {
    sections: [
      {
        key: '1',
        content: 'Section 1',
      },
      {
        key: '2',
        content: 'Section 2',
        className: 'bg-red-100',
      },
    ],
  },
};
