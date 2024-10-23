import { type Meta, type StoryObj } from '@storybook/react';
import React from 'react';

import ColonyCard from '~frame/LandingPage/ColonyCards/ColonyCard.tsx';

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
  },
};

export default meta;
type Story = StoryObj<typeof ColonyCard>;

export const Base: Story = {
  args: {
    colonyName: 'Beta colony',
    colonyAvatar: 'https://picsum.photos/200',
    membersCount: 1520,
  },
};
