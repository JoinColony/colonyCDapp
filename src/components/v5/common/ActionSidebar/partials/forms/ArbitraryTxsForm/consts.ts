import { array, type InferType, object, string } from 'yup';

import getLastIndexFromPath from '~utils/getLastIndexFromPath.ts';
import { formatText } from '~utils/intl.ts';
import { ACTION_BASE_VALIDATION_SCHEMA } from '~v5/common/ActionSidebar/consts.ts';

export const validationSchema = object()
  .shape({
    title: string()
      .trim()
      .required(() => 'Please enter a title.'),
    decisionMethod: string().required(
      formatText({ id: 'errors.decisionMethod.required' }),
    ),
    transactions: array()
      .of(
        object()
          .shape({
            contractAddress: string().required(({ path }) => {
              const index = getLastIndexFromPath(path);
              if (index === undefined) {
                return formatText({
                  id: 'errors.arbitrary.contractAddressRequired',
                });
              }
              return formatText(
                {
                  id: 'errors.arbitrary.contractAddressRequiredIn',
                },
                {
                  arbitraryIndex: index + 1,
                },
              );
            }),
            jsonAbi: string().required(({ path }) => {
              const index = getLastIndexFromPath(path);
              if (index === undefined) {
                return formatText({ id: 'errors.arbitrary.jsonABIRequired' });
              }
              return formatText(
                {
                  id: 'errors.arbitrary.jsonABIRequiredIn',
                },
                {
                  arbitraryIndex: index + 1,
                },
              );
            }),
            method: string().required(({ path }) => {
              const index = getLastIndexFromPath(path);
              if (index === undefined) {
                return formatText({ id: 'errors.arbitrary.methodRequired' });
              }
              return formatText(
                {
                  id: 'errors.arbitrary.methodRequiredIn',
                },
                {
                  arbitraryIndex: index + 1,
                },
              );
            }),
            args: array().of(
              object().shape({
                value: string().required(
                  formatText({ id: 'validation.required' }),
                ),
                name: string().required(
                  formatText({ id: 'validation.required' }),
                ),
              }),
            ),
          })
          .defined(),
      )
      .required(formatText({ id: 'errors.transactions.required' })),
  })
  .defined()
  .concat(ACTION_BASE_VALIDATION_SCHEMA);

export type CreateArbitraryTxsFormValues = InferType<typeof validationSchema>;
