import { type Meta, type StoryObj } from '@storybook/react';
import React from 'react';

import ColonyCard from '~frame/LandingPage/ColonyCard.tsx';

const meta: Meta<typeof ColonyCard> = {
  title: 'Common/Colony Card',
  component: ColonyCard,
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-[41.75rem]">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    colonyName: {
      name: 'Colony name',
      control: {
        type: 'text',
      },
    },
    colonyAvatar: {
      name: 'Colony avatar',
      control: {
        type: 'text',
      },
    },
    membersCount: {
      name: 'Members count',
      control: {
        type: 'number',
      },
    },
    invitationsRemaining: {
      name: 'Invitations remaining',
      control: {
        type: 'number',
      },
    },
    loading: {
      name: 'Loading',
      control: {
        type: 'boolean',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ColonyCard>;

export const ActiveColony: Story = {
  args: {
    colonyName: 'Beta colony',
    colonyAvatar: 'https://picsum.photos/200',
    membersCount: 1520,
    invitationsRemaining: 2,
  },
};

export const CreateColony: Story = {
  args: {
    invitationsRemaining: 3,
  },
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};
