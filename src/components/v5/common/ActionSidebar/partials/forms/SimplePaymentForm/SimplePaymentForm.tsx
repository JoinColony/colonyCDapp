import React, { FC } from 'react';

import { FormattedMessage, useIntl } from 'react-intl';
import { useSimplePayment } from './hooks';
import { ActionFormBaseProps } from '../../../types';
import ActionFormRow from '~v5/common/ActionFormRow';
import TeamsSelect from '~v5/common/ActionSidebar/partials/TeamsSelect';
import UserSelect from '~v5/common/ActionSidebar/partials/UserSelect';
import AmountField from '~v5/common/ActionSidebar/partials/AmountField';
import DescriptionField from '~v5/common/ActionSidebar/partials/DescriptionField';
import { FormCardSelect } from '~v5/common/Fields/CardSelect';
import TransactionTable from '~v5/common/ActionSidebar/partials/TransactionTable';
import { DECISION_METHOD_OPTIONS } from '../../consts';

const displayName = 'v5.common.ActionSidebar.partials.SimplePaymentForm';

const SimplePaymentForm: FC<ActionFormBaseProps> = ({ getFormOptions }) => {
  const intl = useIntl();

  useSimplePayment(getFormOptions);

  return (
    <>
      <ActionFormRow
        iconName="users-three"
        fieldName="from"
        tooltip={<FormattedMessage id="actionSidebar.toolip.paymentFrom" />}
        title={<FormattedMessage id="actionSidebar.from" />}
      >
        <TeamsSelect name="from" />
      </ActionFormRow>
      <ActionFormRow
        iconName="user-focus"
        fieldName="recipient"
        tooltip={
          <FormattedMessage id="actionSidebar.toolip.paymentRecipient" />
        }
        title={<FormattedMessage id="actionSidebar.recipent" />}
      >
        <UserSelect name="recipient" />
      </ActionFormRow>
      <ActionFormRow
        iconName="coins"
        fieldName="amount"
        tooltip={
          <FormattedMessage id="actionSidebar.toolip.singlePaymentAmount" />
        }
        title={<FormattedMessage id="actionSidebar.amount" />}
      >
        <AmountField name="amount" />
      </ActionFormRow>
      <ActionFormRow
        iconName="house-line"
        fieldName="createdIn"
        tooltip={<FormattedMessage id="actionSidebar.toolip.createdIn" />}
        title={<FormattedMessage id="actionSidebar.createdIn" />}
      >
        <TeamsSelect name="createdIn" />
      </ActionFormRow>
      <ActionFormRow
        iconName="scales"
        fieldName="decisionMethod"
        tooltip={<FormattedMessage id="actionSidebar.toolip.decisionMethod" />}
        title={<FormattedMessage id="actionSidebar.decisionMethod" />}
      >
        <FormCardSelect
          name="decisionMethod"
          options={DECISION_METHOD_OPTIONS}
          title={intl.formatMessage({ id: 'actionSidebar.decisionMethod' })}
        />
      </ActionFormRow>
      <ActionFormRow
        iconName="pencil"
        fieldName="description"
        tooltip={<FormattedMessage id="actionSidebar.toolip.description" />}
        title={<FormattedMessage id="actionSidebar.description" />}
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
      <TransactionTable name="payment" />
    </>
  );
};

SimplePaymentForm.displayName = displayName;

export default SimplePaymentForm;
