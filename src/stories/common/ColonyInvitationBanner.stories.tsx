import { type Meta, type StoryObj } from '@storybook/react';
import React from 'react';

import ColonyInvitationBanner from '~frame/LandingPage/ColonyInvitationBanner.tsx';

const meta: Meta<typeof ColonyInvitationBanner> = {
  title: 'Common/Colony Invitation Banner',
  component: ColonyInvitationBanner,
  decorators: [(Story) => <Story />],
  argTypes: {
    inviteLink: {
      name: 'Invite link',
      control: {
        type: 'text',
      },
    },
    coloniesRemaining: {
      name: 'Colonies remaining',
      control: {
        type: 'number',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof ColonyInvitationBanner>;

export const Base: Story = {
  args: {
    inviteLink: 'app.colony.io/create-colony/1a1e20f2-c675-4698-892d...',
    coloniesRemaining: 5,
  },
};

export const NoRemaining: Story = {
  args: {
    inviteLink: 'app.colony.io/create-colony/1a1e20f2-c675-4698-892d...',
    coloniesRemaining: 0,
  },
};
