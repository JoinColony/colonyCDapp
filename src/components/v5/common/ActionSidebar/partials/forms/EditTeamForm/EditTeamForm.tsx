import { Id } from '@colony/colony-js';
import {
  HouseLine,
  PaintBucket,
  Rocket,
  UserList,
} from '@phosphor-icons/react';
import React, { type FC } from 'react';
import { useFormContext } from 'react-hook-form';

import {
  MAX_COLONY_DISPLAY_NAME,
  MAX_DOMAIN_PURPOSE_LENGTH,
} from '~constants/index.ts';
import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext.tsx';
import { formatText } from '~utils/intl.ts';
import ActionFormRow from '~v5/common/ActionFormRow/index.ts';
import { useHasNoDecisionMethods } from '~v5/common/ActionSidebar/hooks/index.ts';
import TeamColorField from '~v5/common/ActionSidebar/partials/TeamColorField/index.ts';
import TeamsSelect from '~v5/common/ActionSidebar/partials/TeamsSelect/index.ts';
import FormInputBase from '~v5/common/Fields/InputBase/FormInputBase.tsx';
import FormTextareaBase from '~v5/common/Fields/TextareaBase/FormTextareaBase.tsx';

import { type ActionFormBaseProps } from '../../../types.ts';
import CreatedIn from '../../CreatedIn/index.ts';
import DecisionMethodField from '../../DecisionMethodField/index.ts';
import Description from '../../Description/index.ts';

import { useEditTeam } from './hooks.ts';

const displayName = 'v5.common.ActionSidebar.partials.EditTeamForm';

const EditTeamForm: FC<ActionFormBaseProps> = ({ getFormOptions }) => {
  const { readonly } = useAdditionalFormOptionsContext();
  const { watch } = useFormContext();

  useEditTeam(getFormOptions);
  const selectedTeam = watch('team');

  const hasNoDecisionMethods = useHasNoDecisionMethods();

  return (
    <>
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
      <CreatedIn
        filterOptionsFn={(option) =>
          option.value === Id.RootDomain.toString() ||
          option.value === selectedTeam
        }
      />
      <Description />
    </>
  );
};

EditTeamForm.displayName = displayName;

export default EditTeamForm;
