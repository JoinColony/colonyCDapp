import React, { FC } from 'react';

import { useEnterRecoveryMode } from './hooks';
import { ActionFormBaseProps } from '../../../types';
import ActionFormRow from '~v5/common/ActionFormRow';
import DescriptionField from '~v5/common/ActionSidebar/partials/DescriptionField';
import { formatText } from '~utils/intl';

const displayName = 'v5.common.ActionSidebar.partials.EnterRecoveryModeForm';

const EnterRecoveryModeForm: FC<ActionFormBaseProps> = ({ getFormOptions }) => {
  useEnterRecoveryMode(getFormOptions);

  return (
    <ActionFormRow
      iconName="pencil"
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
