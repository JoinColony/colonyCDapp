import {
  COLONY_ACTIVITY_ROUTE,
  COLONY_ADVANCED_ROUTE,
  COLONY_AGREEMENTS_ROUTE,
  COLONY_BALANCES_ROUTE,
  COLONY_CONTRIBUTORS_ROUTE,
  COLONY_DETAILS_ROUTE,
  COLONY_EXTENSIONS_ROUTE,
  COLONY_INCOMING_ROUTE,
  COLONY_MEMBERS_ROUTE,
  // @BETA: Disabled for now
  // COLONY_INCORPORATION_ROUTE,
  // COLONY_INTEGRATIONS_ROUTE,
  // COLONY_PERMISSIONS_ROUTE,
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
    to: COLONY_MEMBERS_ROUTE,
    iconName: 'users-three',
  },
  {
    key: '2',
    label: formatText({ id: 'navigation.members.contributors' }) || '',
    to: COLONY_CONTRIBUTORS_ROUTE,
    iconName: 'hand-heart',
  },
  // @BETA: Disabled for now
  // {
  //   key: '3',
  //   label: formatText({ id: 'navigation.members.verifiedMembers' }),
  //   to: COLONY_VERIFIED_ROUTE,
  //   iconName: 'seal-check',
  // },
  // {
  //   key: '4',
  //   label: formatText({ id: 'navigation.members.permissions' }),
  //   to: COLONY_PERMISSIONS_ROUTE,
  //   iconName: 'signature',
  // },
  {
    key: '5',
    label: formatText({ id: 'navigation.members.teams' }),
    to: COLONY_TEAMS_ROUTE,
    iconName: 'users-four',
  },
];

// @todo: update routes when pages will be ready
export const financesMenu: NavigationSidebarLinksListProps['items'] = [
  // @BETA: Disabled for now
  // {
  //   key: '1',
  //   label: formatText({ id: 'navigation.finances.overview' }),
  //   to: '/overview',
  //   iconName: 'pie-chart',
  //   tagProps: {
  //     text: 'New',
  //     mode: 'new',
  //   },
  // },
  {
    key: '2',
    label: formatText({ id: 'navigation.finances.balance' }),
    to: COLONY_BALANCES_ROUTE,
    iconName: 'chart-bar',
  },
  {
    key: '3',
    label: formatText({ id: 'navigation.finances.incomingFunds' }),
    to: COLONY_INCOMING_ROUTE,
    iconName: 'arrow-down-right',
  },
  // @BETA: Disabled for now
  // {
  //   key: '4',
  //   label: formatText({ id: 'navigation.finances.transactions' }),
  //   to: '/transactions',
  //   iconName: 'list-checks',
  //   disabled: true,
  //   tagProps: {
  //     text: 'Coming soon',
  //   },
  // },
  // {
  //   key: '5',
  //   label: formatText({ id: 'navigation.finances.streamingPayments' }),
  //   to: '/streaming-payments',
  //   iconName: 'chart-line',
  // },
];

// @todo: update routes when pages will be ready
export const agreementsMenu: NavigationSidebarLinksListProps['items'] = [
  {
    key: '1',
    label: formatText({ id: 'navigation.agreements.allAgreements' }),
    to: COLONY_AGREEMENTS_ROUTE,
    iconName: 'chats-circle',
    tagProps: {
      text: formatText({ id: 'status.new' }),
      mode: 'new',
    },
  },
];

export const adminMenu: NavigationSidebarLinksListProps['items'] = [
  {
    key: '1',
    label: formatText({ id: 'navigation.admin.colonyDetails' }),
    to: COLONY_DETAILS_ROUTE,
    iconName: 'buildings',
  },
  // @BETA: Disabled for now
  // {
  //   key: '2',
  //   label: formatText({ id: 'navigation.admin.reputation' }),
  //   to: COLONY_REPUTATION_ROUTE,
  //   iconName: 'star',
  // },
  {
    key: '3',
    label: formatText({ id: 'navigation.admin.extensions' }),
    to: COLONY_EXTENSIONS_ROUTE,
    iconName: 'puzzle-piece',
  },
  // @BETA: Disabled for now
  // {
  //   key: '4',
  //   label: formatText({ id: 'navigation.admin.integrations' }),
  //   to: COLONY_INTEGRATIONS_ROUTE,
  //   iconName: 'intersect',
  // },
  // {
  //   key: '5',
  //   label: formatText({ id: 'navigation.admin.incorporation' }),
  //   to: COLONY_INCORPORATION_ROUTE,
  //   iconName: 'briefcase',
  //   disabled: true,
  //   tagProps: {
  //     text: formatText({ id: 'status.comingSoon' }),
  //   },
  // },
  {
    key: '6',
    label: formatText({ id: 'navigation.admin.advancedSettings' }),
    to: COLONY_ADVANCED_ROUTE,
    iconName: 'wrench',
  },
];

// @todo: update routes when pages will be ready
export const dashboardMainMenu: NavigationSidebarLinksListProps['items'] = [
  {
    key: '1',
    label: formatText({ id: 'navigation.dashboard.dashboard' }),
    to: '',
    iconName: 'layout',
  },
];

// @todo: update routes when pages will be ready
export const dashboardMenu: NavigationSidebarLinksListProps['items'] = [
  {
    key: '1',
    label: formatText({ id: 'navigation.dashboard.activityFeed' }),
    to: COLONY_ACTIVITY_ROUTE,
    iconName: 'presentation-chart',
  },
  // Disabled for now
  // {
  //   key: '2',
  //   label: formatText({ id: 'navigation.dashboard.about' }),
  //   to: COLONY_DETAILS_ROUTE,
  //   iconName: 'book-open-text',
  // },
];
