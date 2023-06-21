import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import EmptyContentBox from '~v5/common/EmptyContentBox';

const meta: Meta<typeof EmptyContentBox> = {
  title: 'Common/Empty Content',
  component: EmptyContentBox,
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
    withButtonIcon: {
      name: 'With button icon',
      control: {
        type: 'boolean',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof EmptyContentBox>;

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
    buttonText: 'Invite a user',
    withButtonIcon: true,
    onClick: () => alert('Clicked'),
  },
};
