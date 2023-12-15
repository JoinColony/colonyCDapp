import React, { FC } from 'react';
import { Id } from '@colony/colony-js';
import { useFormContext } from 'react-hook-form';
import { PaintBucket } from '@phosphor-icons/react';

import { formatText } from '~utils/intl';
import ActionFormRow from '~v5/common/ActionFormRow';
import { FormCardSelect } from '~v5/common/Fields/CardSelect';
import TeamsSelect from '~v5/common/ActionSidebar/partials/TeamsSelect';
import TeamColourField from '~v5/common/ActionSidebar/partials/TeamColourField';
import FormTextareaBase from '~v5/common/Fields/TextareaBase/FormTextareaBase';
import FormInputBase from '~v5/common/Fields/InputBase/FormInputBase';
import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext';
import { MAX_DOMAIN_PURPOSE_LENGTH } from '~constants';

import { useEditTeam } from './hooks';
import { ActionFormBaseProps } from '../../../types';
import { DecisionMethod, useDecisionMethods } from '../../../hooks';
import DescriptionRow from '../../DescriptionRow';

const displayName = 'v5.common.ActionSidebar.partials.EditTeamForm';

const EditTeamForm: FC<ActionFormBaseProps> = ({ getFormOptions }) => {
  const { readonly } = useAdditionalFormOptionsContext();
  const { decisionMethods } = useDecisionMethods();
  const { watch } = useFormContext();

  useEditTeam(getFormOptions);
  const selectedDecisionMethod = watch('decisionMethod');
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
          name="teamName"
          placeholder={formatText({
            id: 'actionSidebar.placeholder.teamName',
          })}
          mode="secondary"
          readOnly={readonly}
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
        <TeamColourField name="domainColor" />
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
          title={formatText({ id: 'actionSidebar.decisionMethod' })}
        />
      </ActionFormRow>
      {selectedDecisionMethod &&
        selectedDecisionMethod === DecisionMethod.Reputation && (
          <ActionFormRow
            icon="house-line"
            fieldName="createdIn"
            tooltips={{
              label: {
                tooltipContent: formatText({
                  id: 'actionSidebar.tooltip.createdIn',
                }),
              },
            }}
            title={formatText({ id: 'actionSidebar.createdIn' })}
          >
            <TeamsSelect
              name="createdIn"
              filterOptionsFn={(option) =>
                option.value === Id.RootDomain.toString() ||
                option.value === selectedTeam
              }
            />
          </ActionFormRow>
        )}
      <DescriptionRow />
    </>
  );
};

EditTeamForm.displayName = displayName;

export default EditTeamForm;
