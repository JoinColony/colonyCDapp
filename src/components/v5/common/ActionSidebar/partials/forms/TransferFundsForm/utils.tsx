import moveDecimal from 'move-decimal-point';
import { DeepPartial } from 'utility-types';

import { ColonyActionType } from '~gql';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { DECISION_METHOD } from '~v5/common/ActionSidebar/hooks';
import { DescriptionMetadataGetter } from '~v5/common/ActionSidebar/types';
import { ActionTitleMessageKeys } from '~common/ColonyActions/helpers/getActionTitleValues';
import { formatText } from '~utils/intl';

import { tryGetToken, getTeam } from '../utils';
import { TransferFundsFormValues } from './hooks';

export const trasferFundsDescriptionMetadataGetter: DescriptionMetadataGetter<
  DeepPartial<TransferFundsFormValues>
> = async (
  { decisionMethod, amount, from, to },
  { getActionTitleValues, client, colony },
) => {
  const token = await tryGetToken(amount?.tokenAddress, client, colony);

  return getActionTitleValues(
    {
      token: amount?.amount ? token : undefined,
      type:
        decisionMethod === DECISION_METHOD.Permissions
          ? ColonyActionType.MoveFunds
          : ColonyActionType.MoveFundsMotion,
      amount: amount?.amount
        ? moveDecimal(
            amount.amount.toString(),
            getTokenDecimalsWithFallback(token?.decimals),
          )
        : undefined,
      fromDomain: getTeam(from, colony),
      toDomain: getTeam(to, colony),
    },
    {
      [ActionTitleMessageKeys.Amount]: formatText({
        id: 'actionSidebar.metadataDescription.funds',
      }),
    },
  );
};
