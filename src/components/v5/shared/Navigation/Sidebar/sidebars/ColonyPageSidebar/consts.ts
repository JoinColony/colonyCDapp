import {
  AddressBook,
  ClockCountdown,
  FileText,
  GearSix,
  Layout,
  PresentationChart,
  UsersThree,
  UserSwitch,
} from '@phosphor-icons/react';
import { type Variants } from 'framer-motion';

import {
  COLONY_ACTIVITY_ROUTE,
  COLONY_AGREEMENTS_ROUTE,
  COLONY_BALANCES_ROUTE,
  COLONY_MEMBERS_ROUTE,
  COLONY_EXTENSIONS_ROUTE,
  COLONY_INCOMING_ROUTE,
  COLONY_PERMISSIONS_ROUTE,
  COLONY_TEAMS_ROUTE,
} from '~routes';
import { type SidebarRouteItemProps } from '~v5/shared/Navigation/Sidebar/partials/SidebarRouteItem/types.ts';

export const sidebarNavigationScheme: SidebarRouteItemProps[] = [
  {
    icon: Layout,
    translation: { id: 'navigation.dashboard' },
    path: '',
    isColonyRoute: true,
  },
  {
    icon: ClockCountdown,
    translation: { id: 'teamsPage.links.activity' },
    path: COLONY_ACTIVITY_ROUTE,
    isColonyRoute: true,
  },
  {
    icon: PresentationChart,
    translation: { id: 'navigation.finances' },
    path: COLONY_BALANCES_ROUTE,
    isColonyRoute: true,
    subItems: [
      {
        translation: { id: 'navigation.finances.balances' },
        path: COLONY_BALANCES_ROUTE,
        isColonyRoute: true,
      },
      {
        translation: { id: 'navigation.finances.incoming' },
        path: COLONY_INCOMING_ROUTE,
        isColonyRoute: true,
      },
      // @TODO: Uncomment once these pages are available
      // {
      //   id: 'streaming',
      //   translation: { id: 'navigation.finances.streaming' },
      //   path: COLONY_STREAMING_ROUTE,
      // },
      // {
      //   id: 'crypto-to-fiat',
      //   translation: { id: 'userCryptoToFiatPage.title' },
      //   path: `account/${USER_CRYPTO_TO_FIAT_ROUTE}`,
      // },
    ],
  },
  {
    icon: UsersThree,
    translation: { id: 'navigation.members.teams' },
    path: COLONY_TEAMS_ROUTE,
    isColonyRoute: true,
  },
  {
    icon: FileText,
    translation: { id: 'navigation.agreements' },
    path: COLONY_AGREEMENTS_ROUTE,
    isColonyRoute: true,
  },
  {
    icon: AddressBook,
    translation: { id: 'navigation.members' },
    path: COLONY_MEMBERS_ROUTE,
    isColonyRoute: true,
  },
  {
    icon: UserSwitch,
    translation: { id: 'navigation.members.permissions' },
    path: COLONY_PERMISSIONS_ROUTE,
    isColonyRoute: true,
  },
  {
    icon: GearSix,
    translation: { id: 'navigation.admin.extensions' },
    path: COLONY_EXTENSIONS_ROUTE,
    isColonyRoute: true,
  },
];

export const motionVariants: Variants = {
  hidden: {
    x: '-100%',
  },
  visible: {
    x: 0,
  },
};
