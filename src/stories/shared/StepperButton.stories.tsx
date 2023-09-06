import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import StepperButton from '~v5/shared/Stepper/partials/StepperButton';

const meta: Meta<typeof StepperButton> = {
  title: 'Shared/Stepper/Button',
  component: StepperButton,
  argTypes: {
    label: {
      name: 'Label',
      control: {
        type: 'text',
      },
    },
    stage: {
      name: 'Stage',
      options: ['completed', 'current', 'upcoming'],
      control: {
        type: 'radio',
      },
    },
    disabled: {
      name: 'Disabled',
      control: {
        type: 'boolean',
      },
    },
    isHighlighted: {
      name: 'Highlighted',
      control: {
        type: 'boolean',
      },
    },
  },
  args: {
    stage: 'upcoming',
    disabled: false,
    isHighlighted: false,
    label: 'Label',
  },
};

export default meta;

export const Upcoming: StoryObj<typeof StepperButton> = {
  render: (args) => <StepperButton {...args} />,
};

export const Current: StoryObj<typeof StepperButton> = {
  args: {
    stage: 'current',
  },
};

export const Completed: StoryObj<typeof StepperButton> = {
  args: {
    stage: 'completed',
  },
};

export const Skipped: StoryObj<typeof StepperButton> = {
  args: {
    stage: 'skipped',
  },
};

export const Highlighted: StoryObj<typeof StepperButton> = {
  args: {
    isHighlighted: true,
  },
};

export const WithIcon: StoryObj<typeof StepperButton> = {
  args: {
    iconName: 'check',
  },
};

export const WithTooltip: StoryObj<typeof StepperButton> = {
  args: {
    tooltipProps: {
      tooltipContent: 'Tooltip content',
    },
  },
};
