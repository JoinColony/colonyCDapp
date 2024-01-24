/* @NOTE this is just docs for when we implement advanced payments and need a reference for the form description
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
        decisionMethod === DecisionMethod.Permissions
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
*/
