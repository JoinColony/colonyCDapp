import * as yup from 'yup';
import { MAX_ANNOTATION_LENGTH } from '~constants';

export const validationSchema = yup
  .object()
  .shape({
    createdIn: yup.string().defined(),
    decisionMethod: yup.string().defined(),
    description: yup.string().max(MAX_ANNOTATION_LENGTH).defined(),
  })
  .defined();

export type EnterRecoveryModeFormValues = yup.InferType<
  typeof validationSchema
>;
