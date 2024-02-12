import { SealCheck, UsersFour, UsersThree } from '@phosphor-icons/react';
import { type Meta, type StoryObj } from '@storybook/react';

import NavigationSidebarLinksList from '~v5/frame/NavigationSidebar/partials/NavigationSidebarLinksList/index.ts';

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
          icon: UsersThree,
        },
        {
          key: '2',
          label: 'Verified members',
          to: '/verified-members',
          icon: SealCheck,
          tagProps: {
            text: 'New',
            mode: 'new',
          },
        },
        {
          key: '3',
          label: 'Teams',
          to: '/teams',
          icon: UsersFour,
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
