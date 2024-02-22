import { Pencil } from '@phosphor-icons/react';
import React, { type FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext.tsx';
import { formatText } from '~utils/intl.ts';
import ActionFormRow from '~v5/common/ActionFormRow/index.ts';

import { DESCRIPTION_FIELD_NAME } from '../../consts.tsx';
import { useHasNoDecisionMethods } from '../../hooks/index.ts';
import DescriptionField from '../DescriptionField/index.ts';

import { type DescriptionProps } from './types.ts';

const displayName = 'v5.common.ActionSidebar.partials.Description';

const Description: FC<DescriptionProps> = ({
  disabled,
  maxDescriptionLength,
}) => {
  const hasNoDecisionMethods = useHasNoDecisionMethods();
  const { readonly } = useAdditionalFormOptionsContext();
  const { watch } = useFormContext();
  const descriptionValue = watch(DESCRIPTION_FIELD_NAME);

  return !(readonly && !descriptionValue) ? (
    <ActionFormRow
      icon={Pencil}
      fieldName={DESCRIPTION_FIELD_NAME}
      // Tooltip disabled to experiment with improving user experience
      // tooltips={{
      //   label: {
      //     tooltipContent: formatMessage({
      //       id: 'actionSidebar.tooltip.description',
      //     }),
      //   },
      // }}
      title={formatText({ id: 'actionSidebar.description' })}
      isExpandable={!(disabled || hasNoDecisionMethods)}
      isDisabled={disabled || hasNoDecisionMethods}
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
          fieldName={DESCRIPTION_FIELD_NAME}
          disabled={disabled || hasNoDecisionMethods}
        />
      )}
    </ActionFormRow>
  ) : null;
};

Description.displayName = displayName;

export default Description;
