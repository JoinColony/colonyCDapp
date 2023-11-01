import React, { FC } from 'react';

import { useMintToken } from './hooks';
import { ActionFormBaseProps } from '../../../types';
import ActionFormRow from '~v5/common/ActionFormRow';
import AmountField from '~v5/common/ActionSidebar/partials/AmountField';
import TeamsSelect from '~v5/common/ActionSidebar/partials/TeamsSelect';
import DescriptionField from '~v5/common/ActionSidebar/partials/DescriptionField';
import { FormCardSelect } from '~v5/common/Fields/CardSelect';
import { DECISION_METHOD_OPTIONS } from '../../consts';
import { formatMessage } from '~utils/yup/tests/helpers';

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
        <AmountField name="amount" />
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
        iconName="pencil"
        fieldName="description"
        tooltips={{
          label: {
            tooltipContent: formatMessage({
              id: 'actionSidebar.tooltip.description',
            }),
          },
        }}
        title={formatMessage({ id: 'actionSidebar.description' })}
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
