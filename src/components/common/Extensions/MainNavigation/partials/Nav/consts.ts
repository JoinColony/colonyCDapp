import { NavItem } from './types';

export const navMenuItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/',
    key: '1',
    isLink: true,
  },
  {
    label: 'Members',
    key: '2',
    href: '',
    isLink: true,
  },
  {
    label: 'Decisions',
    key: '3',
    href: '',
    isLink: true,
  },
  {
    label: 'More',
    key: '4',
    href: '',
    subMenu: [
      {
        label: 'Activity',
        href: '/activity',
        description: 'Latest activity in the Colony, including motions & actions.',
      },
      {
        label: 'About',
        href: '/about',
        description: 'Learn more about this Colony, the purpose and mission.',
      },
      {
        label: 'Admin',
        href: '/admin',
        description: 'View and manage how this Colony works and operates.',
      },
      {
        label: 'Members',
        href: '/members',
        description: 'View and manage contributors and followers in this Colony.',
      },
      {
        label: 'Teams',
        href: '/teams',
        description: 'View the structure of work groups and teams.',
      },
      {
        label: 'Work',
        href: '/work',
        description: 'View and participate in tasks, projects, and objectives.',
      },
    ],
  },
];
