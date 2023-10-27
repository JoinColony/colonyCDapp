import type { Meta, StoryObj } from '@storybook/react';
import { VoterRecord } from '~gql';
import UserAvatars from '~v5/shared/UserAvatars';

const items: VoterRecord[] = [
  {
    address: '0xD8Bb3F612902EaF1c858e5663d36081DDbD80C79',
    voteCount: '2',
  },
  {
    address: '0x37842D3196cDA643252B125def5D89a78C03b5b7',
    voteCount: '3',
  },
  {
    address: '0x7fDab0917F1E0A283afce9d9044F57dd15A9A9F5',
    voteCount: '1',
  },
];

const meta: Meta<typeof UserAvatars> = {
  title: 'Shared/User avatars',
  component: UserAvatars,
  args: {
    maxAvatarsToShow: 4,
    items,
  },
};

export default meta;
type Story = StoryObj<typeof UserAvatars>;

export const Base: Story = {};

export const DefinedAvatarNumbers: Story = {
  args: {
    maxAvatarsToShow: 2,
  },
};
