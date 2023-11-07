import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import NavigationSidebarLink from '~v5/frame/NavigationSidebar/partials/NavigationSidebarLink';

const navigationSidebarLinkMeta: Meta<typeof NavigationSidebarLink> = {
  title: 'Frame/Navigation Sidebar/Link',
  component: NavigationSidebarLink,
  decorators: [
    (StoryContent) => (
      <MemoryRouter>
        <Routes>
          <Route path="/*" element={<StoryContent />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
  parameters: {
    layout: 'padded',
  },
  args: {
    iconName: 'user',
    to: '/test',
    children: 'Label',
  },
};

export default navigationSidebarLinkMeta;

export const Base: StoryObj<typeof NavigationSidebarLink> = {};

export const WithTag: StoryObj<typeof NavigationSidebarLink> = {
  args: {
    tagProps: {
      text: 'New',
      mode: 'new',
    },
  },
};
