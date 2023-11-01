import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import NavigationSidebar from '~v5/frame/NavigationSidebar';

const navigationSidebarMeta: Meta<typeof NavigationSidebar> = {
  title: 'Frame/Navigation Sidebar',
  component: NavigationSidebar,
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
    layout: 'fullscreen',
  },
};

export default navigationSidebarMeta;

export const Base: StoryObj<typeof NavigationSidebar> = {};
