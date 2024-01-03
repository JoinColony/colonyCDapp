import NavigationSidebarLinksList from '~v5/frame/NavigationSidebar/partials/NavigationSidebarLinksList';

import type { Meta, StoryObj } from '@storybook/react';

const navigationSidebarLinksListMeta: Meta<typeof NavigationSidebarLinksList> =
  {
    title: 'Frame/Navigation Sidebar/Links List',
    component: NavigationSidebarLinksList,
    parameters: {
      layout: 'padded',
    },
    args: {
      items: [
        {
          key: '1',
          label: 'Members',
          to: '/members',
          iconName: 'users-three',
        },
        {
          key: '2',
          label: 'Verified members',
          to: '/verified-members',
          iconName: 'seal-check',
          tagProps: {
            text: 'New',
            mode: 'new',
          },
        },
        {
          key: '3',
          label: 'Teams',
          to: '/teams',
          iconName: 'users-four',
          disabled: true,
          tagProps: {
            text: 'Coming soon',
          },
        },
      ],
    },
  };

export default navigationSidebarLinksListMeta;

export const Base: StoryObj<typeof NavigationSidebarLinksList> = {};
