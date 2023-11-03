import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Breadcrumbs from '~v5/shared/Breadcrumbs';

const breadcrumbsMeta: Meta<typeof Breadcrumbs> = {
  title: 'Shared/Breadcrumbs',
  component: Breadcrumbs,
  decorators: [
    (StoryContent) => (
      <MemoryRouter>
        <Routes>
          <Route path="/*" element={<StoryContent />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
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
