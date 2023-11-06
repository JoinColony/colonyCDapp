import { defineMessages } from 'react-intl';
import * as yup from 'yup';

import { formatText } from '~utils/intl';
import { MAX_ANNOTATION_LENGTH, MAX_COLONY_DISPLAY_NAME } from '~constants';

import { displayName } from './ManageColonyObjectivesForm';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    description: 'Colony objective title is required',
  },
  description: {
    id: `${displayName}.description`,
    description: 'Colony objective description is required',
  },
  progress: {
    id: `${displayName}.progress`,
    description: 'Colony objective progress is required',
  },
});

export const validationSchema = yup
  .object()
  .shape({
    colonyObjectiveTitle: yup
      .string()
      .trim()
      .max(MAX_COLONY_DISPLAY_NAME)
      .required(() => formatText(MSG.title)),
    colonyObjectiveDescription: yup
      .string()
      .trim()
      .max(MAX_ANNOTATION_LENGTH)
      .required(() => formatText(MSG.description)),
    colonyObjectiveProgress: yup
      .number()
      .max(100)
      .required(() => formatText(MSG.progress)),
    createdIn: yup.string().defined(),
    decisionMethod: yup.string().defined(),
    description: yup.string().max(MAX_ANNOTATION_LENGTH).defined(),
  })
  .defined();

export type ManageColonyObjectivesFormValues = yup.InferType<
  typeof validationSchema
>;
