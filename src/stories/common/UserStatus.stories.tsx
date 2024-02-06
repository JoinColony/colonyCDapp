import {
  CrownSimple,
  HandHeart,
  Medal,
  ShootingStar,
} from '@phosphor-icons/react';
import { type Meta, type StoryObj } from '@storybook/react';

import UserStatus from '~v5/common/Pills/UserStatus/index.ts';

const meta: Meta<typeof UserStatus> = {
  title: 'Common/Pills/User Status',
  component: UserStatus,
  argTypes: {
    mode: {
      name: 'Mode',
      options: [
        'dedicated',
        'dedicated-filled',
        'active',
        'active-filled',
        'new',
        'active-new',
        'top',
        'top-filled',
        'banned',
        'team',
      ],
      control: {
        type: 'select',
      },
    },
    pillSize: {
      name: 'Size',
      options: ['medium', 'small'],
      control: {
        type: 'select',
      },
    },
    icon: {
      name: 'Icon',
      control: {
        type: 'object',
      },
    },
    text: {
      name: 'Text',
      control: {
        type: 'text',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof UserStatus>;

export const Dedicated: Story = {
  args: {
    mode: 'dedicated',
    icon: Medal,
    text: 'Dedicated',
    pillSize: 'medium',
  },
};

export const DedicatedFilled: Story = {
  args: {
    mode: 'dedicated-filled',
    icon: Medal,
    text: 'Dedicated',
    pillSize: 'medium',
  },
};

export const Active: Story = {
  args: {
    mode: 'active',
    icon: ShootingStar,
    text: 'Active',
    pillSize: 'medium',
  },
};

export const ActiveFilled: Story = {
  args: {
    mode: 'active-filled',
    icon: ShootingStar,
    text: 'Active',
    pillSize: 'medium',
  },
};

export const New: Story = {
  args: {
    mode: 'new',
    icon: HandHeart,
    text: 'New',
    pillSize: 'medium',
  },
};

export const ActiveNew: Story = {
  args: {
    mode: 'active-new',
    icon: HandHeart,
    text: 'Active',
    pillSize: 'medium',
  },
};

export const Top: Story = {
  args: {
    mode: 'top',
    icon: CrownSimple,
    text: 'Top',
    pillSize: 'medium',
  },
};

export const TopFilled: Story = {
  args: {
    mode: 'top-filled',
    icon: CrownSimple,
    text: 'Top',
    pillSize: 'medium',
  },
};

export const Banned: Story = {
  args: {
    mode: 'banned',
    text: 'Banned',
    pillSize: 'medium',
  },
};

export const Team: Story = {
  args: {
    mode: 'team',
    text: 'Team',
    pillSize: 'medium',
  },
};

export const DedicatedCrown: Story = {
  args: {
    mode: 'top',
    icon: CrownSimple,
    text: 'Dedicated',
    pillSize: 'medium',
  },
};
