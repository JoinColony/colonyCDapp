import { array, type InferType, number, object, string } from 'yup';

import { MAX_ANNOTATION_LENGTH } from '~constants';
import { formatText } from '~utils/intl.ts';
import { ACTION_BASE_VALIDATION_SCHEMA } from '~v5/common/ActionSidebar/consts.ts';
import { type CardSelectOption } from '~v5/common/Fields/CardSelect/types.ts';

export enum ManageMembersType {
  Add = 'Add',
  Remove = 'Remove',
}

export const getManageMembersOptions = (): {
  manageMembersOptions: CardSelectOption<ManageMembersType>[];
} => {
  return {
    manageMembersOptions: [
      {
        label: formatText({ id: 'actionSidebar.option.addMembers' }),
        value: ManageMembersType.Add,
      },
      {
        label: formatText({ id: 'actionSidebar.option.removeMembers' }),
        value: ManageMembersType.Remove,
      },
    ],
  };
};

export const validationSchema = object()
  .shape({
    createdIn: number().defined(),
    decisionMethod: string().defined(),
    description: string().max(MAX_ANNOTATION_LENGTH).notRequired(),
    members: array().of(
      object().shape({
        value: string().required('Please select a member'),
      }),
    ),
    manageMembers: string().defined(),
  })
  .defined()
  .concat(ACTION_BASE_VALIDATION_SCHEMA);

export type ManageVerifiedMembersFormValues = InferType<
  typeof validationSchema
>;
