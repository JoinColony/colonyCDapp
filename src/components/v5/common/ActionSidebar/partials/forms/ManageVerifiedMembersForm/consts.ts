import { array, number, object, string } from 'yup';

import { MAX_ANNOTATION_LENGTH } from '~constants';
import { ManageVerifiedMembersOperation } from '~types';
import { formatText } from '~utils/intl.ts';
import { ACTION_BASE_VALIDATION_SCHEMA } from '~v5/common/ActionSidebar/consts.ts';
import { type CardSelectOption } from '~v5/common/Fields/CardSelect/types.ts';

export const getManageMembersOptions = (): {
  manageMembersOptions: CardSelectOption<ManageVerifiedMembersOperation>[];
} => {
  return {
    manageMembersOptions: [
      {
        label: formatText({ id: 'actionSidebar.option.addMembers' }),
        value: ManageVerifiedMembersOperation.Add,
      },
      {
        label: formatText({ id: 'actionSidebar.option.removeMembers' }),
        value: ManageVerifiedMembersOperation.Remove,
      },
    ],
  };
};

export const validationSchema = object()
  .shape({
    createdIn: number().defined(),
    decisionMethod: string().required(
      formatText({ id: 'errors.decisionMethod.required' }),
    ),
    description: string().max(MAX_ANNOTATION_LENGTH).notRequired(),
    members: array().of(
      object().shape({
        value: string().required('Please select a member'),
      }),
    ),
    manageMembers: string().required(),
  })
  .defined()
  .concat(ACTION_BASE_VALIDATION_SCHEMA);
