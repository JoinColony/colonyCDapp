import type { Meta, StoryObj } from '@storybook/react';
import TableFiltering from '~common/Extensions/TableFiltering/TableFiltering';

const meta: Meta<typeof TableFiltering> = {
  title: 'Common/Table Filtering',
  component: TableFiltering,
};

export default meta;
type Story = StoryObj<typeof TableFiltering>;

export const SingleFilterOption: Story = {
  args: {
    filterType: 'statuses',
    filterOptions: ['banned'],
  },
};

export const WithFilterArrayOptions: Story = {
  args: {
    filterType: 'team',
    filterOptions: ['administration', 'dedicated'],
  },
};
