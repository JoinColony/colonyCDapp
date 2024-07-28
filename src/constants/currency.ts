import { SupportedCurrencies } from '~gql';

export const countryCodeToCurrencyMap = {
  US: SupportedCurrencies.Usd, // United States
  JP: SupportedCurrencies.Jpy, // Japan
  GB: SupportedCurrencies.Gbp, // United Kingdom
  CA: SupportedCurrencies.Cad, // Canada
  KR: SupportedCurrencies.Krw, // South Korea
  IN: SupportedCurrencies.Inr, // India
  BR: SupportedCurrencies.Brl, // Brazil
  AD: SupportedCurrencies.Eur, // Andorra
  AT: SupportedCurrencies.Eur, // Austria
  BE: SupportedCurrencies.Eur, // Belgium
  HR: SupportedCurrencies.Eur, // Croatia
  CY: SupportedCurrencies.Eur, // Cyprus
  EE: SupportedCurrencies.Eur, // Estonia
  FI: SupportedCurrencies.Eur, // Finland
  FR: SupportedCurrencies.Eur, // France
  DE: SupportedCurrencies.Eur, // Germany
  GR: SupportedCurrencies.Eur, // Greece
  IE: SupportedCurrencies.Eur, // Ireland
  IT: SupportedCurrencies.Eur, // Italy
  LV: SupportedCurrencies.Eur, // Latvia
  LT: SupportedCurrencies.Eur, // Lithuania
  LU: SupportedCurrencies.Eur, // Luxembourg
  MC: SupportedCurrencies.Eur, // Monaco
  MT: SupportedCurrencies.Eur, // Malta
  NL: SupportedCurrencies.Eur, // Netherlands
  PT: SupportedCurrencies.Eur, // Portugal
  SK: SupportedCurrencies.Eur, // Slovakia
  SI: SupportedCurrencies.Eur, // Slovenia
  SM: SupportedCurrencies.Eur, // San Marino
  ES: SupportedCurrencies.Eur, // Spain
  VA: SupportedCurrencies.Eur, // Vatican City
};

export const currencySymbolMap = {
  [SupportedCurrencies.Usd]: '$',
  [SupportedCurrencies.Jpy]: '¥',
  [SupportedCurrencies.Gbp]: '£',
  [SupportedCurrencies.Eur]: '€',
  [SupportedCurrencies.Cad]: 'C$',
  [SupportedCurrencies.Krw]: '₩',
  [SupportedCurrencies.Inr]: '₹',
  [SupportedCurrencies.Brl]: 'R$',
  [SupportedCurrencies.Eth]: 'Ξ',
};
