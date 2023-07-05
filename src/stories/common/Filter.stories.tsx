import type { Meta, StoryObj } from '@storybook/react';

import Filter from '~v5/common/Filter';

const meta: Meta<typeof Filter> = {
  title: 'Common/Filter',
  component: Filter,
};

export default meta;
type Story = StoryObj<typeof Filter>;

export const Base: Story = {};
