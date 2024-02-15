import { Pencil, UsersThree } from '@phosphor-icons/react';
import React, { type FC } from 'react';

import { formatText } from '~utils/intl.ts';
import ActionFormRow from '~v5/common/ActionFormRow/index.ts';
import DescriptionField from '~v5/common/ActionSidebar/partials/DescriptionField/index.ts';
import TeamsSelect from '~v5/common/ActionSidebar/partials/TeamsSelect/index.ts';

import { type ActionFormBaseProps } from '../../../types.ts';
import BatchPaymentsTable from '../../BatchPaymentsTable/index.ts';
import CreatedInRow from '../../CreatedInRow/CreatedInRow.tsx';
import DecisionMethodField from '../../DecisionMethodField/index.ts';

const displayName = 'v5.common.ActionSidebar.partials.BatchPaymentForm';

const BatchPaymentForm: FC<ActionFormBaseProps> = () => {
  return (
    <>
      <ActionFormRow
        icon={UsersThree}
        fieldName="from"
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.simplePayment.from',
            }),
          },
        }}
        title={formatText({ id: 'actionSidebar.from' })}
      >
        <TeamsSelect name="from" />
      </ActionFormRow>
      <DecisionMethodField />
      <CreatedInRow />
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
            fieldName="annotation"
          />
        )}
      </ActionFormRow>
      <BatchPaymentsTable name="payments" />
    </>
  );
};

BatchPaymentForm.displayName = displayName;

export default BatchPaymentForm;
