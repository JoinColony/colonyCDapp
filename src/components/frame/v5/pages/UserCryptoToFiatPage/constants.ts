import { SupportedCurrencies } from '~gql';

export const statusPillThemes = {
  red: {
    bgClassName: 'bg-negative-100',
    textClassName: 'text-negative-400',
    iconClassName: 'text-negative-400 h-3',
  },
  green: {
    bgClassName: 'bg-teams-green-100',
    textClassName: 'text-teams-green-400',
  },
  orange: {
    bgClassName: 'bg-orange-100',
    textClassName: 'text-orange-400',
  },
  gray: {
    bgClassName: 'bg-gray-100',
    textClassName: 'text-gray-400',
  },
};

export const CURRENCY_VALUES = {
  [SupportedCurrencies.Usd]: 'usd',
  [SupportedCurrencies.Eur]: 'eur',
};
export const CURRENCIES = [
  {
    value: CURRENCY_VALUES[SupportedCurrencies.Usd],
    label: SupportedCurrencies.Usd,
  },
  {
    value: CURRENCY_VALUES[SupportedCurrencies.Eur],
    label: SupportedCurrencies.Eur,
  },
];
