import { Binoculars, SmileyMeh } from '@phosphor-icons/react';
import { type Meta, type StoryObj } from '@storybook/react';
import React from 'react';

import EmptyContent from '~v5/common/EmptyContent/index.ts';

const meta: Meta<typeof EmptyContent> = {
  title: 'Common/Empty Content',
  component: EmptyContent,
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-[41.75rem]">
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
    icon: Binoculars,
    withBorder: true,
  },
};

export const WithButton: Story = {
  argTypes: {
    onClick: {
      action: 'clicked',
    },
  },
  args: {
    title: 'No results available',
    description:
      'There are no users in the Colony that match your search. Try searching again',
    icon: SmileyMeh,
    withBorder: true,
    buttonText: 'Invite members',
  },
};

export const WithoutBorder: Story = {
  args: {
    title: 'No results available',
    description:
      'There are no users in the Colony that match your search. Try searching again',
    icon: SmileyMeh,
    withBorder: false,
  },
};
