import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';

countries.registerLocale(enLocale);

const alpha2ToAlpha3 = countries.getAlpha2Codes();
const countryNames = countries.getNames('en');

export const COUNTRIES_WITHOUT_STATES = [
  'ASM',
  'AIA',
  'ATA',
  'ABW',
  'BMU',
  'BVT',
  'IOT',
  'CYM',
  'TCD',
  'CXR',
  'CCK',
  'COK',
  'FLK',
  'FRO',
  'GUF',
  'PYF',
  'ATF',
  'GIB',
  'GLP',
  'GUM',
  'HMD',
  'VAT',
  'HKG',
  'JPN',
  'MAC',
  'MTQ',
  'MRT',
  'MYT',
  'MSR',
  'NCL',
  'NZL',
  'NIU',
  'NFK',
  'MNP',
  'PCN',
  'PRI',
  'REU',
  'SPM',
  'SGS',
  'SJM',
  'TZA',
  'TKL',
  'TCA',
  'VGB',
  'VIR',
  'ESH',
  'ALA',
  'CUW',
  'GGY',
  'IMN',
  'JEY',
  'BLM',
  'MAF',
  'SXM',
  'XXK',
];

export const FILTERED_COUNTRIES = [
  // OFAC sanctioned countries
  'CU',
  'IR',
  'KP',
  'SY',
  'VE',
  'RU',
  'BY',
];

const filterCountry = (alpha2: string) => !FILTERED_COUNTRIES.includes(alpha2);

export interface CountryData {
  name: string;
  alpha2: string;
  alpha3: string;
}

const countriesData: CountryData[] = Object.entries(countryNames)
  .filter(([alpha2]) => filterCountry(alpha2))
  .map(([alpha2, name]) => {
    return {
      name,
      alpha2,
      alpha3: alpha2ToAlpha3[alpha2],
    };
  });

export const getCountries = () => countriesData;

export const getCountryByCode = (code: string): CountryData | undefined => {
  let alpha2Code: string | undefined;

  if (!code) {
    return undefined;
  }
  if (code.length === 2) {
    alpha2Code = code;
  } else if (code.length === 3) {
    alpha2Code = countries.getAlpha2Code(code, 'en');
  }

  if (!alpha2Code || FILTERED_COUNTRIES.includes(alpha2Code)) {
    return undefined;
  }

  const name = countries.getName(alpha2Code, 'en');

  if (!name) {
    return undefined;
  }
  const alpha3 = alpha2ToAlpha3[alpha2Code];

  return { name, alpha2: alpha2Code, alpha3 };
};
