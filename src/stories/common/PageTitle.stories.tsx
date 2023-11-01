import type { Meta, StoryObj } from '@storybook/react';

import PageTitle from '~v5/common/PageTitle';

const meta: Meta<typeof PageTitle> = {
  title: 'Common/Page Title',
  component: PageTitle,
  argTypes: {
    title: {
      name: 'Title',
      control: {
        type: 'text',
      },
    },
    subtitle: {
      name: 'Subtitle',
      control: {
        type: 'text',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PageTitle>;

export const Base: Story = {
  args: {
    title: { id: 'membersPage.title' },
    subtitle: { id: 'membersPage.description' },
  },
};
