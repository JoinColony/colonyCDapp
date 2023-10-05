import React, { FC } from 'react';

import { FormattedMessage, useIntl } from 'react-intl';
import { useEditColonyDetails } from './hooks';
import { ActionFormBaseProps } from '../../../types';
import ColonyDetailsFields from '~v5/common/ActionSidebar/partials/ColonyDetailsFields';
import TeamsSelect from '~v5/common/ActionSidebar/partials/TeamsSelect';
import ActionFormRow from '~v5/common/ActionFormRow';
import { FormCardSelect } from '~v5/common/Fields/CardSelect';
import DescriptionField from '~v5/common/ActionSidebar/partials/DescriptionField';
import { DECISION_METHOD_OPTIONS } from '../../consts';

const displayName = 'v5.common.ActionSidebar.partials.EditColonyDetailsForm';

const EditColonyDetailsForm: FC<ActionFormBaseProps> = ({ getFormOptions }) => {
  const intl = useIntl();

  useEditColonyDetails(getFormOptions);

  return (
    <>
      <ColonyDetailsFields />
      <ActionFormRow
        iconName="house-line"
        fieldName="createdIn"
        tooltip={<FormattedMessage id="actionSidebar.toolip.createdIn" />}
        title={<FormattedMessage id="actionSidebar.createdIn" />}
      >
        <TeamsSelect name="createdIn" />
      </ActionFormRow>
      <ActionFormRow
        iconName="scales"
        fieldName="decisionMethod"
        tooltip={<FormattedMessage id="actionSidebar.toolip.decisionMethod" />}
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
        tooltip={<FormattedMessage id="actionSidebar.toolip.description" />}
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
            fieldName="description"
          />
        )}
      </ActionFormRow>
    </>
  );
};

EditColonyDetailsForm.displayName = displayName;

export default EditColonyDetailsForm;
