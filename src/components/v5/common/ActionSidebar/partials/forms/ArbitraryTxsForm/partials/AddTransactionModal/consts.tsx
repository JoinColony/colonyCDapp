import { isAddress } from 'ethers/lib/utils';
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
  })
  .defined();

export type ManageTokensFormValues = InferType<typeof validationSchema>;
