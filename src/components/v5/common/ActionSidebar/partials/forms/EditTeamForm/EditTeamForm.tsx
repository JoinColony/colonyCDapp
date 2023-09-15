import React, { FC } from 'react';

import { FormattedMessage, useIntl } from 'react-intl';
import { useEditTeam } from './hooks';
import { ActionFormBaseProps } from '../../../types';
import DescriptionField from '~v5/common/ActionSidebar/partials/DescriptionField';
import ActionFormRow from '~v5/common/ActionFormRow';
import { FormCardSelect } from '~v5/common/Fields/CardSelect';
import TeamsSelect from '~v5/common/ActionSidebar/partials/TeamsSelect';
import TeamColourField from '~v5/common/ActionSidebar/partials/TeamColourField';
import DefaultField from '~v5/common/ActionSidebar/partials/DefaultField';
import { DECISION_METHOD_OPTIONS } from '../../consts';

const displayName = 'v5.common.ActionSidebar.partials.EditTeamForm';

const EditTeamForm: FC<ActionFormBaseProps> = ({ getFormOptions }) => {
  const intl = useIntl();

  useEditTeam(getFormOptions);

  return (
    <>
      <ActionFormRow
        iconName="house-line"
        fieldName="team"
        title={<FormattedMessage id="actionSidebar.team" />}
      >
        <TeamsSelect name="team" />
      </ActionFormRow>
      <ActionFormRow
        fieldName="teamName"
        iconName="user-list"
        title={<FormattedMessage id="actionSidebar.teamName" />}
      >
        <DefaultField
          name="teamName"
          placeholder={intl.formatMessage({
            id: 'actionSidebar.placeholder.teamName',
          })}
        />
      </ActionFormRow>
      <ActionFormRow
        iconName="rocket"
        fieldName="domainPurpose"
        title={<FormattedMessage id="actionSidebar.teamPurpose" />}
      >
        <DefaultField
          name="domainPurpose"
          placeholder={intl.formatMessage({
            id: 'actionSidebar.placeholder.purpose',
          })}
        />
      </ActionFormRow>
      <ActionFormRow
        iconName="paint"
        fieldName="domainColor"
        title={<FormattedMessage id="actionSidebar.teamColour" />}
      >
        <TeamColourField name="domainColor" />
      </ActionFormRow>
      <ActionFormRow
        iconName="house-line"
        fieldName="createdIn"
        title={<FormattedMessage id="actionSidebar.createdIn" />}
      >
        <TeamsSelect name="createdIn" />
      </ActionFormRow>
      <ActionFormRow
        iconName="scales"
        fieldName="decisionMethod"
        title={<FormattedMessage id="actionSidebar.decisionMethod" />}
      >
        <FormCardSelect
          name="decisionMethod"
          options={DECISION_METHOD_OPTIONS}
          title={intl.formatMessage({ id: 'actionSidebar.decisionMethod' })}
        />
      </ActionFormRow>
      <ActionFormRow
        iconName="pencil"
        fieldName="description"
        title={<FormattedMessage id="actionSidebar.description" />}
        isExpandable
      >
        {([
          isDecriptionFieldExpanded,
          {
            toggleOff: toggleOffDecriptionSelect,
            toggleOn: toggleOnDecriptionSelect,
          },
        ]) => (
          <DescriptionField
            isDecriptionFieldExpanded={isDecriptionFieldExpanded}
            toggleOffDecriptionSelect={toggleOffDecriptionSelect}
            toggleOnDecriptionSelect={toggleOnDecriptionSelect}
            fieldName="annotation"
          />
        )}
      </ActionFormRow>
    </>
  );
};

EditTeamForm.displayName = displayName;

export default EditTeamForm;
