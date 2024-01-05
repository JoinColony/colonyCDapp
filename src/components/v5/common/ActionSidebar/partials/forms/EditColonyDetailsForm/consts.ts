import { object, string, array, InferType } from 'yup';

import {
  MAX_ANNOTATION_LENGTH,
  MAX_COLONY_DISPLAY_NAME,
  MAX_OBJECTIVE_DESCRIPTION_LENGTH,
} from '~constants';
import { ExternalLinks } from '~gql';
import { ACTION_BASE_VALIDATION_SCHEMA } from '~v5/common/ActionSidebar/consts';

export const validationSchema = object()
  .shape({
    avatar: object().nullable().shape({
      image: string().nullable().defined(),
      thumbnail: string().nullable().defined(),
    }),
    colonyName: string().trim().max(MAX_COLONY_DISPLAY_NAME),
    createdIn: string().defined(),
    decisionMethod: string().defined(),
    description: string().max(MAX_ANNOTATION_LENGTH).notRequired(),
    colonyDescription: string().max(MAX_OBJECTIVE_DESCRIPTION_LENGTH),
    externalLinks: array()
      .of(
        object()
          .shape({
            name: string().defined().oneOf(Object.values(ExternalLinks)),
            link: string().url().required(),
          })
          .defined(),
      )
      .required(),
  })
  .defined()
  .concat(ACTION_BASE_VALIDATION_SCHEMA);

export type EditColonyDetailsFormValues = InferType<typeof validationSchema>;
