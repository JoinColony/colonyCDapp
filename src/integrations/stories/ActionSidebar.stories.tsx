import { type Meta, type StoryObj } from '@storybook/react';
import React from 'react';

import CreateActionSidebar from '~v5/common/ActionSidebar/partials/CreateAction/CreateActionSidebar.tsx';

const actionSidebarMeta: Meta<typeof CreateActionSidebar> = {
  title: 'Action Sidebar',
  component: CreateActionSidebar,
};

export default actionSidebarMeta;

export const Base: StoryObj<typeof CreateActionSidebar> = {
  render: (args) => <CreateActionSidebar {...args} />,
};
