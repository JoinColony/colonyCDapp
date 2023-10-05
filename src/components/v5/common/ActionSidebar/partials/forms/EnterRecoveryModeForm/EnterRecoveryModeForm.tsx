import React, { FC } from 'react';

import { FormattedMessage } from 'react-intl';
import { useEnterRecoveryMode } from './hooks';
import { ActionFormBaseProps } from '../../../types';
import ActionFormRow from '~v5/common/ActionFormRow';
import DescriptionField from '~v5/common/ActionSidebar/partials/DescriptionField';

const displayName = 'v5.common.ActionSidebar.partials.EnterRecoveryModeForm';

const EnterRecoveryModeForm: FC<ActionFormBaseProps> = ({ getFormOptions }) => {
  useEnterRecoveryMode(getFormOptions);

  return (
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
  );
};

EnterRecoveryModeForm.displayName = displayName;

export default EnterRecoveryModeForm;
