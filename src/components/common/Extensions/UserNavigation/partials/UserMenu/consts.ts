import { UserMenuItemName } from './types';

export const userMenuItems: Array<{
  id: string;
  icon: string;
  name: UserMenuItemName;
}> = [
  {
    id: '1',
    icon: 'lifebuoy',
    name: UserMenuItemName.CONTACT_AND_SUPPORT,
  },
  {
    id: '2',
    icon: 'code',
    name: UserMenuItemName.DEVELOPERS,
  },
  {
    id: '3',
    icon: 'briefcase',
    name: UserMenuItemName.LEGAL_AND_PRIVACY,
  },
];
