import { isAddress, Interface } from 'ethers/lib/utils';
import { string } from 'yup';

import { formatText } from '~utils/intl.ts';

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
    });

  try {
    schema.validateSync(value);
    return true;
  } catch (error) {
    return error.message;
  }
};
