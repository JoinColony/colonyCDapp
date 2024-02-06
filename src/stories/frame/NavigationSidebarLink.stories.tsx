import { User } from '@phosphor-icons/react';
import { type Meta, type StoryObj } from '@storybook/react';

import NavigationSidebarLink from '~v5/frame/NavigationSidebar/partials/NavigationSidebarLink/index.ts';

const navigationSidebarLinkMeta: Meta<typeof NavigationSidebarLink> = {
  title: 'Frame/Navigation Sidebar/Link',
  component: NavigationSidebarLink,
  parameters: {
    layout: 'padded',
  },
  args: {
    icon: User,
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
