import type { Meta, StoryObj } from '@storybook/react';
import SupportingDocuments from '~common/Extensions/SupportingDocuments';

const meta: Meta<typeof SupportingDocuments> = {
  title: 'Supporting Documents list',
  component: SupportingDocuments,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SupportingDocuments>;

export const Primary: Story = {};
