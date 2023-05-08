import type { Meta, StoryObj } from '@storybook/react';
import MainNavigation from '~common/Extensions/MainNavigation/MainNavigation';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const meta: Meta<typeof MainNavigation> = {
  title: 'Common/Main Navigation',
  component: MainNavigation,
};

export default meta;
type Story = StoryObj<typeof MainNavigation>;

export const Base: Story = {};
