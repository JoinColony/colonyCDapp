import { type Meta, type StoryObj } from '@storybook/react';
import React from 'react';

import CreateAction from '~v5/common/ActionSidebar/partials/CreateAction/CreateAction.tsx';

const actionSidebarMeta: Meta<typeof CreateAction> = {
  title: 'Action Sidebar',
  component: CreateAction,
};

export default actionSidebarMeta;

export const Base: StoryObj<typeof CreateAction> = {
  render: (args) => <CreateAction {...args} />,
};
