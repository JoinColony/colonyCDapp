import { isAddress } from 'ethers/lib/utils';
import { array, type InferType, object, string, number } from 'yup';

import getLastIndexFromPath from '~utils/getLastIndexFromPath.ts';
import { formatText } from '~utils/intl.ts';
import { ACTION_BASE_VALIDATION_SCHEMA } from '~v5/common/ActionSidebar/consts.ts';
import { TokenStatus } from '~v5/common/types.ts';

export const validationSchema = object()
  .shape({
    createdIn: number().defined(),
    decisionMethod: string().required(
      formatText({ id: 'errors.decisionMethod.required' }),
    ),
    selectedTokenAddresses: array()
      .of(
        object()
          .shape({
            token: string()
              .test(
                'is-address',
                ({ path }) => {
                  const index = getLastIndexFromPath(path);

                  return formatText(
                    { id: 'errors.token.notValid' },
                    { paymentIndex: index === undefined ? 1 : index + 1 },
                  );
                },
                (value) => {
                  if (!value) {
                    return true;
                  }

                  return isAddress(value);
                },
              )
              .required(({ path }) => {
                const index = getLastIndexFromPath(path);

                return formatText(
                  { id: 'errors.token.emptyIndex' },
                  { tokenIndex: index === undefined ? 1 : index + 1 },
                );
              }),
            status: string().oneOf(Object.values(TokenStatus)).required(),
          })
          .test('duplicate', '', (value, context) => {
            if (!value) {
              return true;
            }

            const { parent } = context;
            const duplicates = parent.filter(
              ({ token }) => token === value.token,
            );

            if (duplicates.length < 2) {
              return true;
            }

            const index = getLastIndexFromPath(context.path);

            return context.createError({
              path: `${context.path}.token`,
              message: formatText(
                { id: 'errors.token.duplicateIndex' },
                { tokenIndex: index === undefined ? 1 : index + 1 },
              ),
            });
          })
          .required(),
      )
      .some(
        formatText({ id: 'validation.noChangesInTheTable' }),
        ({ status }) =>
          [TokenStatus.Added, TokenStatus.Removed].includes(status),
      )
      .defined(),
  })
  .defined()
  .concat(ACTION_BASE_VALIDATION_SCHEMA);

export type ManageTokensFormValues = InferType<typeof validationSchema>;
