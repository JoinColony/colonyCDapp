import React, { FC } from 'react';

import { FormattedMessage, useIntl } from 'react-intl';
import { useMintToken } from './hooks';
import { ActionFormBaseProps } from '../../../types';
import ActionFormRow from '~v5/common/ActionFormRow';
import AmountField from '~v5/common/ActionSidebar/partials/AmountField';
import TeamsSelect from '~v5/common/ActionSidebar/partials/TeamsSelect';
import DescriptionField from '~v5/common/ActionSidebar/partials/DescriptionField';
import { FormCardSelect } from '~v5/common/Fields/CardSelect';
import { DECISION_METHOD_OPTIONS } from '../../consts';

const displayName = 'v5.common.ActionSidebar.partials.MintTokenForm';

const MintTokenForm: FC<ActionFormBaseProps> = ({ getFormOptions }) => {
  const intl = useIntl();

  useMintToken(getFormOptions);

  return (
    <>
      <ActionFormRow
        iconName="coins"
        fieldName="amount"
        title={<FormattedMessage id="actionSidebar.value" />}
        tooltip={
          <FormattedMessage id="actionSidebar.toolip.mintTokens.amount" />
        }
      >
        <AmountField name="amount" />
      </ActionFormRow>
      <ActionFormRow
        iconName="house-line"
        fieldName="createdIn"
        title={<FormattedMessage id="actionSidebar.createdIn" />}
        tooltip={<FormattedMessage id="actionSidebar.toolip.createdIn" />}
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
            fieldName="description"
          />
        )}
      </ActionFormRow>
    </>
  );
};

MintTokenForm.displayName = displayName;

export default MintTokenForm;
