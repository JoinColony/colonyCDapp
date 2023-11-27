import {
  COLONY_DETAILS_ROUTE,
  COLONY_MEMBERS_ROUTE,
  COLONY_TEAMS_ROUTE,
} from '~routes';
import { NavItem } from './types';

export const getNavItems = (name: string | undefined): NavItem[] => [
  {
    label: 'Dashboard',
    key: '1',
    href: '/',
  },
  {
    label: 'Members',
    key: '2',
    href: `/${name}/${COLONY_MEMBERS_ROUTE}`,
  },
  {
    label: 'Decisions',
    key: '3',
    href: '/',
  },
  {
    label: 'More',
    key: '4',
    subMenu: [
      {
        label: 'Activity',
        href: '/activity',
        description:
          'Latest activity in the Colony, including motions & actions.',
      },
      {
        label: 'About',
        href: '/about',
        description: 'Learn more about this Colony, the purpose and mission.',
      },
      {
        label: 'Admin',
        href: `/${name}/${COLONY_DETAILS_ROUTE}`,
        description: 'View and manage how this Colony works and operates.',
      },
      {
        label: 'Members',
        href: `/${name}/${COLONY_MEMBERS_ROUTE}`,
        description:
          'View and manage contributors and followers in this colony.',
      },
      {
        label: 'Teams',
        href: `/${name}/${COLONY_TEAMS_ROUTE}`,
        description: 'View the structure of work groups and teams.',
      },
      {
        label: 'Work',
        href: '/work',
        description: 'View and participate in tasks, projects, and objectives.',
        status: {
          text: 'Coming Soon',
          mode: 'coming-soon',
        },
      },
    ],
  },
];
