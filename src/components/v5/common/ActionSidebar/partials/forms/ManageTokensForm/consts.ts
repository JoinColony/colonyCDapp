import * as yup from 'yup';
import { MAX_ANNOTATION_LENGTH } from '~constants';
import { ACTION_BASE_VALIDATION_SCHEMA } from '~v5/common/ActionSidebar/consts';

export const validationSchema = yup
  .object()
  .shape({
    createdIn: yup.string().defined(),
    decisionMethod: yup.string().defined(),
    annotation: yup.string().max(MAX_ANNOTATION_LENGTH).defined(),
    selectedTokenAddresses: yup
      .array()
      .of(
        yup
          .object()
          .shape({
            token: yup.string().required(),
          })
          .required(),
      )
      .unique('Duplicate tokens are not allowed', ({ token }) => token)
      .defined(),
  })
  .defined()
  .concat(ACTION_BASE_VALIDATION_SCHEMA);

export type ManageTokensFormValues = yup.InferType<typeof validationSchema>;
