import type { Meta, StoryObj } from '@storybook/react';

import FilterButton from '~v5/shared/Filter/FilterButton';

const meta: Meta<typeof FilterButton> = {
  title: 'Shared/Buttons/FilterButton',
  component: FilterButton,
};

export default meta;
type Story = StoryObj<typeof FilterButton>;

export const Base: Story = {
  args: {
    numberSelectedFilters: 2,
  },
};
