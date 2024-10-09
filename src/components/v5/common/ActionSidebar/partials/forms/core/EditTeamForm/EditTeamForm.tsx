import { Id } from '@colony/colony-js';
import {
  HouseLine,
  PaintBucket,
  Rocket,
  UserList,
} from '@phosphor-icons/react';
import React, { type FC } from 'react';

import {
  MAX_COLONY_DISPLAY_NAME,
  MAX_DOMAIN_PURPOSE_LENGTH,
} from '~constants/index.ts';
import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext.ts';
import { formatText } from '~utils/intl.ts';
import ActionFormRow from '~v5/common/ActionFormRow/index.ts';
import useHasNoDecisionMethods from '~v5/common/ActionSidebar/hooks/permissions/useHasNoDecisionMethods.ts';
import useFilterCreatedInField from '~v5/common/ActionSidebar/hooks/useFilterCreatedInField.ts';
import ActionFormLayout from '~v5/common/ActionSidebar/partials/ActionFormLayout/ActionFormLayout.tsx';
import CreatedIn from '~v5/common/ActionSidebar/partials/CreatedIn/index.ts';
import DecisionMethodField from '~v5/common/ActionSidebar/partials/DecisionMethodField/index.ts';
import Description from '~v5/common/ActionSidebar/partials/Description/index.ts';
import TeamColorField from '~v5/common/ActionSidebar/partials/TeamColorField/index.ts';
import TeamsSelect from '~v5/common/ActionSidebar/partials/TeamsSelect/index.ts';
import { type CreateActionFormProps } from '~v5/common/ActionSidebar/types.ts';
import FormInputBase from '~v5/common/Fields/InputBase/FormInputBase.tsx';
import FormTextareaBase from '~v5/common/Fields/TextareaBase/FormTextareaBase.tsx';

import { useEditTeam } from './hooks.ts';

const displayName = 'v5.common.ActionSidebar.EditTeamForm';

const EditTeamForm: FC<CreateActionFormProps> = ({ getFormOptions }) => {
  const { readonly } = useAdditionalFormOptionsContext();

  useEditTeam(getFormOptions);

  const hasNoDecisionMethods = useHasNoDecisionMethods();
  const createdInFilterFn = useFilterCreatedInField('team');

  return (
    <ActionFormLayout>
      <ActionFormRow
        icon={HouseLine}
        fieldName="team"
        title={formatText({ id: 'actionSidebar.team' })}
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.editTeam.selectTeam',
            }),
          },
        }}
        isDisabled={hasNoDecisionMethods}
      >
        <TeamsSelect
          name="team"
          filterOptionsFn={(option) =>
            option.value !== Id.RootDomain.toString()
          }
          disabled={hasNoDecisionMethods}
        />
      </ActionFormRow>
      <ActionFormRow
        fieldName="teamName"
        icon={UserList}
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.editTeam.team.name',
            }),
          },
        }}
        title={formatText({ id: 'actionSidebar.teamName' })}
        isDisabled={hasNoDecisionMethods}
      >
        <FormInputBase
          message={false}
          name="teamName"
          placeholder={formatText({
            id: 'actionSidebar.placeholder.teamName',
          })}
          mode="secondary"
          readOnly={readonly}
          maxLength={MAX_COLONY_DISPLAY_NAME}
          disabled={hasNoDecisionMethods}
        />
      </ActionFormRow>
      <ActionFormRow
        icon={Rocket}
        fieldName="domainPurpose"
        title={formatText({ id: 'actionSidebar.teamPurpose' })}
        isMultiLine
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.createNewTeam.team.purpose',
            }),
          },
        }}
        isDisabled={hasNoDecisionMethods}
      >
        <FormTextareaBase
          message={false}
          name="domainPurpose"
          placeholder={formatText({
            id: 'actionSidebar.placeholder.purpose',
          })}
          maxLength={MAX_DOMAIN_PURPOSE_LENGTH}
          disabled={hasNoDecisionMethods}
        />
      </ActionFormRow>
      <ActionFormRow
        icon={PaintBucket}
        fieldName="domainColor"
        title={formatText({ id: 'actionSidebar.teamColour' })}
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.createNewTeam.team.colour',
            }),
          },
        }}
        isDisabled={hasNoDecisionMethods}
      >
        <TeamColorField name="domainColor" disabled={hasNoDecisionMethods} />
      </ActionFormRow>
      <DecisionMethodField />
      <CreatedIn filterOptionsFn={createdInFilterFn} />
      <Description />
    </ActionFormLayout>
  );
};

EditTeamForm.displayName = displayName;

export default EditTeamForm;
