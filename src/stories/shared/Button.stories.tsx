import type { Meta, StoryObj } from '@storybook/react';
import Button from '~shared/Extensions/Button';

const meta: Meta<typeof Button> = {
  title: 'Shared/Button',
  component: Button,
  argTypes: {
    mode: {
      name: 'Mode',
      options: ['primarySolid', 'primaryOutline', 'secondarySolid', 'textButton', 'pending'],
      control: {
        type: 'select',
      },
    },
    text: {
      name: 'Text',
      control: {
        type: 'text',
      },
    },
    disabled: {
      name: 'Disabled',
      control: {
        type: 'boolean',
      },
    },
    isFullSize: {
      name: 'Is full size?',
      control: {
        type: 'boolean',
      },
    },
    isFullRounded: {
      name: 'Is full rounded?',
      control: {
        type: 'boolean',
      },
    },
  },
  args: {
    text: 'New action',
    disabled: false,
    isFullSize: false,
    isPending: false,
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const PrimarySolid: Story = {
  args: {
    mode: 'primarySolid',
  },
};

export const PrimaryOutline: Story = {
  args: {
    mode: 'primaryOutline',
  },
};

export const SecondarySolid: Story = {
  args: {
    mode: 'secondarySolid',
  },
};

export const TertiaryOutline: Story = {
  args: {
    mode: 'tertiaryOutline',
  },
};

export const QuaternaryOutline: Story = {
  args: {
    mode: 'quaternaryOutline',
  },
};

export const TextButton: Story = {
  args: {
    mode: 'textButton',
  },
};

export const Pending: Story = {
  args: {
    mode: 'pending',
    isPending: true,
  },
};
