import { type Meta, type StoryObj } from '@storybook/react';
import React from 'react';

import ColonyCardSkeleton from '~frame/LandingPage/ColonyCards/ColonyCardSkeleton.tsx';

const meta: Meta<typeof ColonyCardSkeleton> = {
  title: 'Common/Colony Card Skeleton',
  component: ColonyCardSkeleton,
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-[41.75rem]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ColonyCardSkeleton>;

export const Base: Story = {
  args: {
    invitationsRemaining: 2,
  },
};
