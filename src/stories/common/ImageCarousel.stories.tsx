import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import ImageCarousel from '~common/Extensions/ImageCarousel/ImageCarousel';
import { images } from '~common/Extensions/ImageCarousel/consts';

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
