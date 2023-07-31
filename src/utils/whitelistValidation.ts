import { defineMessages } from 'react-intl';
import isEmpty from 'lodash/isEmpty';
import { string, object, array, ObjectSchema } from 'yup';

import { isAddress } from '~utils/web3';
import { formatText } from '~utils/intl';

const MSG = defineMessages({
  requiredField: {
    id: `utils.whitelistValidation.requiredField`,
    defaultMessage: `Wallet address is a required field.`,
  },
  uploadError: {
    id: `utils.whitelistValidation.uploadError`,
    defaultMessage: `We do not accept more than 100 addresses at a time, please upload a smaller amount.`,
  },
  badFileError: {
    id: `utils.whitelistValidation.badFileError`,
    defaultMessage: `.csv invalid or incomplete. Please ensure the file contains a single column with one address on each row.`,
  },
  invalidAddressError: {
    id: `utils.whitelistValidation.invalidAddressError`,
    defaultMessage: `It looks like one of your addresses is invalid. Please review our required format & validate that your file matches our requirement. Once fixed, please try again.`,
  },
});

export const validationSchemaInput = object({
  whitelistAddress: string()
    .required(() => MSG.requiredField)
    .address(),
}).defined();

export const validationSchemaFile = object({
  whitelistCSVUploader: object()
    .defined()
    .required()
    .shape({
      parsedData: array()
        .of(string().address().defined())
        .min(1, () => formatText(MSG.badFileError))
        .max(1000, () => formatText(MSG.uploadError))
        .test(
          'valid-wallet-addresses',
          () => formatText(MSG.invalidAddressError),
          (value) =>
            isEmpty(
              value?.filter(
                (potentialAddress: string) => !isAddress(potentialAddress),
              ),
            ),
        )
        .defined(),
    }),
}).defined();

export const mergeSchemas = (...schemas: ObjectSchema<object>[]) => {
  const [first, ...rest] = schemas;
  const merged = rest.reduce(
    (mergedSchemas, schema) => mergedSchemas.concat(schema),
    first,
  );
  return merged;
};
