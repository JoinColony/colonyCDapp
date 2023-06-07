import { defineMessages } from 'react-intl';
import { InferType, array, boolean, object, string } from 'yup';
import { Colony, Token } from '~types';
import { notNull } from '~utils/arrays';
import { formatText } from '~utils/intl';
import { createAddress, isAddress } from '~utils/web3';

const displayName = 'common.TokenManagementDialog';

const MSG = defineMessages({
  errorAddingToken: {
    id: `${displayName}.errorAddingToken`,
    defaultMessage: `Sorry, there was an error adding this token. Learn more about tokens at: https://colony.io.`,
  },
  invalidAddress: {
    id: `${displayName}.invalidAddress`,
    defaultMessage: 'This is not a valid address',
  },
  tokenNotFound: {
    id: `${displayName}.tokenNotFound`,
    defaultMessage:
      'Token data not found. Please check the token contract address.',
  },
  tokenIsDuplicate: {
    id: `${displayName}.tokenIsDuplicate`,
    defaultMessage: 'This token already exists in this colony.',
  },
});

export const getValidationSchema = (colony: Colony) =>
  object({
    forceAction: boolean().defined(),
    tokenAddress: string()
      .notRequired()
      .test(
        'is-address',
        () => MSG.invalidAddress,
        (value) => !value || isAddress(value),
      )
      .test(
        'is-duplicate',
        () => MSG.tokenIsDuplicate,
        (value) => {
          // skip this test if value is not valid.
          if (!value || !isAddress(value)) {
            return true;
          }

          return !colony.tokens?.items
            .filter(notNull)
            .some(
              ({ token: { tokenAddress } }) =>
                createAddress(tokenAddress) === createAddress(value),
            );
        },
      ),
    token: object<Token>()
      .nullable()
      .test('doesTokenExist', '', function doesTokenExist(value, context) {
        if (!context.parent.tokenAddress || !!value) {
          // Skip validation if tokenAddress is empty or token has been found
          return true;
        }

        return this.createError({
          message: formatText(MSG.tokenNotFound),
          path: 'tokenAddress',
        });
      }),
    selectedTokenAddresses: array()
      .of(string().address().defined())
      .notRequired(),
    annotationMessage: string().max(4000).notRequired(),
  }).defined();

export type FormValues = InferType<ReturnType<typeof getValidationSchema>>;
