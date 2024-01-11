import { SupportedCurrencies } from '~gql';

import { currencyIconTitles } from '../UserSubmenu/consts';

export const CURRENCY_MENU_ID = 'userMenu.supportedCurrenciesTitle';

export const userMenuItems = ({
  currency,
}: {
  currency: SupportedCurrencies;
}) => [
  {
    id: '1',
    link: '/',
    icon: 'circles-three-plus',
    name: 'userMenu.getStartedTitle',
  },
  {
    id: '2',
    icon: 'lifebuoy',
    name: 'userMenu.contactAndSupportTitle',
  },
  {
    id: '3',
    icon: 'code',
    name: 'userMenu.developersTitle',
  },
  {
    id: '4',
    icon: 'briefcase',
    name: 'userMenu.legalAndPrivacyTitle',
  },
  {
    id: '5',
    icon: currencyIconTitles[currency],
    name: CURRENCY_MENU_ID,
    message: currency.toUpperCase(),
  },
];
