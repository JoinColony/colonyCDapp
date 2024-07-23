import { SupportedCurrencies } from '~gql';

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
