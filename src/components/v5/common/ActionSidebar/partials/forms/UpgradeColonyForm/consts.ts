import * as yup from 'yup';
import { MAX_ANNOTATION_LENGTH } from '~constants';
import { ACTION_BASE_VALIDATION_SCHEMA } from '~v5/common/ActionSidebar/consts';

export const validationSchema = yup
  .object()
  .shape({
    createdIn: yup.string().defined(),
    decisionMethod: yup.string().defined(),
    annotation: yup.string().max(MAX_ANNOTATION_LENGTH).defined(),
  })
  .defined()
  .concat(ACTION_BASE_VALIDATION_SCHEMA);

export type UpgradeColonyFormValues = yup.InferType<typeof validationSchema>;
