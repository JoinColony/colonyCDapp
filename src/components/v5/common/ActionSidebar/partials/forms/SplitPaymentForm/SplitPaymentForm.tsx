import React, { FC } from 'react';

import { useSplitPayment } from './hooks';
import { ActionFormBaseProps } from '../../../types';
import ActionFormRow from '~v5/common/ActionFormRow';
import TeamsSelect from '~v5/common/ActionSidebar/partials/TeamsSelect';
import AmountField from '~v5/common/ActionSidebar/partials/AmountField';
import DescriptionField from '~v5/common/ActionSidebar/partials/DescriptionField';
import { FormCardSelect } from '~v5/common/Fields/CardSelect';
import {
  DECISION_METHOD_OPTIONS,
  DISTRIBUTION_METHOD_OPTIONS,
} from '../../consts';
import { formatText } from '~utils/intl';
import SplitPaymentRecipientsField from './partials/SplitPaymentRecipientsField';

const displayName = 'v5.common.ActionSidebar.partials.SplitPaymentForm';

const SplitPaymentForm: FC<ActionFormBaseProps> = ({ getFormOptions }) => {
  const { currentToken, distributionMethod, amount } =
    useSplitPayment(getFormOptions);

  return (
    <>
      <ActionFormRow
        iconName="pie-chart"
        fieldName="distributionMethod"
        tooltip={formatText({ id: 'actionSidebar.toolip.distributionTypes' })}
        title={formatText({ id: 'actionSidebar.distribution' })}
      >
        <FormCardSelect
          name="distributionMethod"
          options={DISTRIBUTION_METHOD_OPTIONS}
          placeholder={formatText({
            id: 'actionSidebar.distributionPlaceholder',
          })}
          title={formatText({ id: 'actionSidebar.distributionTypes' })}
        />
      </ActionFormRow>
      <ActionFormRow
        iconName="coins"
        fieldName="amount"
        tooltip={formatText({ id: 'actionSidebar.toolip.singlePaymentAmount' })}
        title={formatText({ id: 'actionSidebar.amount' })}
      >
        <AmountField name="amount" />
      </ActionFormRow>
      <ActionFormRow
        iconName="users-three"
        fieldName="team"
        tooltip={formatText({ id: 'actionSidebar.toolip.paymentFrom' })}
        title={formatText({ id: 'team.type' })}
      >
        <TeamsSelect name="team" />
      </ActionFormRow>
      <ActionFormRow
        iconName="scales"
        fieldName="decisionMethod"
        tooltip={formatText({ id: 'actionSidebar.toolip.decisionMethod' })}
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
        tooltip={formatText({ id: 'actionSidebar.toolip.createdIn' })}
        title={formatText({ id: 'actionSidebar.createdIn' })}
      >
        <TeamsSelect name="createdIn" />
      </ActionFormRow>
      <ActionFormRow
        iconName="pencil"
        fieldName="description"
        tooltip={formatText({ id: 'actionSidebar.toolip.description' })}
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
      {currentToken && (
        <SplitPaymentRecipientsField
          amount={amount}
          name="payments"
          token={currentToken}
          distributionMethod={distributionMethod}
        />
      )}
    </>
  );
};

SplitPaymentForm.displayName = displayName;

export default SplitPaymentForm;
