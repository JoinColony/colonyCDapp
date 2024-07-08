import { PlusMinus } from '@phosphor-icons/react';
import React, { type FC } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { type ManageVerifiedMembersOperation } from '~types';
import { formatText } from '~utils/intl.ts';
import ActionFormRow from '~v5/common/ActionFormRow/index.ts';
import useHasNoDecisionMethods from '~v5/common/ActionSidebar/hooks/permissions/useHasNoDecisionMethods.ts';
import CreatedIn from '~v5/common/ActionSidebar/partials/CreatedIn/CreatedIn.tsx';
import DecisionMethodField from '~v5/common/ActionSidebar/partials/DecisionMethodField/DecisionMethodField.tsx';
import Description from '~v5/common/ActionSidebar/partials/Description/Description.tsx';
import VerifiedMembersTable from '~v5/common/ActionSidebar/partials/MembersTable/index.ts';
import { type CreateActionFormProps } from '~v5/common/ActionSidebar/types.ts';
import { FormCardSelect } from '~v5/common/Fields/CardSelect/index.ts';

import { getManageMembersOptions } from './consts.ts';
import { useManageVerifiedMembers } from './hooks.ts';

const displayName =
  'v5.common.ActionSidebar.partials.ManageVerifiedMembersForm';

const ManageVerifiedMembersForm: FC<CreateActionFormProps> = ({
  getFormOptions,
}) => {
  const { manageMembersOptions } = getManageMembersOptions();
  const manageMembers: ManageVerifiedMembersOperation | undefined = useWatch({
    name: 'manageMembers',
  });
  const { resetField } = useFormContext();
  useManageVerifiedMembers(getFormOptions);

  const hasNoDecisionMethods = useHasNoDecisionMethods();

  return (
    <>
      <ActionFormRow
        icon={PlusMinus}
        fieldName="manageMembers"
        title={formatText({ id: 'actionSidebar.manageMembers' })}
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.manageMembers',
            }),
          },
        }}
        isDisabled={hasNoDecisionMethods}
      >
        <FormCardSelect
          name="manageMembers"
          options={manageMembersOptions}
          onChange={() => {
            resetField('members');
          }}
          placeholder={formatText({
            id: 'actionSidebar.manageMembers.placeholder',
          })}
          title={formatText({ id: 'actionSidebar.manageMembers.placeholder' })}
          disabled={hasNoDecisionMethods}
        />
      </ActionFormRow>
      <DecisionMethodField tooltipContent="actionSidebar.manageMembers.decisionMethod" />
      <CreatedIn readonly />
      <Description />
      {manageMembers !== undefined && <VerifiedMembersTable name="members" />}
    </>
  );
};

ManageVerifiedMembersForm.displayName = displayName;

export default ManageVerifiedMembersForm;
