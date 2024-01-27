import React, { FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext.tsx';
import { formatText } from '~utils/intl.ts';
import ActionFormRow from '~v5/common/ActionFormRow/index.ts';

import DescriptionField from '../DescriptionField/index.ts';

import { DescriptionRowProps } from './types.ts';

const displayName = 'v5.common.ActionSidebar.partials.DescriptionRow';

const DescriptionRow: FC<DescriptionRowProps> = ({ maxDescriptionLength }) => {
  const { readonly } = useAdditionalFormOptionsContext();
  const { watch } = useFormContext();
  const descriptionValue = watch('description');

  return !(readonly && !descriptionValue) ? (
    <ActionFormRow
      icon="pencil"
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
          maxDescriptionLength={maxDescriptionLength}
          fieldName="description"
        />
      )}
    </ActionFormRow>
  ) : null;
};

DescriptionRow.displayName = displayName;

export default DescriptionRow;
