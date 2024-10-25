import { type Meta, type StoryObj } from '@storybook/react';
import React from 'react';

import ColonyCard from '~frame/LandingPage/ColonyCards/ColonyCard.tsx';
import SkeletonCard from '~frame/LandingPage/ColonyCards/ColonyCardSkeleton.tsx';
import CreateNewColonyCard from '~frame/LandingPage/ColonyCards/CreateNewColonyCard.tsx';

const meta: Meta<typeof ColonyCard | typeof CreateNewColonyCard> = {
  title: 'Common/Colony Card',
  component: ColonyCard,
  decorators: (Story) => (
    <div className="ml-auto mr-auto max-w-[31.25rem]">
      <Story />
    </div>
  ),
  args: {
    colonyAvatar: 'https://picsum.photos/200',
    colonyName: 'Beta colony',
    membersCount: 1512,
    invitationsRemaining: 4,
    onCreate: () => {},
  },
};

export default meta;
type ColonyCardStory = StoryObj<
  typeof ColonyCard | typeof SkeletonCard | typeof CreateNewColonyCard
>;

export const Base: ColonyCardStory = {
  render: (args) => <ColonyCard {...args} />,
};

export const Loading: ColonyCardStory = {
  render: () => <SkeletonCard />,
};

export const CreateNewColony: ColonyCardStory = {
  render: (args) => <CreateNewColonyCard {...args} />,
};
