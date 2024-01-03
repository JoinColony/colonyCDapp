import { array, InferType, object, string } from 'yup';

import { MAX_ANNOTATION_LENGTH } from '~constants';
import { ACTION_BASE_VALIDATION_SCHEMA } from '~v5/common/ActionSidebar/consts';

export const validationSchema = object()
  .shape({
    createdIn: string().defined(),
    decisionMethod: string().defined(),
    description: string().max(MAX_ANNOTATION_LENGTH).notRequired(),
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
