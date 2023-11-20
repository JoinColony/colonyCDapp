import { DeepPartial } from 'utility-types';

import { ActionTitleMessageKeys } from '~common/ColonyActions/helpers/getActionTitleValues';
import { ColonyActionType } from '~gql';
import { formatText } from '~utils/intl';
import { DECISION_METHOD } from '~v5/common/ActionSidebar/hooks';
import { DescriptionMetadataGetter } from '~v5/common/ActionSidebar/types';

import { AdvancedPaymentFormValues } from './hooks';

const getRecipientsText = (paymentsCount: number): string | undefined => {
  switch (paymentsCount) {
    case 0:
      return formatText(
        { id: 'actionSidebar.metadataDescription.recipients' },
        {
          recipients: formatText({
            id: 'actionSidebar.metadataDescription.recipientsMultiple',
          }),
        },
      );
    default:
      return formatText(
        { id: 'actionSidebar.metadataDescription.recipients' },
        { tokens: paymentsCount },
      );
  }
};

const getTokensText = (
  payments: DeepPartial<AdvancedPaymentFormValues>['payments'],
): string | undefined => {
  if (!payments) {
    return formatText(
      { id: 'actionSidebar.metadataDescription.withTokens' },
      {
        tokens: formatText({
          id: 'actionSidebar.metadataDescription.tokensMultiple',
        }),
      },
    );
  }

  const tokensCount = new Set(
    payments.map((payment) => payment?.amount?.tokenAddress).filter(Boolean),
  ).size;

  switch (tokensCount) {
    case 0:
      return formatText(
        { id: 'actionSidebar.metadataDescription.withTokens' },
        {
          tokens: formatText({
            id: 'actionSidebar.metadataDescription.tokensMultiple',
          }),
        },
      );
    default:
      return formatText(
        { id: 'actionSidebar.metadataDescription.withTokens' },
        { tokens: tokensCount },
      );
  }
};

export const advancedPaymentDescriptionMetadataGetter: DescriptionMetadataGetter<
  DeepPartial<AdvancedPaymentFormValues>
> = async ({ payments, decisionMethod }, { getActionTitleValues }) => {
  return getActionTitleValues(
    {
      type:
        decisionMethod === DECISION_METHOD.Permissions
          ? ColonyActionType.Payment
          : ColonyActionType.PaymentMotion,
    },
    {
      [ActionTitleMessageKeys.Recipient]: getRecipientsText(
        payments?.length || 0,
      ),
      [ActionTitleMessageKeys.Amount]: '',
      [ActionTitleMessageKeys.TokenSymbol]: getTokensText(payments),
    },
  );
};
