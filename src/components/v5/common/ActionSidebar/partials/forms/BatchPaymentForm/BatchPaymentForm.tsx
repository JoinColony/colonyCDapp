import React, { FC } from 'react';
import { ActionFormBaseProps } from '../../../types';
import ActionFormRow from '~v5/common/ActionFormRow';
import TeamsSelect from '~v5/common/ActionSidebar/partials/TeamsSelect';
import DescriptionField from '~v5/common/ActionSidebar/partials/DescriptionField';
import { FormCardSelect } from '~v5/common/Fields/CardSelect';
import { DECISION_METHOD_OPTIONS } from '../../consts';
import BatchPaymentsTable from '../../BatchPaymentsTable';
import { formatText } from '~utils/intl';

const displayName = 'v5.common.ActionSidebar.partials.BatchPaymentForm';

const BatchPaymentForm: FC<ActionFormBaseProps> = () => (
  <>
    <ActionFormRow
      iconName="users-three"
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
    <ActionFormRow
      iconName="scales"
      fieldName="decisionMethod"
      tooltips={{
        label: {
          tooltipContent: formatText({
            id: 'actionSidebar.tooltip.decisionMethod',
          }),
        },
      }}
      title={formatText({ id: 'actionSidebar.decisionMethod' })}
    >
      <FormCardSelect
        name="decisionMethod"
        options={DECISION_METHOD_OPTIONS}
        title={formatText({ id: 'actionSidebar.decisionMethod' })}
      />
    </ActionFormRow>
    <ActionFormRow
      iconName="house-line"
      fieldName="createdIn"
      tooltips={{
        label: {
          tooltipContent: formatText({ id: 'actionSidebar.tooltip.createdIn' }),
        },
      }}
      title={formatText({ id: 'actionSidebar.createdIn' })}
    >
      <TeamsSelect name="createdIn" />
    </ActionFormRow>
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
          fieldName="annotation"
        />
      )}
    </ActionFormRow>
    <BatchPaymentsTable name="payments" />
  </>
);

BatchPaymentForm.displayName = displayName;

export default BatchPaymentForm;
