import { normalize as ensNormalize } from 'eth-ens-namehash-ms';
import { addMethod, string } from 'yup';

import { isAddress } from '~utils/web3';

import en from '../../i18n/en-validation.json';

/*
 * The ens domain regex is composed of
 * ^ start match
 * [A-Za-z0-9] allow upper case, lower case, numerals
 * [^.] negate to not allow dots / periods
 * {0,255} match at least 1 and at most 255 chars
 * $ end match
 */
export const ENS_DOMAIN_REGEX = '^[A-Za-z0-9][^.]{0,255}$';
/*
 * Hex String Regex Test
 */
export const HEX_STRING_REGEX = '^(0x|0X)?[a-fA-F0-9]+$';

function ensAddress(msg) {
  return this.test({
    name: 'ensAddress',
    message: msg || en.string.ensAddress,
    test(value) {
      try {
        ensNormalize(value);
      } catch (e) {
        return false;
      }
      return value ? !!value.match(new RegExp(ENS_DOMAIN_REGEX)) : true;
    },
  });
}

function address(msg) {
  return this.test({
    name: 'address',
    message: msg || en.string.address,
    test(value) {
      return typeof value == 'undefined' || isAddress(value);
    },
  });
}

function hexString(msg) {
  return this.test({
    name: 'hexString',
    message: msg || en.string.hexString,
    test(value) {
      return value ? !!value.match(new RegExp(HEX_STRING_REGEX)) : true;
    },
  });
}

function hasHexPrefix(msg) {
  return this.test({
    name: 'hasHexPrefix',
    message: msg || en.string.hasHexPrefix,
    test(value) {
      return value ? value.toLowerCase().startsWith('0x') : true;
    },
  });
}

addMethod(string, 'ensAddress', ensAddress);
addMethod(string, 'address', address);
addMethod(string, 'hexString', hexString);
addMethod(string, 'hasHexPrefix', hasHexPrefix);
