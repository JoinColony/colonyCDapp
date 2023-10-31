import * as yup from 'yup';
import { MAX_ANNOTATION_LENGTH, MAX_COLONY_DISPLAY_NAME } from '~constants';

export const validationSchema = yup
  .object()
  .shape({
    colonyObjectiveTitle: yup
      .string()
      .trim()
      .max(MAX_COLONY_DISPLAY_NAME)
      .required(() => 'Colony objective title is required'),
    colonyObjectiveDescription: yup
      .string()
      .trim()
      .max(MAX_ANNOTATION_LENGTH)
      .required(() => 'Colony objective description is required'),
    colonyObjectiveProgress: yup
      .number()
      .max(100)
      .required(() => 'Colony objective progress is required'),
    createdIn: yup.string().defined(),
    decisionMethod: yup.string().defined(),
    description: yup.string().max(MAX_ANNOTATION_LENGTH).defined(),
  })
  .defined();

export type ManageColonyObjectivesFormValues = yup.InferType<
  typeof validationSchema
>;
