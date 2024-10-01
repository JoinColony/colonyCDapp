import { Pencil, UsersThree } from '@phosphor-icons/react';
import React, { type FC } from 'react';

import { formatText } from '~utils/intl.ts';
import ActionFormRow from '~v5/common/ActionFormRow/index.ts';
import useFilterCreatedInField from '~v5/common/ActionSidebar/hooks/useFilterCreatedInField.ts';
import ActionFormLayout from '~v5/common/ActionSidebar/partials/ActionFormLayout/ActionFormLayout.tsx';
import BatchPaymentsTable from '~v5/common/ActionSidebar/partials/BatchPaymentsTable/index.ts';
import CreatedIn from '~v5/common/ActionSidebar/partials/CreatedIn/index.ts';
import DecisionMethodField from '~v5/common/ActionSidebar/partials/DecisionMethodField/index.ts';
import DescriptionField from '~v5/common/ActionSidebar/partials/DescriptionField/index.ts';
import TeamsSelect from '~v5/common/ActionSidebar/partials/TeamsSelect/index.ts';
import { type CreateActionFormProps } from '~v5/common/ActionSidebar/types.ts';

const displayName = 'v5.common.ActionSidebar.BatchPaymentForm';

const BatchPaymentForm: FC<CreateActionFormProps> = () => {
  const createdInFilterFn = useFilterCreatedInField('from');

  return (
    <ActionFormLayout>
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
      <CreatedIn filterOptionsFn={createdInFilterFn} />
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
    </ActionFormLayout>
  );
};

BatchPaymentForm.displayName = displayName;

export default BatchPaymentForm;
