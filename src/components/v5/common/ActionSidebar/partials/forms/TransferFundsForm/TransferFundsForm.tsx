import React, { FC } from 'react';

import { FormattedMessage, useIntl } from 'react-intl';
import { useTransferFunds } from './hooks';
import { ActionFormBaseProps } from '../../../types';
import ActionFormRow from '~v5/common/ActionFormRow';
import TeamsSelect from '~v5/common/ActionSidebar/partials/TeamsSelect';
import AmountField from '~v5/common/ActionSidebar/partials/AmountField';
import { FormCardSelect } from '~v5/common/Fields/CardSelect';
import DescriptionField from '~v5/common/ActionSidebar/partials/DescriptionField';
import { DECISION_METHOD_OPTIONS } from '../../consts';

const displayName = 'v5.common.ActionSidebar.partials.TransferFundsForm';

const TransferFundsForm: FC<ActionFormBaseProps> = ({ getFormOptions }) => {
  const intl = useIntl();

  useTransferFunds(getFormOptions);

  return (
    <>
      <ActionFormRow
        iconName="users-three"
        fieldName="from"
        tooltip={
          <FormattedMessage id="actionSidebar.toolip.transferFunds.from" />
        }
        title={<FormattedMessage id="actionSidebar.from" />}
      >
        <TeamsSelect name="from" />
      </ActionFormRow>
      <ActionFormRow
        iconName="arrow-down-right"
        fieldName="to"
        title={<FormattedMessage id="actionSidebar.recipent" />}
        tooltip={
          <FormattedMessage id="actionSidebar.toolip.transferFunds.to" />
        }
      >
        <TeamsSelect name="to" />
      </ActionFormRow>
      <ActionFormRow
        iconName="coins"
        fieldName="amount"
        title={<FormattedMessage id="actionSidebar.amount" />}
        tooltip={
          <FormattedMessage id="actionSidebar.toolip.transferFunds.amount" />
        }
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
    </>
  );
};

TransferFundsForm.displayName = displayName;

export default TransferFundsForm;
