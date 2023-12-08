import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext';
import { formatText } from '~utils/intl';
import ActionFormRow from '~v5/common/ActionFormRow';
import DescriptionField from '../DescriptionField';

const displayName = 'v5.common.ActionSidebar.partials.DescriptionRow';

const DescriptionRow = () => {
  const { readonly, isActionPending } = useAdditionalFormOptionsContext();
  const { watch } = useFormContext();
  const descriptionValue = watch('description');

  return !((readonly || isActionPending) && !descriptionValue) ? (
    <ActionFormRow
      iconName="pencil"
      fieldName="description"
      // Tooltip disabled to experiment with improving user experience
      // tooltips={{
      //   label: {
      //     tooltipContent: formatMessage({
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
  ) : null;
};

DescriptionRow.displayName = displayName;

export default DescriptionRow;
