import { type Icon, Lifebuoy, Code, Briefcase } from '@phosphor-icons/react';

import { SupportedCurrencies } from '~gql';
import ClnyTokenIcon from '~icons/ClnyTokenIcon.tsx';
import EtherIcon from '~icons/EtherIcon.tsx';
import FlagBrazilIcon from '~icons/FlagBrazilIcon.tsx';
import FlagCanadaIcon from '~icons/FlagCanadaIcon.tsx';
import FlagEuIcon from '~icons/FlagEuIcon.tsx';
import FlagIndiaIcon from '~icons/FlagIndiaIcon.tsx';
import FlagJapanIcon from '~icons/FlagJapanIcon.tsx';
import FlagSouthKoreaIcon from '~icons/FlagSouthKoreaIcon.tsx';
import FlagUkIcon from '~icons/FlagUkIcon.tsx';
import FlagUsIcon from '~icons/FlagUsIcon.tsx';

import { UserMenuItemName } from './types.ts';

export const currencyIcons = {
  [SupportedCurrencies.Usd]: FlagUsIcon,
  [SupportedCurrencies.Jpy]: FlagJapanIcon,
  [SupportedCurrencies.Gbp]: FlagUkIcon,
  [SupportedCurrencies.Eur]: FlagEuIcon,
  [SupportedCurrencies.Cad]: FlagCanadaIcon,
  [SupportedCurrencies.Krw]: FlagSouthKoreaIcon,
  [SupportedCurrencies.Inr]: FlagIndiaIcon,
  [SupportedCurrencies.Brl]: FlagBrazilIcon,
  [SupportedCurrencies.Eth]: EtherIcon,
  [SupportedCurrencies.Clny]: ClnyTokenIcon,
};

export const userMenuItems: Array<{
  id: string;
  icon: Icon;
  name: UserMenuItemName;
}> = [
  {
    id: '1',
    icon: Lifebuoy,
    name: UserMenuItemName.CONTACT_AND_SUPPORT,
  },
  {
    id: '2',
    icon: Code,
    name: UserMenuItemName.DEVELOPERS,
  },
  {
    id: '3',
    icon: Briefcase,
    name: UserMenuItemName.LEGAL_AND_PRIVACY,
  },
];
