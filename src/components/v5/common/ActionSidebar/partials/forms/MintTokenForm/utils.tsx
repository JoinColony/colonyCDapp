import moveDecimal from 'move-decimal-point';
import { DeepPartial } from 'utility-types';
import { ColonyActionType } from '~gql';
import { DescriptionMetadataGetter } from '~v5/common/ActionSidebar/types';
import { MintTokenFormValues } from './consts';
import { DecisionMethod } from '~v5/common/ActionSidebar/hooks';
import { ActionTitleMessageKeys } from '~common/ColonyActions/helpers/getActionTitleValues';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { formatText } from '~utils/intl';

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
