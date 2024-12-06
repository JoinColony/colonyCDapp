import {
  type Icon,
  Lifebuoy,
  Code,
  Briefcase,
  MapTrifold,
} from '@phosphor-icons/react';

import { FeatureFlag } from '~context/FeatureFlagsContext/types.ts';
import { ExtendedSupportedCurrencies, SupportedCurrencies } from '~gql';
import ClnyTokenIcon from '~icons/ClnyTokenIcon.tsx';
import EthereumIcon from '~icons/EthereumIcon.tsx';
import FlagBrazilIcon from '~icons/FlagBrazilIcon.tsx';
import FlagCanadaIcon from '~icons/FlagCanadaIcon.tsx';
import FlagEuIcon from '~icons/FlagEuIcon.tsx';
import FlagIndiaIcon from '~icons/FlagIndiaIcon.tsx';
import FlagJapanIcon from '~icons/FlagJapanIcon.tsx';
import FlagSouthKoreaIcon from '~icons/FlagSouthKoreaIcon.tsx';
import FlagUkIcon from '~icons/FlagUkIcon.tsx';
import FlagUsIcon from '~icons/FlagUsIcon.tsx';
import UsdcTokenIcon from '~icons/UsdcTokenIcon.tsx';

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
  [SupportedCurrencies.Eth]: EthereumIcon,
  [SupportedCurrencies.Clny]: ClnyTokenIcon,
  [ExtendedSupportedCurrencies.Usdc]: UsdcTokenIcon,
};

export const userMenuItems: Array<{
  id: string;
  icon: Icon;
  name: UserMenuItemName;
  featureFlag?: string;
}> = [
  {
    id: '1',
    icon: MapTrifold,
    name: UserMenuItemName.GUIDED_TOURS,
    featureFlag: FeatureFlag.GUIDED_TOURS,
  },
  {
    id: '2',
    icon: Lifebuoy,
    name: UserMenuItemName.CONTACT_AND_SUPPORT,
  },
  {
    id: '3',
    icon: Code,
    name: UserMenuItemName.DEVELOPERS,
  },
  {
    id: '4',
    icon: Briefcase,
    name: UserMenuItemName.LEGAL_AND_PRIVACY,
  },
];
