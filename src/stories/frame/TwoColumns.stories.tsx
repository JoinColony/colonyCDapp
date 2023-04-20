import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import TwoColumns from '~frame/Extensions/TwoColumns';

const meta: Meta<typeof TwoColumns> = {
  title: 'Frame/Two Columns',
  component: TwoColumns,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="inner">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TwoColumns>;

export const Base: Story = {
  render: () => (
    <TwoColumns
      aside={
        <div className="bg-gray-300">
          Left Aside (navigation). The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy
          dog. The quick brown fox jumps over the lazy dog.
        </div>
      }
    >
      <div className="bg-gray-300">
        Main column: The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick
        brown fox jumps over the lazy dog.
      </div>
    </TwoColumns>
  ),
};
