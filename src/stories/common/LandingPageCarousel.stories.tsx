import { type Meta, type StoryObj } from '@storybook/react';
import React from 'react';

import LandingPageCarousel from '~frame/LandingPage/partials/LandingPageCarousel/LandingPageCarousel.tsx';

const meta: Meta<typeof LandingPageCarousel> = {
  title: 'Common/Landing Page Carousel',
  component: LandingPageCarousel,
  decorators: [
    (Story) => (
      <div className="flex w-full justify-center">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof LandingPageCarousel>;

export const Base: Story = {};
