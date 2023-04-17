import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import TwoColumns from '~frame/TwoColumns';

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
      aside={<div className="bg-gray-300">Aside</div>}
      mainColumn={<div className="bg-gray-300">Main column</div>}
    />
  ),
};
