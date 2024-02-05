import { Id } from '@colony/colony-js';
import { PaintBucket } from '@phosphor-icons/react';
import React, { type FC } from 'react';
import { useFormContext } from 'react-hook-form';

import {
  MAX_COLONY_DISPLAY_NAME,
  MAX_DOMAIN_PURPOSE_LENGTH,
} from '~constants/index.ts';
import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext.tsx';
import { formatText } from '~utils/intl.ts';
import ActionFormRow from '~v5/common/ActionFormRow/index.ts';
import TeamColorField from '~v5/common/ActionSidebar/partials/TeamColorField/index.ts';
import TeamsSelect from '~v5/common/ActionSidebar/partials/TeamsSelect/index.ts';
import { FormCardSelect } from '~v5/common/Fields/CardSelect/index.ts';
import FormInputBase from '~v5/common/Fields/InputBase/FormInputBase.tsx';
import FormTextareaBase from '~v5/common/Fields/TextareaBase/FormTextareaBase.tsx';

import { useDecisionMethods } from '../../../hooks/index.ts';
import { type ActionFormBaseProps } from '../../../types.ts';
import CreatedInRow from '../../CreatedInRow/CreatedInRow.tsx';
import DescriptionRow from '../../DescriptionRow/index.ts';

import { useEditTeam } from './hooks.ts';

const displayName = 'v5.common.ActionSidebar.partials.EditTeamForm';

const EditTeamForm: FC<ActionFormBaseProps> = ({ getFormOptions }) => {
  const { readonly } = useAdditionalFormOptionsContext();
  const { decisionMethods } = useDecisionMethods();
  const { watch } = useFormContext();

  useEditTeam(getFormOptions);
  const selectedTeam = watch('team');

  return (
    <>
      <ActionFormRow
        icon="house-line"
        fieldName="team"
        title={formatText({ id: 'actionSidebar.team' })}
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.editTeam.selectTeam',
            }),
          },
        }}
      >
        <TeamsSelect
          name="team"
          filterOptionsFn={(option) =>
            option.value !== Id.RootDomain.toString()
          }
        />
      </ActionFormRow>
      <ActionFormRow
        fieldName="teamName"
        icon="user-list"
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.editTeam.team.name',
            }),
          },
        }}
        title={formatText({ id: 'actionSidebar.teamName' })}
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
        />
      </ActionFormRow>
      <ActionFormRow
        icon="rocket"
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
      >
        <FormTextareaBase
          message={false}
          name="domainPurpose"
          placeholder={formatText({
            id: 'actionSidebar.placeholder.purpose',
          })}
          maxLength={MAX_DOMAIN_PURPOSE_LENGTH}
        />
      </ActionFormRow>
      <ActionFormRow
        icon={<PaintBucket size={12} />}
        fieldName="domainColor"
        title={formatText({ id: 'actionSidebar.teamColour' })}
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.createNewTeam.team.colour',
            }),
          },
        }}
      >
        <TeamColorField name="domainColor" />
      </ActionFormRow>
      <ActionFormRow
        icon="scales"
        fieldName="decisionMethod"
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.decisionMethod',
            }),
          },
        }}
        title={formatText({ id: 'actionSidebar.decisionMethod' })}
      >
        <FormCardSelect
          name="decisionMethod"
          options={decisionMethods}
          placeholder={formatText({
            id: 'actionSidebar.decisionMethod.placeholder',
          })}
          title={formatText({ id: 'actionSidebar.availableDecisions' })}
        />
      </ActionFormRow>

      <CreatedInRow
        filterOptionsFn={(option) =>
          option.value === Id.RootDomain.toString() ||
          option.value === selectedTeam
        }
      />
      <DescriptionRow />
    </>
  );
};

EditTeamForm.displayName = displayName;

export default EditTeamForm;
