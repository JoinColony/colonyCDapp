import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import ThreeColumns from '~frame/Extensions/ThreeColumns';

const meta: Meta<typeof ThreeColumns> = {
  title: 'Frame/Three Columns',
  component: ThreeColumns,
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
type Story = StoryObj<typeof ThreeColumns>;

export const Base: Story = {
  render: () => (
    <ThreeColumns
      leftAside={
        <div className="bg-gray-300 h-full">
          This is the left aside (navigation). The quick brown fox jumps over the lazy dog. The quick brown fox jumps
          over the lazy dog. The quick brown fox jumps over the lazy dog.
        </div>
      }
      topRow={<div className="bg-gray-300">Top row with the title and action</div>}
      rightAside={
        <div className="bg-gray-300">
          Right aside: Extensions details. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over
          the lazy dog. The quick brown fox jumps over the lazy dog.
        </div>
      }
    >
      <div className="bg-gray-300">
        Main column: The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick
        brown fox jumps over the lazy dog.
      </div>
    </ThreeColumns>
  ),
};

export const WithSlider: Story = {
  render: () => (
    <ThreeColumns
      leftAside={
        <div className="bg-gray-300 h-full">
          This is the left aside (navigation). The quick brown fox jumps over the lazy dog. The quick brown fox jumps
          over the lazy dog. The quick brown fox jumps over the lazy dog.
        </div>
      }
      topRow={<div className="bg-gray-300">Top row with the title and action</div>}
      withSlider={<div className="bg-gray-300">Slider</div>}
      rightAside={
        <div className="bg-gray-300">
          Right aside: Extensions details. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over
          the lazy dog. The quick brown fox jumps over the lazy dog.
        </div>
      }
    >
      <div className="bg-gray-300">
        Main column: The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick
        brown fox jumps over the lazy dog.
      </div>
    </ThreeColumns>
  ),
};
