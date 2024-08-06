import { countryCodeToCurrencyMap } from '~constants/currency.ts';
import { SupportedCurrencies } from '~gql';

import { locationApiConfig } from './config.ts';
import { type IpLocationResponse, type IpifyResponse } from './types.ts';
import { buildAPIEndpoint, fetchData } from './utils.ts';

const { ipGeolocatorEndpoint, ipLookupEndpoint } = locationApiConfig;

/**
 * Fetch the user's country code based on their IP address.
 * @returns The user's country code, e.g. 'US'
 */
const getUserIp = async () => {
  const url = buildAPIEndpoint(new URL(ipLookupEndpoint), { format: 'json' });
  const ip = await fetchData<IpifyResponse>(
    url,
    (response) => {
      return response.ip;
    },
    'Unable to get user IP address.',
  );

  return ip;
};

const getUserCountryCode = async (ip: string) => {
  const url = buildAPIEndpoint(new URL(ipGeolocatorEndpoint), { ip });
  return fetchData<IpLocationResponse>(
    url,
    // eslint-disable-next-line camelcase
    ({ country_code2 }) => country_code2,
    'Failed to fetch user country code. ',
  );
};

/**
 * @returns The user's currency based on their location, e.g. 'USD'
 */
export const getUserCurrencyByLocation =
  async (): Promise<SupportedCurrencies> => {
    const ip = await getUserIp();

    if (ip) {
      const countryCode = await getUserCountryCode(ip);

      if (countryCode && countryCode in countryCodeToCurrencyMap) {
        return countryCodeToCurrencyMap[countryCode];
      }
    }

    return SupportedCurrencies.Usd;
  };
