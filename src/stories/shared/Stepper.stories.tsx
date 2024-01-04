import React from 'react';

import Stepper from '~v5/shared/Stepper';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Stepper> = {
  title: 'Shared/Stepper',
  component: Stepper,
  args: {
    items: [
      {
        key: '1',
        heading: {
          label: 'Step 1',
          tooltipProps: {
            tooltipContent: 'tooltip content',
          },
        },
        content: <p>step 1 content</p>,
      },
      {
        key: '2',
        heading: {
          label: 'Step 2',
        },
        content: <p>step 2 content</p>,
        isOptional: true,
      },
      {
        key: '3',
        heading: {
          label: 'Step 3',
        },
        content: <p>step 3 content</p>,
      },
      {
        key: '4',
        heading: {
          label: 'Step 4',
        },
        content: <p>step 4 content</p>,
        isSkipped: true,
      },
    ],
    activeStepKey: '1',
  },
};

export default meta;

export const Base: StoryObj<typeof Stepper> = {
  render: (args) => <Stepper {...args} />,
};

export const WithArrowsNavigation: StoryObj<typeof Stepper> = {
  args: {
    items: [
      {
        key: '1',
        heading: {
          label: 'Step 1',
          tooltipProps: {
            tooltipContent: 'tooltip content',
          },
        },
        content: <p>step 1 content</p>,
      },
      {
        key: '2',
        heading: {
          label: 'Step 2',
          decor: <p>decor</p>,
        },
        content: <p>step 2 content</p>,
        isOptional: true,
      },
      {
        key: '3',
        heading: {
          label: 'Step 3',
        },
        content: <p>step 3 content</p>,
      },
      {
        key: '4',
        heading: {
          label: 'Step 4',
        },
        content: <p>step 4 content</p>,
        isSkipped: true,
      },
      {
        key: '5',
        heading: {
          label: 'Step 5',
        },
        content: <p>step 5 content</p>,
      },
    ],
  },
};
