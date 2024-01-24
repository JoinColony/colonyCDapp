// @NOTE this is just docs for when we implement split payments and need a reference for the form description
/*
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
*/
