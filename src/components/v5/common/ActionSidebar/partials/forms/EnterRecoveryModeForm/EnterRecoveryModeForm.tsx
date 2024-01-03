import React, { FC } from 'react';

import { formatText } from '~utils/intl';
import ActionFormRow from '~v5/common/ActionFormRow';
import DescriptionField from '~v5/common/ActionSidebar/partials/DescriptionField';

import { ActionFormBaseProps } from '../../../types';

import { useEnterRecoveryMode } from './hooks';

const displayName = 'v5.common.ActionSidebar.partials.EnterRecoveryModeForm';

const EnterRecoveryModeForm: FC<ActionFormBaseProps> = ({ getFormOptions }) => {
  useEnterRecoveryMode(getFormOptions);

  return (
    <ActionFormRow
      icon="pencil"
      fieldName="description"
      // Tooltip disabled to experiment with improving user experience
      // tooltips={{
      //   label: {
      //     tooltipContent: formatText({
      //       id: 'actionSidebar.tooltip.description',
      //     }),
      //   },
      // }}
      title={formatText({ id: 'actionSidebar.description' })}
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
