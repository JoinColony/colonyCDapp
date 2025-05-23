import { BigNumber } from 'ethers';
import { isAddress, isHexString } from 'ethers/lib/utils';
import { isNaN } from 'lodash';

const validateIntegerFrom8To256 = (numBytes: number, intName = 'int') => {
  if (isNaN(numBytes) || numBytes < 8 || numBytes > 256 || numBytes % 8 !== 0) {
    throw new Error(
      `Invalid ${intName} type. Must be between ${intName}8 and ${intName}256, in steps of 8.`,
    );
  }
};

const getMaxSafeUnsignedInteger = (input: string): BigNumber => {
  let bytes = input.substring(4);
  /* If input == 'uint', set to 256, since 'uint/int' is an alias of 'uint/int256'. */
  if (bytes === '') {
    bytes = '256';
  }
  const numBytes = parseInt(bytes, 10);
  validateIntegerFrom8To256(numBytes, 'uint');

  const base = BigNumber.from(2);
  return base.pow(numBytes).sub(1);
};

const getMaxSafeInteger = (input: string): BigNumber => {
  let bytes = input.substring(3);
  if (bytes === '') {
    bytes = '256';
  }

  const numBytes = parseInt(bytes, 10);
  validateIntegerFrom8To256(numBytes);

  /*
   * We're checking signed ints. Unsigned would be, e.g. 2**256 - 1.
   * Signed we have to check negatives, so it's (2 ** 256 / 2) - 1, which === 2 ** 255 - 1.
   */
  const exp = Number(bytes) - 1;
  const base = BigNumber.from(2);
  return base.pow(exp).sub(1);
};

const isUintSafe = (value: string, inputType: string) => {
  if (value === '' || value[0] === '-') {
    return false;
  }

  let isSafe: boolean;
  try {
    const max = getMaxSafeUnsignedInteger(inputType);
    isSafe = max.gte(value);
  } catch (e) {
    console.error(e);
    isSafe = false;
  }
  return isSafe;
};

const isIntSafe = (value: string, inputType: string) => {
  if (value === '') {
    return false;
  }

  let isSafe: boolean;
  try {
    const max = getMaxSafeInteger(inputType);
    const val = BigNumber.from(value);
    isSafe = val.gte(0) ? max.gte(val) : max.mul(-1).lte(val);
  } catch (e) {
    console.error(e);
    isSafe = false;
  }
  return isSafe;
};

export const getArrayFromString = (array: string): Array<string> => {
  if (array === '[]') {
    return [];
  }

  const contents = array.substring(1, array.length - 1);
  const parsedElements: Array<string> = [];
  let currentStartIndex = 0;
  let currentNestingLevel = 0;

  for (let i = 0; i < contents.length; i += 1) {
    if (contents[i] === '[') {
      currentNestingLevel += 1;
    } else if (contents[i] === ']') {
      currentNestingLevel -= 1;
    }

    const isLastChar = i === contents.length - 1;
    const isEndOfElement = contents[i] === ',';

    if (currentNestingLevel === 0 && (isLastChar || isEndOfElement)) {
      const endIndex = isLastChar ? i : i - 1;
      parsedElements.push(
        contents.substring(currentStartIndex, endIndex + 1).trim(),
      );
      currentStartIndex = i + 1;
    }

    if (isLastChar && currentNestingLevel !== 0) {
      throw new Error('Invalid array');
    }
  }

  return parsedElements;
};

const isAddressValid = (value: string) => {
  return isAddress(value);
};

const isValueArray = (value: string) => {
  return value[0] === '[' && value[value.length - 1] === ']';
};

const getBytesStringLength = (inputType: string) => {
  let bytes = inputType.substring(5);
  /* "Prior to version 0.8.0, byte used to be an alias for bytes1." https://docs.soliditylang.org/en/v0.8.12/types.html */
  if (inputType === 'byte') {
    bytes = '1';
  }

  const prefix = 2; // Byte arrays begin with 0x.
  // Every character is represented by 4 bits. Every byte holds 8 bits, therefore two characters represent 1 byte.
  const length = Number(bytes) * 2;
  return prefix + length;
};

const isByteStringValid = (value: string, inputType: string) => {
  if (!isHexString(value)) {
    return false;
  }

  const isFixedLength = inputType !== 'bytes';

  if (isFixedLength) {
    return value.length === getBytesStringLength(inputType);
  }

  /*
   * A dynamically sized byte array can be of arbitrary length. But it must have an even number of characters.
   */
  return value.length % 2 === 0;
};

const isValidBoolean = (value: string) => {
  if (value === 'true' || value === 'false' || value === '0' || value === '1') {
    return true;
  }
  return false;
};

const isValidString = (value: string) => {
  return typeof value === 'string';
};

const isInputTypeArray = (inputType: string) => {
  return inputType.substring(inputType.length - 2) === '[]';
};

const typeFunctionMap: {
  [key: string]: (value: string, inputType: string) => boolean;
} = {
  uint: isUintSafe,
  int: isIntSafe,
  address: isAddressValid,
  byte: isByteStringValid,
  bool: isValidBoolean,
  string: isValidString,
};

export const validateType = (
  inputType: string,
  value: string,
  // when validating nested arrays, it indicates the current index in the top level array
  topLevelIndex?: number,
): boolean | number => {
  const isArrayType = isInputTypeArray(inputType);

  if (isArrayType) {
    if (!isValueArray(value)) {
      return topLevelIndex ?? -1;
    }

    try {
      const elements = getArrayFromString(value);
      const elementsType = inputType.substring(0, inputType.length - 2);
      let failIdx: number;

      const allElementsValid = elements.every((element, index) => {
        const currentIndex = topLevelIndex ?? index;

        const validationResult = validateType(
          elementsType,
          element,
          currentIndex,
        );

        // error is indicated by either 'false' or an index at which it occured
        if (validationResult !== true) {
          failIdx = currentIndex;
          return false;
        }

        return true;
      });

      if (allElementsValid) {
        return true;
      }

      return failIdx!; // If we get here, it means allElementsValid is false and failIdx was set.
    } catch {
      return -1;
    }
  }

  const key = Object.keys(typeFunctionMap).find((t) => inputType.includes(t));

  // key should always be defined, since why else call this function?.
  if (!key) {
    return false;
  }

  const validationFn = typeFunctionMap[key];
  return validationFn(value, inputType);
};
