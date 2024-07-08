import { Pencil } from '@phosphor-icons/react';
import React, { type FC } from 'react';

import { formatText } from '~utils/intl.ts';
import ActionFormRow from '~v5/common/ActionFormRow/index.ts';
import DescriptionField from '~v5/common/ActionSidebar/partials/DescriptionField/index.ts';
import { type CreateActionFormProps } from '~v5/common/ActionSidebar/types.ts';

import { useEnterRecoveryMode } from './hooks.ts';

const displayName = 'v5.common.ActionSidebar.partials.EnterRecoveryModeForm';

const EnterRecoveryModeForm: FC<CreateActionFormProps> = ({
  getFormOptions,
}) => {
  useEnterRecoveryMode(getFormOptions);

  return (
    <ActionFormRow
      icon={Pencil}
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
