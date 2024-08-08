import countries from 'i18n-iso-countries';

import { COUNTRIES_WITHOUT_STATES, FILTERED_COUNTRIES } from './countries.ts';

export interface SubdivisionData {
  name: string;
  code: string;
  category: string | null;
}

export const getSubdivisionsByAlpha2Code = async (
  code: string,
): Promise<SubdivisionData[]> => {
  try {
    const { default: subdivisionData } = await import(
      `~constants/subdivision-ISO-3166-2-codes/${code.toLowerCase()}.json`
    );
    if (code !== 'GB') {
      return subdivisionData;
    }
    const allowedGBCodes = ['GB-ENG', 'GB-NIR', 'GB-SCT', 'GB-WLS'];
    return subdivisionData.filter((subdivision: SubdivisionData) =>
      allowedGBCodes.includes(subdivision.code),
    );
  } catch {
    // Couldn't find file with matching country code
    return [];
  }
};

export const getSubdivisionsByCountryCode = async (
  code: string,
): Promise<SubdivisionData[]> => {
  if (COUNTRIES_WITHOUT_STATES.includes(code)) {
    return [];
  }

  let alpha2Code: string | undefined;

  if (!code) {
    return [];
  }
  if (code.length === 2) {
    alpha2Code = code;
  } else if (code.length === 3) {
    alpha2Code = countries.alpha3ToAlpha2(code);
  }

  if (!alpha2Code || FILTERED_COUNTRIES.includes(alpha2Code)) {
    return [];
  }

  return getSubdivisionsByAlpha2Code(alpha2Code);
};
