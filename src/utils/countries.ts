import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';

import { usStates } from '~constants/us-states.ts';

countries.registerLocale(enLocale);

const alpha2ToAlpha3 = countries.getAlpha2Codes();
const countryNames = countries.getNames('en');

const FILTERED_COUNTRIES = [
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

interface SubdivisionData {
  name: string;
  code: string;
}

interface CountryData {
  name: string;
  alpha2: string;
  alpha3: string;
  // Array of subdivisions data, only applicable for US states
  subdivisions: SubdivisionData[];
}

const countriesData: CountryData[] = Object.entries(countryNames)
  .filter(([alpha2]) => filterCountry(alpha2))
  .map(([alpha2, name]) => {
    const subdivisions = alpha2 === 'US' ? usStates : [];

    return {
      name,
      alpha2,
      alpha3: alpha2ToAlpha3[alpha2],
      subdivisions,
    };
  });

export const getCountries = () => countriesData;
