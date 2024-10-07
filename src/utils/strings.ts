// import { addressNormalizer, addressValidator } from '@purser/core';
import DOMPurify from 'dompurify';
import { customAlphabet, urlAlphabet } from 'nanoid';

import { type Address } from '~types/index.ts';
import { isTransactionFormat } from '~utils/web3/index.ts';

const HTTP_PROTOCOL = 'http://';
const HTTPS_PROTOCOL = 'https://';

/*
  Removes line breaks and replaces them with spaces
*/
export const rmLineBreaks = (str: string) => str.replace(/(\r\n|\n|\r)/gm, ' ');

/**
 * Cut a string short (based on maxCharLength) and append an ellipsis at the end `...`
 *
 * @method multiLineTextEllipsis
 *
 * @param {string} string the string to check / cut short
 * @param {number} maxCharLength the maximum number of characters allowed
 *
 * @return {string} based on maxCharLength either the cut down string or the original one
 */
export const multiLineTextEllipsis = (
  string: string,
  maxCharLength: number,
) => {
  if (string && string.length > maxCharLength) {
    return `${string.substring(0, maxCharLength)}... `;
  }
  return string;
};

/**
 * Display the file size in human readable form, appending correct suffixes
 *
 * @method humanReadableFileSize
 *
 * @param {number} size the base size (in bytes) to transform
 *
 * @return {string} the size string in human reabled form with suffix appended
 */
export const humanReadableFileSize = (size: number) => {
  const index = Math.floor(Math.log(size) / Math.log(1024));
  return `${(size / 1024 ** index).toFixed(2)} ${
    ['B', 'kB', 'MB', 'GB', 'TB'][index]
  }`;
};

/**
 * Capitalize a word (converts the first letter of the word to upper case)
 *
 * @method capitalize
 *
 * @param {string} word The word / string to capitalize
 * @return {string} The capitalized string
 */
export const capitalizeFirstLetter = (
  word: string,
  options?: { lowerCaseRemainingLetters?: boolean },
): string =>
  word &&
  word.charAt(0).toUpperCase() +
    (options?.lowerCaseRemainingLetters
      ? word.slice(1).toLowerCase()
      : word.slice(1));

/**
 * Capitalize a word (converts the word to lower case, except for the first letter)
 *
 * @method convertToCapitalized
 *
 * @param {string} word The word / string to capitalize
 * @return {string} The capitalized string
 */
export const capitalizeWord = (word: string): string => {
  const lower = word.toLowerCase();
  return capitalizeFirstLetter(lower);
};
/**
 * Strip the normal and secure website protocol from the start of a string.
 * If will only check for the specific 'http' and 'https' strings and strip them out,
 * otherwise it will just return the original string.
 *
 * Most use cases would be do display just to domain (and path) part of a website
 *
 * @method stripProtocol
 *
 * @param {string} urlString The string to remove the protocol from
 *
 * @return {string} The new string (stripped of the protocol) or the original one
 */
export const stripProtocol = (urlString: string) =>
  (urlString.startsWith(HTTP_PROTOCOL) &&
    urlString.replace(HTTP_PROTOCOL, '')) ||
  (urlString.startsWith(HTTPS_PROTOCOL) &&
    urlString.replace(HTTPS_PROTOCOL, '')) ||
  urlString;

export type AddressElements = {
  header: string;
  start: string;
  middle: string;
  end: string;
};

/**
 * Split an BIP32 address to highlight start and end sections,
 * hidden by a configurable string mask
 *
 * @NOTE We also validate the address here. If it's not correct this will throw, but we catch it and
 * just return the error message in that case
 *
 * @method splitAddress
 *
 * @param {string} address The address to mask (must be valid!)
 *
 * @return {array} The split address in an array of strings
 */
export const splitAddress = (address: Address): AddressElements => {
  const HEX_HEADER = '0x';
  const rawAddress: string = address.replace('0x', '');
  const addressStart: string = rawAddress.slice(0, 4);
  const addressMiddle: string = rawAddress.slice(4, -4);
  const addressEnd: string = rawAddress.slice(-4);

  return {
    header: HEX_HEADER,
    start: `${addressStart}`,
    middle: `${addressMiddle}`,
    end: addressEnd,
  };
};

export const splitTransactionHash = (
  transactionHash: string,
): AddressElements | undefined => {
  if (isTransactionFormat(transactionHash)) {
    const HEX_HEADER = '0x';
    const addressStart: string = transactionHash.slice(2, 6);
    const addressMiddle: string = transactionHash.slice(4, -4);
    const addressEnd: string = transactionHash.slice(-4);
    return {
      header: HEX_HEADER,
      start: `${addressStart}`,
      middle: `${addressMiddle}`,
      end: addressEnd,
    };
  }
  return undefined;
};

// This should be opaque
type RandomId = string;

export const generateUrlFriendlyId = (): RandomId =>
  customAlphabet(urlAlphabet, 21)();

export const ensureHexPrefix = (value: string): string => {
  const HEX_HEADER = '0x';
  if (value.toLocaleLowerCase().startsWith(HEX_HEADER)) {
    return value;
  }
  return `${HEX_HEADER}${value}`;
};

/**
 * Given a bool, returns 'Yes' or 'No'
 */
export const boolToYesNo = (value: boolean) => (value ? 'Yes' : 'No');

export const sanitizeHTML = (content: string) => DOMPurify.sanitize(content);

export const stripHTML = (content: string) =>
  DOMPurify.sanitize(content, { ALLOWED_TAGS: [], KEEP_CONTENT: true });

export const stripAndremoveHeadingsFromHTML = (content: string) => {
  // When stripHTML is called, it removes all of the HTML tags, but does not leave a space between the content of paragraphs.
  // This hook ensures that there is a space between paragraphs.
  DOMPurify.addHook('uponSanitizeElement', (node) => {
    if (node.tagName?.toLowerCase() === 'p') {
      // eslint-disable-next-line no-param-reassign
      node.innerHTML = !node.innerHTML ? '' : `${node.innerHTML} `;
    }
  });

  const string = stripHTML(
    DOMPurify.sanitize(content, {
      FORBID_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      KEEP_CONTENT: false,
    }),
  );

  DOMPurify.removeHook('uponSanitizeElement');

  return string;
};

export const getCommaSeparatedStringList = (strings: string[]) => {
  if (strings.length === 0) return '';
  if (strings.length === 1) return strings[0];
  if (strings.length === 2) return `${strings[0]} and ${strings[1]}`;

  const lastItem = strings.pop();

  return `${strings.join(', ')}, and ${lastItem}`;
};
