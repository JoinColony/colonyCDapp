import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import NavigationSidebar from '~v5/frame/NavigationSidebar';

const navigationSidebarMeta: Meta<typeof NavigationSidebar> = {
  title: 'Frame/Navigation Sidebar',
  component: NavigationSidebar,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    additionalMobileContent: <p>mobile content</p>,
    mobileBottomContent: <p>mobile bottom content</p>,
    hamburgerLabel: 'Menu',
    colonySwitcherProps: {
      avatarProps: {
        chainIconName: 'gnosis',
      },
      content: {
        title: 'Select a Colony',
        content: <p>colony</p>,
        bottomActionProps: {
          text: 'Create new colony',
          iconName: 'plus',
        },
      },
    },
    mainMenuItems: [
      {
        key: '1',
        iconName: 'layout',
        label: 'Dashboard',
        secondLevelMenuProps: {
          title: 'Dashboard',
          content: <p>content</p>,
          description:
            'The Metacolony is the DAO that will build, maintain, and support the Colony ecosystem, and you can be part of it.',
          bottomActionProps: {
            text: 'Create new action',
            iconName: 'plus',
          },
        },
      },
      {
        key: '2',
        iconName: 'user',
        label: 'Members',
        secondLevelMenuProps: {
          title: 'Members',
          content: [
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
          description: 'View and manage all members of the Colony.',
        },
        relatedActionsProps: {
          title: 'Related actions',
          items: [
            {
              key: '1',
              label: 'Members 1',
              href: '/',
            },
            {
              key: '2',
              label: 'Members 2',
            },
          ],
        },
      },
      {
        key: '3',
        iconName: 'bank',
        label: 'Finances',
        secondLevelMenuProps: {
          title: 'Finances',
          content: <p>content</p>,
          description: 'View and manage all members of the Colony.',
        },
        relatedActionsProps: {
          title: 'Related actions',
          items: [
            {
              key: '1',
              label: 'Finances 1',
              href: '/',
            },
            {
              key: '2',
              label: 'Finances 2',
            },
          ],
        },
      },
      {
        key: '4',
        iconName: 'handshake',
        label: 'Agreements',
        secondLevelMenuProps: {
          title: 'Agreements',
          content: <p>content</p>,
          description: 'View and manage all members of the Colony.',
        },
        relatedActionsProps: {
          title: 'Related actions',
          items: [
            {
              key: '1',
              label: 'Agreements 1',
              href: '/',
            },
            {
              key: '2',
              label: 'Agreements 2',
            },
          ],
        },
      },
      {
        key: '5',
        iconName: 'gear-six',
        label: 'Admin',
        secondLevelMenuProps: {
          title: 'Admin',
          content: <p>content</p>,
          description: 'View and manage all members of the Colony.',
        },
        relatedActionsProps: {
          title: 'Related actions',
          items: [
            {
              key: '1',
              label: 'Admin 1',
              href: '/',
            },
            {
              key: '2',
              label: 'Admin 2',
            },
          ],
        },
      },
    ],
  },
};

export default navigationSidebarMeta;

export const Base: StoryObj<typeof NavigationSidebar> = {};
