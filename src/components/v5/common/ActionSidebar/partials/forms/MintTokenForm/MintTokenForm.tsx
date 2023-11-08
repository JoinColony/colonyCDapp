import React, { FC } from 'react';

import { useMintToken } from './hooks';
import { ActionFormBaseProps } from '../../../types';
import ActionFormRow from '~v5/common/ActionFormRow';
import AmountField from '~v5/common/ActionSidebar/partials/AmountField';
import TeamsSelect from '~v5/common/ActionSidebar/partials/TeamsSelect';
import { FormCardSelect } from '~v5/common/Fields/CardSelect';
import { DECISION_METHOD_OPTIONS } from '../../consts';
import { formatMessage } from '~utils/yup/tests/helpers';
import DescriptionRow from '../../DescriptionRow';

const displayName = 'v5.common.ActionSidebar.partials.MintTokenForm';

const MintTokenForm: FC<ActionFormBaseProps> = ({ getFormOptions }) => {
  useMintToken(getFormOptions);

  return (
    <>
      <ActionFormRow
        iconName="coins"
        fieldName="amount"
        title={formatMessage({ id: 'actionSidebar.value' })}
        tooltips={{
          label: {
            tooltipContent: formatMessage({
              id: 'actionSidebar.tooltip.mintTokens.amount',
            }),
          },
        }}
      >
        <AmountField name="amount" maxWidth={270} />
      </ActionFormRow>
      <ActionFormRow
        iconName="scales"
        fieldName="decisionMethod"
        tooltips={{
          label: {
            tooltipContent: formatMessage({
              id: 'actionSidebar.tooltip.decisionMethod',
            }),
          },
        }}
        title={formatMessage({ id: 'actionSidebar.decisionMethod' })}
      >
        <FormCardSelect
          name="decisionMethod"
          options={DECISION_METHOD_OPTIONS}
          title={formatMessage({ id: 'actionSidebar.decisionMethod' })}
        />
      </ActionFormRow>
      <ActionFormRow
        iconName="house-line"
        fieldName="createdIn"
        title={formatMessage({ id: 'actionSidebar.createdIn' })}
        tooltips={{
          label: {
            tooltipContent: formatMessage({
              id: 'actionSidebar.tooltip.createdIn',
            }),
          },
        }}
      >
        <TeamsSelect name="createdIn" />
      </ActionFormRow>
      <DescriptionRow />
    </>
  );
};

MintTokenForm.displayName = displayName;

export default MintTokenForm;
