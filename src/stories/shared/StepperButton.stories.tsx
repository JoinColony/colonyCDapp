import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import StepperButton from '~v5/shared/Stepper/partials/StepperButton';
import { STEP_STAGE } from '~v5/shared/Stepper/partials/StepperButton/consts';

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
      options: [
        STEP_STAGE.Completed,
        STEP_STAGE.Current,
        STEP_STAGE.Upcoming,
        STEP_STAGE.Skipped,
      ],
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
    stage: STEP_STAGE.Upcoming,
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
    stage: STEP_STAGE.Current,
  },
};

export const Completed: StoryObj<typeof StepperButton> = {
  args: {
    stage: STEP_STAGE.Completed,
  },
};

export const Skipped: StoryObj<typeof StepperButton> = {
  args: {
    stage: STEP_STAGE.Skipped,
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
