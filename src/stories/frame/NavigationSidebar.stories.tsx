import {
  Bank,
  Bird,
  GearSix,
  Handshake,
  Layout,
  Plus,
  SealCheck,
  User,
  UsersFour,
  UsersThree,
} from '@phosphor-icons/react';
import { type Meta, type StoryObj } from '@storybook/react';
import React from 'react';

import { ADDRESS_ZERO } from '~constants/index.ts';
import NavigationSidebar from '~v5/frame/NavigationSidebar/index.ts';

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
        size: 24,
        chainIcon: Bird,
        colonyAddress: ADDRESS_ZERO,
      },
      content: {
        title: 'Select a Colony',
        content: <p>colony</p>,
        bottomActionProps: {
          text: 'Create new colony',
          icon: Plus,
        },
      },
    },
    mainMenuItems: [
      {
        key: '1',
        icon: Layout,
        label: 'Dashboard',
        secondLevelMenuProps: {
          title: 'Dashboard',
          content: <p>content</p>,
          description:
            'The Metacolony is the DAO that will build, maintain, and support the Colony ecosystem, and you can be part of it.',
          bottomActionProps: {
            text: 'Create new action',
            icon: Plus,
          },
        },
      },
      {
        key: '2',
        icon: User,
        label: 'Members',
        secondLevelMenuProps: {
          title: 'Members',
          content: [
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
        icon: Bank,
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
        icon: Handshake,
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
        icon: GearSix,
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
