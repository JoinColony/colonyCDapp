import { type Meta, type StoryObj } from '@storybook/react';
import React from 'react';

import ActionSidebarContent from '~v5/common/ActionSidebar/partials/ActionSidebarContent/ActionSidebarContent.tsx';

const actionSidebarMeta: Meta<typeof ActionSidebarContent> = {
  title: 'Action Sidebar',
  component: ActionSidebarContent,
};

export default actionSidebarMeta;

export const Base: StoryObj<typeof ActionSidebarContent> = {
  render: (args) => <ActionSidebarContent {...args} />,
};
