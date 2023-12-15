import React, { FC } from 'react';
import { PaintBucket } from '@phosphor-icons/react';

import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext';
import ActionFormRow from '~v5/common/ActionFormRow';
import TeamColourField from '~v5/common/ActionSidebar/partials/TeamColourField';
import TeamsSelect from '~v5/common/ActionSidebar/partials/TeamsSelect';
import { FormCardSelect } from '~v5/common/Fields/CardSelect';
import FormTextareaBase from '~v5/common/Fields/TextareaBase/FormTextareaBase';
import FormInputBase from '~v5/common/Fields/InputBase/FormInputBase';
import { formatText } from '~utils/intl';
import { MAX_COLONY_DISPLAY_NAME, MAX_DOMAIN_PURPOSE_LENGTH } from '~constants';

import { useCreateNewTeam } from './hooks';
import { ActionFormBaseProps } from '../../../types';
import DescriptionRow from '../../DescriptionRow';
import { useDecisionMethods } from '../../../hooks';

const displayName = 'v5.common.ActionSidebar.partials.CreateNewTeamForm';

const CreateNewTeamForm: FC<ActionFormBaseProps> = ({ getFormOptions }) => {
  const { decisionMethods } = useDecisionMethods();
  const { readonly } = useAdditionalFormOptionsContext();

  useCreateNewTeam(getFormOptions);

  return (
    <>
      <ActionFormRow
        fieldName="teamName"
        icon="user-list"
        isMultiLine
        title={formatText({ id: 'actionSidebar.teamName' })}
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.createNewTeam.team.name',
            }),
          },
        }}
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
        <TeamsSelect name="createdIn" />
      </ActionFormRow>
      <DescriptionRow />
    </>
  );
};

CreateNewTeamForm.displayName = displayName;

export default CreateNewTeamForm;
