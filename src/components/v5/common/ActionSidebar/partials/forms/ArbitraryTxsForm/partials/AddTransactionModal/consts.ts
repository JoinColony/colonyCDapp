import { isAddress, Interface } from 'ethers/lib/utils';
import { string } from 'yup';

import { formatText } from '~utils/intl.ts';
import { validateType } from '~utils/safes/contractParserValidation.ts';

import { MSG } from './translation.ts';

export const validateContractAddress = (value: string) => {
  const schema = string()
    .test('is-address', formatText(MSG.contractAddressError), (val) => {
      if (!val) {
        return true;
      }
      return isAddress(val);
    })
    .required();

  try {
    schema.validateSync(value);
    return true;
  } catch (error) {
    return error.message;
  }
};

export const validateJsonAbi = (value: string) => {
  const schema = string()
    .test('is-valid-json', formatText(MSG.jsonParseError), (val) => {
      if (!val) {
        return true;
      }

      try {
        JSON.parse(val);
        return true;
      } catch (error) {
        return false;
      }
    })
    .test('is-valid-abi', formatText(MSG.invalidAbiError), (val) => {
      if (!val) {
        return true;
      }

      try {
        const parsedAbi = JSON.parse(val);
        // eslint-disable-next-line no-new
        new Interface(parsedAbi);

        return true;
      } catch (error) {
        return false;
      }
    })
    .test('is-abi-has-methods', formatText(MSG.emptyMethodsAbiError), (val) => {
      if (!val) {
        return true;
      }

      try {
        const parsedAbi = JSON.parse(val);
        const IJsonAbi = new Interface(parsedAbi);
        const functions = IJsonAbi.fragments.filter(
          ({ type }) => type === 'function',
        );
        if (!functions.length) {
          return false;
        }

        return true;
      } catch (error) {
        return false;
      }
    });

  try {
    schema.validateSync(value);
    return true;
  } catch (error) {
    return error.message;
  }
};

export const validateDynamicMethodInput = (type) => (value: string) => {
  const isValid = validateType(type, value);

  if (isValid === true) {
    return true;
  }

  // Handle array validation errors
  if (typeof isValid === 'number') {
    if (isValid === -1) {
      return formatText('Invalid array format');
    }
    return formatText(`Invalid value at index ${isValid}`);
  }

  // Generate error messages for specific types
  switch (true) {
    case type.startsWith('uint'):
    case type.startsWith('int'):
      return formatText(MSG.validationIntError);
    case type === 'address':
      return formatText(MSG.validationAddressError);
    case type === 'bool':
      return formatText(MSG.validationBooleanError);
    case type.startsWith('bytes'):
      return formatText(MSG.validationByteError);
    case type.includes('[]'):
      return formatText(MSG.validationArrayError);
    default:
      return formatText(MSG.validationInputError);
  }
};
