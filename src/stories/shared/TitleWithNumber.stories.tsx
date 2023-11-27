import type { Meta, StoryObj } from '@storybook/react';

import TitleWithNumber from '~v5/shared/TitleWithNumber';

const titleWithNumnerMeta: Meta<typeof TitleWithNumber> = {
  title: 'Shared/Title with number',
  component: TitleWithNumber,
  argTypes: {
    title: {
      name: 'Title',
      control: {
        type: 'text',
      },
    },
    number: {
      name: 'Number',
      control: {
        type: 'number',
      },
    },
  },
};

export default titleWithNumnerMeta;

export const Base: StoryObj<typeof TitleWithNumber> = {
  args: {
    title: 'Aggrements',
    number: 12,
  },
};

export const WithNoTitle: StoryObj<typeof TitleWithNumber> = {
  args: {
    number: 12,
  },
};

export const WithNoNumber: StoryObj<typeof TitleWithNumber> = {
  args: {
    title: 'Aggrements',
  },
};
