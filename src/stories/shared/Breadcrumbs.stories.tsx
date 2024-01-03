import Breadcrumbs from '~v5/shared/Breadcrumbs';

import type { Meta, StoryObj } from '@storybook/react';

const breadcrumbsMeta: Meta<typeof Breadcrumbs> = {
  title: 'Shared/Breadcrumbs',
  component: Breadcrumbs,
  args: {
    items: [
      {
        key: '1',
        label: 'Metacolony',
        href: '/',
      },
      {
        key: '2',
        dropdownOptions: [
          {
            label: 'All teams',
            href: '/all-teams',
          },
        ],
        selectedValue: '/all-teams',
      },
    ],
  },
};

export default breadcrumbsMeta;

export const Base: StoryObj<typeof Breadcrumbs> = {};
