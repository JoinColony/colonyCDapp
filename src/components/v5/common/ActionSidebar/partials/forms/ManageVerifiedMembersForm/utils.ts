import { defineMessages } from 'react-intl';
import { array, type InferType, number, object, string } from 'yup';

import { MAX_ANNOTATION_LENGTH } from '~constants';
import { DecisionMethod } from '~types/actions.ts';
import { type Colony } from '~types/graphql.ts';
import { ManageVerifiedMembersOperation } from '~types/index.ts';
import { extractColonyRoles } from '~utils/colonyRoles.ts';
import { extractColonyDomains } from '~utils/domains.ts';
import { formatText } from '~utils/intl.ts';
import { ACTION_BASE_VALIDATION_SCHEMA } from '~v5/common/ActionSidebar/consts.ts';

const MSG = defineMessages({
  membersRequired: {
    id: 'v5.common.ActionSidebar.partials.ManageVerifiedMembersForm.errors.member.required',
    defaultMessage: 'Please select a member',
  },
});

export const getValidationSchema = (
  addressBlacklist: string[],
  errorMessage: string,
) =>
  object()
    .shape({
      createdIn: number().defined(),
      decisionMethod: string().required(
        formatText({ id: 'errors.decisionMethod.required' }),
      ),
      description: string().max(MAX_ANNOTATION_LENGTH).notRequired(),
      members: array().of(
        object()
          .shape({
            value: string().required(formatText(MSG.membersRequired)),
          })
          .test('can-manage-member', errorMessage, (value) => {
            // if no value entered, skip this validation and fallback to required validation
            if (!value?.value) {
              return true;
            }

            return !addressBlacklist.includes(value.value);
          }),
      ),
      manageMembers: string().required(
        formatText({ id: 'errors.manageMembers.required' }),
      ),
    })
    .defined()
    .concat(ACTION_BASE_VALIDATION_SCHEMA);

export type ManageVerifiedMembersFormValues = InferType<
  ReturnType<typeof getValidationSchema>
>;

export const getManageVerifiedMembersPayload = (
  colony: Colony,
  values: ManageVerifiedMembersFormValues,
) => {
  const members = values.members?.map((member) => member?.value);

  const baseDomainPayload = {
    operation:
      values.manageMembers === ManageVerifiedMembersOperation.Add
        ? ManageVerifiedMembersOperation.Add
        : ManageVerifiedMembersOperation.Remove,
    colonyAddress: colony.colonyAddress,
    colonyName: colony.name,
    members,
    customActionTitle: values.title,
    annotationMessage: values.description,
  };

  if (values.decisionMethod === DecisionMethod.Permissions) {
    return baseDomainPayload;
  }

  return {
    ...baseDomainPayload,
    colonyRoles: extractColonyRoles(colony.roles),
    colonyDomains: extractColonyDomains(colony.domains),
    isMultiSig: values.decisionMethod === DecisionMethod.MultiSig,
  };
};
