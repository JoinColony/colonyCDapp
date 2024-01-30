import MenuWithSections from '~v5/shared/MenuWithSections/index.ts';

import type { Meta, StoryObj } from '@storybook/react';

const cardWithSectionsMeta: Meta<typeof MenuWithSections> = {
  title: 'Shared/Card/With Sections',
  component: MenuWithSections,
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

export const Base: StoryObj<typeof MenuWithSections> = {};

export const WithCustomClasses: StoryObj<typeof MenuWithSections> = {
  args: {
    sections: [
      {
        key: '1',
        content: 'Section 1',
      },
      {
        key: '2',
        content: 'Section 2',
        className: 'bg-negative-100',
      },
    ],
  },
};
