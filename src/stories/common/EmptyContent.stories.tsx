import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import EmptyContent from '~v5/common/EmptyContent';

const meta: Meta<typeof EmptyContent> = {
  title: 'Common/Empty Content',
  component: EmptyContent,
  decorators: [
    (Story) => (
      <div className="max-w-[41.75rem] mx-auto">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    title: {
      name: 'Title',
      control: {
        type: 'text',
      },
    },
    description: {
      name: 'Description',
      control: {
        type: 'text',
      },
    },
    icon: {
      name: 'Icon',
      control: {
        type: 'text',
      },
    },
    withBorder: {
      name: 'With border',
      control: {
        type: 'boolean',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof EmptyContent>;

export const Base: Story = {
  args: {
    title: 'No results available',
    description:
      'There are no users in the Colony that match your search. Try searching again',
    icon: 'binoculars',
    withBorder: true,
  },
};

export const WithButton: Story = {
  args: {
    title: 'No results available',
    description:
      'There are no users in the Colony that match your search. Try searching again',
    icon: 'smiley-meh',
    withBorder: true,
    buttonText: 'Invite members',
    onClick: () => alert('Clicked'),
  },
};

export const WithoutBorder: Story = {
  args: {
    title: 'No results available',
    description:
      'There are no users in the Colony that match your search. Try searching again',
    icon: 'smiley-meh',
    withBorder: false,
  },
};
