import type { Meta, StoryObj } from '@storybook/react';
import ImageCarousel from '~common/Extensions/ImageCarousel/ImageCarousel';

const meta: Meta<typeof ImageCarousel> = {
  title: 'Common/Image Carousel',
  component: ImageCarousel,
};

export default meta;
type Story = StoryObj<typeof ImageCarousel>;

export const Base: Story = {
  args: {
    isDoubleLinkVisible: false,
  },
};
