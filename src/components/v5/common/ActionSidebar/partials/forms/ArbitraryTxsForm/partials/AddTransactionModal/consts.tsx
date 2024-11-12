import { isAddress, Interface } from 'ethers/lib/utils';
import { type InferType, object, string, type ObjectSchema } from 'yup';

import { formatText } from '~utils/intl.ts';

import { MSG } from './translation.ts';

export const validationSchema: ObjectSchema<any> = object()
  .shape({
    contractAddress: string()
      .test('is-address', formatText(MSG.contractAddressError), (value) => {
        if (!value) {
          return true;
        }

        return isAddress(value);
      })
      .required(),
    jsonAbi: string()
      .test('is-valid-json', formatText(MSG.jsonParseError), (value) => {
        if (!value) {
          return true;
        }

        try {
          JSON.parse(value);
          return true;
        } catch (error) {
          return false;
        }
      })
      .test('is-valid-abi', formatText(MSG.invalidAbiError), (value) => {
        if (!value) {
          return true;
        }

        try {
          const parsedAbi = JSON.parse(value);
          // eslint-disable-next-line no-new
          new Interface(parsedAbi);
          return true;
        } catch (error) {
          return false;
        }
      }),
  })
  .defined();

export type ManageTokensFormValues = InferType<typeof validationSchema>;
