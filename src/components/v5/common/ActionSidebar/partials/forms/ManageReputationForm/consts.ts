import { InferType, object, string } from 'yup';
import { MAX_ANNOTATION_LENGTH } from '~constants';
import { formatText } from '~utils/intl';
import { ACTION_BASE_VALIDATION_SCHEMA } from '~v5/common/ActionSidebar/consts';
import { CardSelectOption } from '~v5/common/Fields/CardSelect/types';

export enum ModificationOption {
  AwardReputation = 'AwardReputation',
  RemoveReputation = 'RemoveReputation',
}

export const validationSchema = object()
  .shape({
    member: string().required(),
    // @todo: add validation form max smite value
    amount: string().required(),
    modification: string().required(),
    team: string().required(),
    decisionMethod: string().defined(),
    createdIn: string().required(),
    motionDomainId: string().defined(),
    description: string().max(MAX_ANNOTATION_LENGTH).notRequired(),
  })
  .defined()
  .concat(ACTION_BASE_VALIDATION_SCHEMA);

export type ManageReputationFormValues = InferType<typeof validationSchema>;

export const modificationOptions: CardSelectOption<ModificationOption>[] = [
  {
    label: formatText({
      id: 'actionSidebar.modification.awardReputation',
    }),
    value: ModificationOption.AwardReputation,
  },

  {
    label: formatText({
      id: 'actionSidebar.modification.removeReputation',
    }),
    value: ModificationOption.RemoveReputation,
  },
];
