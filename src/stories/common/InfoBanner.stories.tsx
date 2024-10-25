import { Password, Confetti, Keyhole } from '@phosphor-icons/react';
import { type Meta, type StoryObj } from '@storybook/react';
import React from 'react';

import InfoBanner from '~frame/LandingPage/InfoBanner/InfoBanner.tsx';

const meta: Meta<typeof InfoBanner> = {
  title: 'Common/Info Banner',
  component: InfoBanner,
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-[41.75rem]">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    title: {
      name: 'Title',
      control: {
        type: 'text',
      },
    },
    text: {
      name: 'Text',
      control: {
        type: 'text',
      },
    },
    variant: {
      name: 'Variant',
      control: {
        type: 'text',
      },
    },
    loading: {
      name: 'Loading',
      control: {
        type: 'text',
      },
    },
    icon: {
      name: 'Icon',
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof InfoBanner>;

export const Info: Story = {
  args: {
    title: 'Title of info banner',
    text: 'Text of info banner',
    variant: 'info',
    icon: Keyhole,
  },
};

export const Success: Story = {
  args: {
    title: 'Title of success banner',
    text: 'Text of success banner',
    variant: 'success',
    icon: Confetti,
  },
};

export const Error: Story = {
  args: {
    title: 'Title of error banner',
    text: 'Text of error banner',
    variant: 'error',
    icon: Password,
  },
};

export const Loading: Story = {
  args: {
    title: 'Title of loading banner',
    text: 'Text of loading banner',
    loading: true,
  },
};
