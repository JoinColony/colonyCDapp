import { array, InferType, object, string, number } from 'yup';

import { ACTION_BASE_VALIDATION_SCHEMA } from '~v5/common/ActionSidebar/consts';

export const validationSchema = object()
  .shape({
    createdIn: number().defined(),
    decisionMethod: string().defined(),
    selectedTokenAddresses: array()
      .of(
        object()
          .shape({
            token: string().required(),
          })
          .required(),
      )
      .unique('Duplicate tokens are not allowed.', ({ token }) => token)
      .defined(),
  })
  .defined()
  .concat(ACTION_BASE_VALIDATION_SCHEMA);

export type ManageTokensFormValues = InferType<typeof validationSchema>;
