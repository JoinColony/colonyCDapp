import { isAddress, Interface, type Fragment } from 'ethers/lib/utils';
import { string } from 'yup';

import { formatText } from '~utils/intl.ts';
import { validateType } from '~utils/safes/contractParserValidation.ts';

import { MSG } from './translation.ts';

const createValidator = (schema: any) => (value: string) => {
  try {
    schema.validateSync(value);
    return true;
  } catch (error) {
    return error.message;
  }
};

const isValidJson = (val: string) => {
  try {
    JSON.parse(val);
    return true;
  } catch (error) {
    return false;
  }
};

const isValidAbi = (val: string) => {
  try {
    const parsedAbi = JSON.parse(val);
    // eslint-disable-next-line no-new
    new Interface(parsedAbi); // This line will throw an error if the ABI is not valid
    return true;
  } catch (error) {
    return false;
  }
};

export const abiFunctionsFilterFn = ({
  type,
  stateMutability,
  constant,
}: Fragment & { stateMutability?: string; constant?: boolean }) =>
  type === 'function' &&
  stateMutability !== 'view' &&
  stateMutability !== 'pure' &&
  constant !== true;

const hasAbiMethods = (val: string) => {
  try {
    const parsedAbi = JSON.parse(val);
    const IJsonAbi = new Interface(parsedAbi);
    const functions = IJsonAbi.fragments.filter(abiFunctionsFilterFn);
    return functions.length > 0;
  } catch (error) {
    return false;
  }
};

export const validateContractAddress = createValidator(
  string()
    .test(
      'is-address',
      formatText(MSG.contractAddressError),
      (val) => !val || isAddress(val),
    )
    .required(formatText({ id: 'validation.required' })),
);

export const validateJsonAbi = createValidator(
  string()
    .test(
      'is-valid-json',
      formatText(MSG.jsonParseError),
      (val) => !val || isValidJson(val),
    )
    .test(
      'is-valid-abi',
      formatText(MSG.invalidAbiError),
      (val) => !val || isValidAbi(val),
    )
    .test(
      'is-abi-has-methods',
      formatText(MSG.emptyMethodsAbiError),
      (val) => !val || hasAbiMethods(val),
    )
    .required(formatText({ id: 'validation.required' })),
);

export const validateMethod = createValidator(
  string().required(formatText({ id: 'validation.required' })),
);

export const validateDynamicMethodInput = (type) => (value: string) => {
  const isValid = validateType(type, value);

  if (isValid === true) {
    return true;
  }

  // Handle array validation errors
  if (typeof isValid === 'number') {
    if (isValid === -1) {
      return formatText(MSG.validationArrayError);
    }
    return formatText(MSG.validationByIndexError, { index: isValid });
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
