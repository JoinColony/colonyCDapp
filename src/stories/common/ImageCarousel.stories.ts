import type { Meta, StoryObj } from '@storybook/react';
import ImageCarousel from '~common/Extensions/ImageCarousel/ImageCarousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { images } from '~common/Extensions/ImageCarousel/const';

const meta: Meta<typeof ImageCarousel> = {
  title: 'Common/Image Carousel',
  component: ImageCarousel,
};

export default meta;
type Story = StoryObj<typeof ImageCarousel>;

export const Base: Story = {
  args: {
    slideUrls: images,
  },
};
