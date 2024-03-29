import { MotionState } from '~utils/colonyMotions.ts';
import MotionStateBadge from '~v5/common/Pills/MotionStateBadge/MotionStateBadge.tsx';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof MotionStateBadge> = {
  title: 'Common/Pills/Motion State Badge',
  component: MotionStateBadge,
  argTypes: {
    state: {
      name: 'State',
      options: Object.values(MotionState),
      control: {
        type: 'select',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof MotionStateBadge>;

export const Base: Story = {
  args: {
    state: MotionState.Draft,
  },
};
