import { SupportedCurrencies } from '~gql';

import { UserMenuItemName } from './types.ts';

export const currencyIconTitles = {
  [SupportedCurrencies.Usd]: 'flag-us',
  [SupportedCurrencies.Jpy]: 'flag-japan',
  [SupportedCurrencies.Gbp]: 'flag-uk',
  [SupportedCurrencies.Eur]: 'flag-eu',
  [SupportedCurrencies.Cad]: 'flag-canada',
  [SupportedCurrencies.Krw]: 'flag-southkorea',
  [SupportedCurrencies.Inr]: 'flag-india',
  [SupportedCurrencies.Brl]: 'flag-brazil',
  [SupportedCurrencies.Eth]: 'ether',
  [SupportedCurrencies.Clny]: 'clny-token',
};

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
