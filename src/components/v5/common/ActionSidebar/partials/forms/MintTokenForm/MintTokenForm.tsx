import React, { FC } from 'react';

import { useColonyContext } from '~hooks';
import { formatText } from '~utils/intl';
import ActionFormRow from '~v5/common/ActionFormRow';
import AmountField from '~v5/common/ActionSidebar/partials/AmountField';
import TeamsSelect from '~v5/common/ActionSidebar/partials/TeamsSelect';
import { FormCardSelect } from '~v5/common/Fields/CardSelect';

import { ActionFormBaseProps } from '../../../types';
import { useDecisionMethods } from '../../../hooks';
import DescriptionRow from '../../DescriptionRow';
import { useMintToken } from './hooks';

const displayName = 'v5.common.ActionSidebar.partials.MintTokenForm';

const MintTokenForm: FC<ActionFormBaseProps> = ({ getFormOptions }) => {
  const { decisionMethods } = useDecisionMethods();
  const { colony } = useColonyContext();

  useMintToken(getFormOptions);

  return (
    <>
      <ActionFormRow
        icon="coins"
        fieldName="amount"
        title={formatText({ id: 'actionSidebar.value' })}
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.mintTokens.amount',
            }),
          },
        }}
      >
        <AmountField
          name="amount"
          maxWidth={270}
          tokenAddress={colony?.nativeToken.tokenAddress}
        />
      </ActionFormRow>
      <ActionFormRow
        icon="scales"
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
          options={decisionMethods}
          title={formatText({ id: 'actionSidebar.availableDecisions' })}
          placeholder={formatText({
            id: 'actionSidebar.decisionMethod.placeholder',
          })}
        />
      </ActionFormRow>
      <ActionFormRow
        icon="house-line"
        fieldName="createdIn"
        title={formatText({ id: 'actionSidebar.createdIn' })}
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.createdIn',
            }),
          },
        }}
      >
        <TeamsSelect name="createdIn" readonly />
      </ActionFormRow>
      <DescriptionRow />
    </>
  );
};

MintTokenForm.displayName = displayName;

export default MintTokenForm;
