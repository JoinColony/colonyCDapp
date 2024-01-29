import React from 'react';

import { images } from '~common/Extensions/ImageCarousel/consts.ts';
import ImageCarousel from '~common/Extensions/ImageCarousel/index.ts';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ImageCarousel> = {
  title: 'Common/Image Carousel',
  component: ImageCarousel,
  decorators: [
    (Story) => (
      <div className="max-w-[90rem] pb-7">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ImageCarousel>;

export const Base: Story = {
  args: {
    slideUrls: images,
  },
};
