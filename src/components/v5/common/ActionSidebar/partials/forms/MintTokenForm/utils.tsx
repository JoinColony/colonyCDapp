import { BigNumber } from 'ethers';
import moveDecimal from 'move-decimal-point';
import { DeepPartial } from 'utility-types';

import { ActionTitleMessageKeys } from '~common/ColonyActions/helpers/getActionTitleValues';
import { ColonyActionType } from '~gql';
import { RootMotionMethodNames } from '~redux';
import { Colony } from '~types';
import { formatText } from '~utils/intl';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { DecisionMethod } from '~v5/common/ActionSidebar/hooks';
import { DescriptionMetadataGetter } from '~v5/common/ActionSidebar/types';

import { MintTokenFormValues } from './consts';

export const mintTokenDescriptionMetadataGetter: DescriptionMetadataGetter<
  DeepPartial<MintTokenFormValues>
> = async ({ amount, decisionMethod }, { getActionTitleValues, colony }) => {
  return getActionTitleValues(
    {
      token: amount?.amount ? colony?.nativeToken : undefined,
      type:
        decisionMethod === DecisionMethod.Permissions
          ? ColonyActionType.MintTokens
          : ColonyActionType.MintTokensMotion,
      amount: amount?.amount
        ? moveDecimal(
            amount.amount.toString(),
            getTokenDecimalsWithFallback(colony?.nativeToken?.decimals),
          )
        : undefined,
    },
    {
      [ActionTitleMessageKeys.Amount]: '',
      [ActionTitleMessageKeys.TokenSymbol]: formatText({
        id: 'actionSidebar.metadataDescription.nativeTokens',
      }),
    },
  );
};

export const getMintTokenPayload = (
  colony: Colony,
  values: MintTokenFormValues,
) => {
  const {
    amount: { amount: inputAmount },
    description: annotationMessage,
    title,
  } = values;

  const amount = BigNumber.from(
    moveDecimal(
      inputAmount,
      getTokenDecimalsWithFallback(colony?.nativeToken?.decimals),
    ),
  );

  return {
    operationName: RootMotionMethodNames.MintTokens,
    colonyAddress: colony.colonyAddress,
    colonyName: colony.name,
    nativeTokenAddress: colony.nativeToken.tokenAddress,
    motionParams: [amount],
    amount,
    annotationMessage,
    customActionTitle: title,
  };
};
