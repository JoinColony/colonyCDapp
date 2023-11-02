import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import PageHeader from '~v5/frame/PageLayout/partials/PageHeader';

const pageHeaderMeta: Meta<typeof PageHeader> = {
  title: 'Frame/Page Header',
  component: PageHeader,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (StoryContent) => (
      <MemoryRouter>
        <Routes>
          <Route path="/*" element={<StoryContent />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
};

export default pageHeaderMeta;

export const Base: StoryObj<typeof PageHeader> = {};
