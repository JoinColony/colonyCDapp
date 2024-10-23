import { type Meta, type StoryObj } from '@storybook/react';
import React from 'react';

import CreateNewColonyCard from '~frame/LandingPage/ColonyCards/CreateNewColonyCard.tsx';

const meta: Meta<typeof CreateNewColonyCard> = {
  title: 'Common/Create New Colony Card',
  component: CreateNewColonyCard,
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-[41.75rem]">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    invitationsRemaining: {
      name: 'Invitation remaining',
      control: {
        type: 'number',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CreateNewColonyCard>;

export const Base: Story = {
  args: {
    invitationsRemaining: 2,
  },
};
