import { string, object } from 'yup';

import { ADDRESS_ZERO, DEFAULT_NETWORK_TOKEN } from '~constants';
import { GetFullColonyByNameDocument, GetTokenByAddressDocument } from '~gql';
import { intl } from '~utils/intl';
import { isAddress } from '~utils/web3';
import { createYupTestFromQuery } from '~utils/yup/tests';

/*
 * The colony name regex is composed of
 * ^[A-Za-z0-9] starts with upper case, lower case or numerals
 * \w can include upper case, lower case, numerals or underscore
 * {0,254}$ match the preceding set at least 0 and at most 254 times from the end (so excluding the first char)
 */
const COLONY_NAME_REGEX = /^[A-Za-z0-9]\w{0,254}$/;

const TOKEN_SYMBOL_REGEX = /^[A-Za-z0-9]{0,5}$/;

const isNameTaken = createYupTestFromQuery({
  query: GetFullColonyByNameDocument,
  circuitBreaker: isValidName,
});

const doesTokenExist = createYupTestFromQuery({
  query: GetTokenByAddressDocument,
  circuitBreaker: isValidTokenAddress,
  failIfPresent: false,
});

const { formatMessage } = intl({
  'error.urlTaken': 'This colony URL is already taken',
  'error.colonyURL': 'This is not a valid colony URL',
  'error.colonyNameRequired': 'Enter a name to continue',
  'error.colonyURLRequired': 'Enter a URL to continue',
  'error.addressZeroError':
    'You cannot use {symbol} token as a native token for colony.',
  'error.tokenAddressRequired': 'Enter a token address to continue',
  'error.invalidToken':
    'Not a valid token. Only ERC20 tokens with 18 decimals are supported.',
  'error.tokenNotFound':
    'Token data not found. Please check the token contract address.',
  'error.tokenNameRequired': 'Enter a token name to continue',
  'error.tokenSymbolRequired': 'Enter a token symbol to continue',
  'error.tokenNameLength': 'Token name should be 255 characters or fewer',
  'error.tokenSymbol': 'Token symbol can only contain letters and numbers',
});

export const colonyNameValidationSchema = object({
  displayName: string().required(
    formatMessage({ id: 'error.colonyNameRequired' }),
  ),
  colonyName: string()
    .required(formatMessage({ id: 'error.colonyURLRequired' }))
    .test('isValidName', formatMessage({ id: 'error.colonyURL' }), isValidName)
    .test('isNameTaken', formatMessage({ id: 'error.urlTaken' }), isNameTaken),
}).defined();

export const selectTokenValidationSchema = object({
  tokenAddress: string()
    .default('')
    .required(formatMessage({ id: 'error.tokenAddressRequired' }))
    .address(formatMessage({ id: 'error.invalidToken' }))
    .notOneOf(
      [ADDRESS_ZERO],
      formatMessage(
        { id: 'error.addressZeroError' },
        {
          symbol: DEFAULT_NETWORK_TOKEN.symbol,
        },
      ),
    )
    .test(
      'doesTokenExist',
      formatMessage({ id: 'error.tokenNotFound' }),
      doesTokenExist,
    ),
  tokenName: string().default(''),
  tokenSymbol: string().default(''),
}).defined();

export const createTokenValidationSchema = object({
  tokenSymbol: string()
    .default('')
    .max(5)
    .required(formatMessage({ id: 'error.tokenSymbolRequired' }))
    .test(
      'isValidTokenSymbol',
      formatMessage({ id: 'error.tokenSymbol' }),
      isValidTokenSymbol,
    ),
  tokenName: string()
    .default('')
    .max(255, formatMessage({ id: 'error.tokenNameLength' }))
    .required(formatMessage({ id: 'error.tokenNameRequired' })),
  tokenAddress: string().default(''),
}).defined();

function isValidName(name: string) {
  return name ? new RegExp(COLONY_NAME_REGEX).test(name) : true;
}

function isValidTokenSymbol(symbol: string) {
  return symbol ? new RegExp(TOKEN_SYMBOL_REGEX).test(symbol) : true;
}

function isValidTokenAddress(address: string) {
  return isAddress(address) && address !== ADDRESS_ZERO;
}
