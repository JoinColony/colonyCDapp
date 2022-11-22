import { addMethod, string } from 'yup';

import { isAddress } from '~utils/web3';

import en from '../../i18n/en-validation.json';

/*
 * The colony domain regex is composed of
 * ^ start match
 * [A-Za-z0-9] starts with upper case, lower case or numerals
 * [A-Za-z0-9_] can include upper case, lower case, numerals or underscore
 * {0,255} match at least 1 and at most 255 chars
 * $ end match
 */
export const COLONY_NAME_REGEX = `^[A-Za-z0-9][A-Za-z0-9_]{0,255}$`;
/*
 * Hex String Regex Test
 */
export const HEX_STRING_REGEX = '^(0x|0X)?[a-fA-F0-9]+$';

function colonyName(msg) {
  return this.test({
    name: 'colonyName',
    message: msg || en.string.colonyName,
    test(value) {
      return value ? new RegExp(COLONY_NAME_REGEX).test(value) : true;
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

addMethod(string, 'colonyName', colonyName);
addMethod(string, 'address', address);
addMethod(string, 'hexString', hexString);
addMethod(string, 'hasHexPrefix', hasHexPrefix);
