import * as yup from 'yup';

import { formatText } from '~utils/intl';
import { MAX_ANNOTATION_LENGTH, MAX_COLONY_DISPLAY_NAME } from '~constants';

export const validationSchema = yup
  .object()
  .shape({
    colonyObjectiveTitle: yup
      .string()
      .trim()
      .max(MAX_COLONY_DISPLAY_NAME)
      .required(() => formatText({ id: 'errors.colonyObjective.title' })),
    colonyObjectiveDescription: yup
      .string()
      .trim()
      .max(MAX_ANNOTATION_LENGTH)
      .required(() => formatText({ id: 'errors.colonyObjective.description' })),
    colonyObjectiveProgress: yup
      .number()
      .max(100)
      .required(() => formatText({ id: 'errors.colonyObjective.progress' })),
    createdIn: yup.string().defined(),
    decisionMethod: yup.string().defined(),
    description: yup.string().max(MAX_ANNOTATION_LENGTH).defined(),
  })
  .defined();

export type ManageColonyObjectivesFormValues = yup.InferType<
  typeof validationSchema
>;
