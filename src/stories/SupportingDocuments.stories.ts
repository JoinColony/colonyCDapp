import type { Meta, StoryObj } from '@storybook/react';
import SupportingDocuments from '~common/Extensions/SupportingDocuments';

const meta: Meta<typeof SupportingDocuments> = {
  title: 'Supporting Documents list',
  component: SupportingDocuments,
};

export default meta;
type Story = StoryObj<typeof SupportingDocuments>;

export const Primary: Story = {
  args: {
    isDoubleLinkVisible: false,
  },
};

export const Secondary: Story = {
  args: {
    isDoubleLinkVisible: true,
  },
};
