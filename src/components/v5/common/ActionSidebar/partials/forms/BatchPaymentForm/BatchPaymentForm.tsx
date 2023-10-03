import React, { FC } from 'react';

import { FormattedMessage, useIntl } from 'react-intl';
import { ActionFormBaseProps } from '../../../types';
import ActionFormRow from '~v5/common/ActionFormRow';
import TeamsSelect from '~v5/common/ActionSidebar/partials/TeamsSelect';
import DescriptionField from '~v5/common/ActionSidebar/partials/DescriptionField';
import { FormCardSelect } from '~v5/common/Fields/CardSelect';
import { DECISION_METHOD_OPTIONS } from '../../consts';
import BatchPaymentsTable from '../../BatchPaymentsTable';

const displayName = 'v5.common.ActionSidebar.partials.BatchPaymentForm';

const BatchPaymentForm: FC<ActionFormBaseProps> = () => {
  const intl = useIntl();

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
        iconName="house-line"
        fieldName="createdIn"
        tooltip={<FormattedMessage id="actionSidebar.toolip.createdIn" />}
        title={<FormattedMessage id="actionSidebar.createdIn" />}
      >
        <TeamsSelect name="createdIn" />
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
      <BatchPaymentsTable name="payments" />
    </>
  );
};

BatchPaymentForm.displayName = displayName;

export default BatchPaymentForm;
