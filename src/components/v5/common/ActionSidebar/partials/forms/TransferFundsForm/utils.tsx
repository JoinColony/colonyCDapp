import moveDecimal from 'move-decimal-point';
import { DeepPartial } from 'utility-types';
import { BigNumber } from 'ethers';

import { ColonyActionType } from '~gql';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { DecisionMethod } from '~v5/common/ActionSidebar/hooks';
import { DescriptionMetadataGetter } from '~v5/common/ActionSidebar/types';
import { ActionTitleMessageKeys } from '~common/ColonyActions/helpers/getActionTitleValues';
import { formatText } from '~utils/intl';
import { Colony } from '~types';
import { findDomainByNativeId } from '~utils/domains';

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
        decisionMethod === DecisionMethod.Permissions
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

export const getTransferFundsPayload = (
  colony: Colony,
  {
    amount: { amount: transferAmount, tokenAddress },
    from: fromDomainId,
    to: toDomainId,
    description: annotationMessage,
  }: TransferFundsFormValues,
) => {
  const colonyTokens = colony?.tokens?.items || [];
  const selectedToken = colonyTokens.find(
    (token) => token?.token.tokenAddress === tokenAddress,
  );
  const decimals = getTokenDecimalsWithFallback(selectedToken?.token.decimals);

  // Convert amount string with decimals to BigInt (eth to wei)
  const amount = BigNumber.from(moveDecimal(transferAmount, decimals));

  const fromDomain = findDomainByNativeId(Number(fromDomainId), colony);
  const toDomain = findDomainByNativeId(Number(toDomainId), colony);

  return {
    colonyAddress: colony.colonyAddress,
    colonyName: colony.name,
    tokenAddress,
    fromDomain,
    toDomain,
    amount,
    annotationMessage,
    customActionTitle: '',
  };
};
