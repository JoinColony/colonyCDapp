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

import {
  COLONY_ACTIVITY_ROUTE,
  COLONY_AGREEMENTS_ROUTE,
  COLONY_BALANCES_ROUTE,
  COLONY_EXTENSIONS_ROUTE,
  COLONY_INCOMING_ROUTE,
  COLONY_MEMBERS_ROUTE,
  COLONY_PERMISSIONS_ROUTE,
  COLONY_TEAMS_ROUTE,
  USER_CRYPTO_TO_FIAT_ROUTE,
} from '~routes';

import { type RouteSectionItemProps } from './partials/RouteSectionItem/types.ts';

export const sidebarNavigationScheme: RouteSectionItemProps[] = [
  {
    id: 'dashboard',
    icon: Layout,
    translation: { id: 'navigation.dashboard' },
    path: '/',
    routeType: 'colony',
  },
  {
    id: 'activity',
    icon: ClockCountdown,
    translation: { id: 'navigation.dashboard.activityFeed' },
    path: COLONY_ACTIVITY_ROUTE,
    routeType: 'colony',
  },
  {
    id: 'finances',
    icon: PresentationChart,
    translation: { id: 'navigation.finances' },
    subItems: [
      {
        id: 'balances',
        translation: { id: 'navigation.finances.balances' },
        path: COLONY_BALANCES_ROUTE,
        routeType: 'colony',
      },
      {
        id: 'incoming',
        translation: { id: 'navigation.finances.incoming' },
        path: COLONY_INCOMING_ROUTE,
        routeType: 'colony',
      },
      {
        id: 'streaming',
        translation: { id: 'navigation.finances.streaming' },
        path: COLONY_INCOMING_ROUTE,
        routeType: 'colony',
      },
      {
        id: 'crypto-to-fiat',
        translation: { id: 'userCryptoToFiatPage.title' },
        path: `account/${USER_CRYPTO_TO_FIAT_ROUTE}`,
        routeType: 'account',
      },
    ],
  },
  {
    id: 'teams',
    icon: UsersThree,
    translation: { id: 'navigation.members.teams' },
    path: COLONY_TEAMS_ROUTE,
    routeType: 'colony',
  },
  {
    id: 'agreements',
    icon: FileText,
    translation: { id: 'navigation.agreements' },
    path: COLONY_AGREEMENTS_ROUTE,
    routeType: 'colony',
  },
  {
    id: 'members',
    icon: AddressBook,
    translation: { id: 'navigation.members' },
    path: COLONY_MEMBERS_ROUTE,
    routeType: 'colony',
  },
  {
    id: 'permissions',
    icon: UserSwitch,
    translation: { id: 'navigation.members.permissions' },
    path: COLONY_PERMISSIONS_ROUTE,
    routeType: 'colony',
  },
  {
    id: 'extensions',
    icon: GearSix,
    translation: { id: 'navigation.admin.extensions' },
    path: COLONY_EXTENSIONS_ROUTE,
    routeType: 'colony',
  },
];
