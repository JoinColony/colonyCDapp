import { DeepPartial } from 'utility-types';
import moveDecimal from 'move-decimal-point';

import { ActionTitleMessageKeys } from '~common/ColonyActions/helpers/getActionTitleValues';
import { ColonyActionType } from '~gql';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { DecisionMethod } from '~v5/common/ActionSidebar/hooks';
import { DescriptionMetadataGetter } from '~v5/common/ActionSidebar/types';
import { formatText } from '~utils/intl';

import { tryGetToken } from '../utils';
import { SplitPaymentFormValues } from './hooks';

export const splitPaymentDescriptionMetadataGetter: DescriptionMetadataGetter<
  DeepPartial<SplitPaymentFormValues>
> = async (
  { amount, decisionMethod },
  { getActionTitleValues, client, colony },
) => {
  const token = await tryGetToken(amount?.tokenAddress, client, colony);

  return getActionTitleValues(
    {
      type:
        decisionMethod === DecisionMethod.Permissions
          ? ColonyActionType.Payment
          : ColonyActionType.PaymentMotion,
      amount: amount?.amount
        ? moveDecimal(
            amount.amount.toString(),
            getTokenDecimalsWithFallback(token?.decimals),
          )
        : undefined,
      token,
    },
    {
      [ActionTitleMessageKeys.Recipient]: '',
      [ActionTitleMessageKeys.Amount]: formatText({
        id: 'actionSidebar.metadataDescription.unspecifiedAmount',
      }),
      [ActionTitleMessageKeys.TokenSymbol]: '',
    },
  );
};
