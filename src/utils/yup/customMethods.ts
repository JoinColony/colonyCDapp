import { addMethod, string, TestOptionsMessage, array } from 'yup';

import { isAddress } from '~utils/web3/index.ts';

import en from '../../i18n/en-validation.json';

/*
 * Hex String Regex Test
 */
export const HEX_STRING_REGEX = '^(0x|0X)?[a-fA-F0-9]+$';

function address(msg?: TestOptionsMessage) {
  return this.test({
    name: 'address',
    message: msg || en.string.address,
    test(value: string) {
      return typeof value == 'undefined' || isAddress(value);
    },
  });
}

function hexString(msg?: TestOptionsMessage) {
  return this.test({
    name: 'hexString',
    message: msg || en.string.hexString,
    test(value: string) {
      return value ? !!value.match(new RegExp(HEX_STRING_REGEX)) : true;
    },
  });
}

function hasHexPrefix(msg?: TestOptionsMessage) {
  return this.test({
    name: 'hasHexPrefix',
    message: msg || en.string.hasHexPrefix,
    test(value: string) {
      return value ? value.toLowerCase().startsWith('0x') : true;
    },
  });
}

function unique(message, mapper = (a) => a) {
  return this.test({
    name: 'unique',
    message,
    test(list) {
      if (!list) return true;

      return list.length === new Set(list.map(mapper)).size;
    },
  });
}

addMethod(string, 'address', address);
addMethod(string, 'hexString', hexString);
addMethod(string, 'hasHexPrefix', hasHexPrefix);
addMethod(array, 'unique', unique);
