import {
  ArrowDownRight,
  ChartBar,
  ChatsCircle,
  HandHeart,
  Layout,
  PresentationChart,
  PuzzlePiece,
  UsersFour,
  UsersThree,
  Signature,
  // @BETA: Disabled for now
  // SealCheck,
  // ChartPieSlice,
  // ListChecks,
  // ChartLine,
  // Intersect,
  // Briefcase,
  // BookOpenText,
} from '@phosphor-icons/react';

import {
  COLONY_ACTIVITY_ROUTE,
  COLONY_AGREEMENTS_ROUTE,
  COLONY_BALANCES_ROUTE,
  COLONY_MEMBERS_ROUTE,
  COLONY_EXTENSIONS_ROUTE,
  COLONY_INCOMING_ROUTE,
  COLONY_FOLLOWERS_ROUTE,
  // @BETA: Disabled for now
  // COLONY_INCORPORATION_ROUTE,
  // COLONY_INTEGRATIONS_ROUTE,
  COLONY_PERMISSIONS_ROUTE,
  // COLONY_REPUTATION_ROUTE,
  COLONY_TEAMS_ROUTE,
  // COLONY_VERIFIED_ROUTE,
} from '~routes/routeConstants.ts';
import { formatText } from '~utils/intl.ts';
import { type NavigationSidebarLinksListProps } from '~v5/frame/NavigationSidebar/partials/NavigationSidebarLinksList/types.ts';

export const membersMenu: NavigationSidebarLinksListProps['items'] = [
  {
    key: '1',
    label: formatText({ id: 'navigation.members.members' }),
    to: COLONY_FOLLOWERS_ROUTE,
    icon: UsersThree,
  },
  {
    key: '2',
    label: formatText({ id: 'navigation.members.contributors' }) || '',
    to: COLONY_MEMBERS_ROUTE,
    icon: HandHeart,
  },
  // @BETA: Disabled for now
  // {
  //   key: '3',
  //   label: formatText({ id: 'navigation.members.verifiedMembers' }),
  //   to: COLONY_VERIFIED_ROUTE,
  //   icon: SealCheck,
  // },
  {
    key: '4',
    label: formatText({ id: 'navigation.members.permissions' }),
    to: COLONY_PERMISSIONS_ROUTE,
    icon: Signature,
  },
  {
    key: '5',
    label: formatText({ id: 'navigation.members.teams' }),
    to: COLONY_TEAMS_ROUTE,
    icon: UsersFour,
  },
];

// @todo: update routes when pages will be ready
export const financesMenu: NavigationSidebarLinksListProps['items'] = [
  // @BETA: Disabled for now
  // {
  //   key: '1',
  //   label: formatText({ id: 'navigation.finances.overview' }),
  //   to: '/overview',
  //   icon: ChartPieSlice,
  //   tagProps: {
  //     text: 'New',
  //     mode: 'new',
  //   },
  // },
  {
    key: '2',
    label: formatText({ id: 'navigation.finances.balance' }),
    to: COLONY_BALANCES_ROUTE,
    icon: ChartBar,
  },
  {
    key: '3',
    label: formatText({ id: 'navigation.finances.incomingFunds' }),
    to: COLONY_INCOMING_ROUTE,
    icon: ArrowDownRight,
  },
  // @BETA: Disabled for now
  // {
  //   key: '4',
  //   label: formatText({ id: 'navigation.finances.transactions' }),
  //   to: '/transactions',
  //   icon: ListChecks,
  //   disabled: true,
  //   tagProps: {
  //     text: 'Coming soon',
  //   },
  // },
  // {
  //   key: '5',
  //   label: formatText({ id: 'navigation.finances.streamingPayments' }),
  //   to: '/streaming-payments',
  //   icon: ChartLine
  // },
];

// @todo: update routes when pages will be ready
export const agreementsMenu: NavigationSidebarLinksListProps['items'] = [
  {
    key: '1',
    label: formatText({ id: 'navigation.agreements.allAgreements' }),
    to: COLONY_AGREEMENTS_ROUTE,
    icon: ChatsCircle,
    tagProps: {
      text: formatText({ id: 'status.new' }),
      mode: 'new',
    },
  },
];

export const adminMenu: NavigationSidebarLinksListProps['items'] = [
  // @BETA: Disabled for now
  // {
  //   key: '2',
  //   label: formatText({ id: 'navigation.admin.reputation' }),
  //   to: COLONY_REPUTATION_ROUTE,
  //   icon: Star,
  // },
  {
    key: '3',
    label: formatText({ id: 'navigation.admin.extensions' }),
    to: COLONY_EXTENSIONS_ROUTE,
    icon: PuzzlePiece,
  },
  // @BETA: Disabled for now
  // {
  //   key: '4',
  //   label: formatText({ id: 'navigation.admin.integrations' }),
  //   to: COLONY_INTEGRATIONS_ROUTE,
  //   icon: Intersect,
  // },
  // {
  //   key: '5',
  //   label: formatText({ id: 'navigation.admin.incorporation' }),
  //   to: COLONY_INCORPORATION_ROUTE,
  //   icon: Briefcase,
  //   disabled: true,
  //   tagProps: {
  //     text: formatText({ id: 'extension.status.coming-soon' }),
  //   },
  // },
];

// @todo: update routes when pages will be ready
export const dashboardMainMenu: NavigationSidebarLinksListProps['items'] = [
  {
    key: '1',
    label: formatText({ id: 'navigation.dashboard.dashboard' }),
    to: '',
    icon: Layout,
  },
];

// @todo: update routes when pages will be ready
export const dashboardMenu: NavigationSidebarLinksListProps['items'] = [
  {
    key: '1',
    label: formatText({ id: 'navigation.dashboard.activityFeed' }),
    to: COLONY_ACTIVITY_ROUTE,
    icon: PresentationChart,
  },
];
