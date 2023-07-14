import type { Meta, StoryObj } from '@storybook/react';

import TableFiltering from '~v5/common/TableFiltering';

const meta: Meta<typeof TableFiltering> = {
  title: 'Common/Table Filtering',
  component: TableFiltering,
};

export default meta;
type Story = StoryObj<typeof TableFiltering>;

export const SingleFilterOption: Story = {
  args: {
    // @ts-ignore
    filterType: 'status',
    filterOptions: ['banned'],
  },
};

export const WithFilterArrayOptions: Story = {
  args: {
    // @ts-ignore
    filterType: 'team',
    filterOptions: ['administration', 'dedicated'],
    // @ts-ignore
    onClick: () => alert('Close'),
  },
};
