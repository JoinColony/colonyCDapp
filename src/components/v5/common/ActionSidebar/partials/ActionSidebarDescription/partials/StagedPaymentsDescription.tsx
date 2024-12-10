import { BigNumber } from 'ethers';
import moveDecimal from 'move-decimal-point';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';

import { DEFAULT_TOKEN_DECIMALS } from '~constants';
import { useGetAllTokens } from '~hooks/useGetAllTokens.ts';
import Numeral from '~shared/Numeral/Numeral.tsx';
import { ExtendedColonyActionType } from '~types/actions.ts';
import { getTokenDecimalsWithFallback } from '~utils/tokens.ts';
import { type StagedPaymentFormValues } from '~v5/common/ActionSidebar/partials/forms/StagedPaymentForm/hooks.ts';

import CurrentUser from './CurrentUser.tsx';
import RecipientUser from './RecipientUser.tsx';

const displayName =
  'v5.common.ActionsSidebar.partials.ActionSidebarDescription.partials.StagedPaymentsDescription';

export const StagedPaymentsDescription = () => {
  const allTokens = useGetAllTokens();
  const formValues = useFormContext<StagedPaymentFormValues>().getValues();
  const { recipient, stages = [] } = formValues;

  if (!recipient) {
    return (
      <FormattedMessage
        id="staged.description.placeholder"
        values={{
          initiator: <CurrentUser />,
        }}
      />
    );
  }

  const summedAmount = stages.reduce((acc, { amount, tokenAddress }) => {
    const token = allTokens.find(
      ({ token: currentToken }) => currentToken.tokenAddress === tokenAddress,
    );
    const formattedAmount = moveDecimal(
      amount || '0',
      getTokenDecimalsWithFallback(token?.token.decimals),
    );

    return BigNumber.from(acc).add(BigNumber.from(formattedAmount));
  }, BigNumber.from('0'));

  const tokensCount = stages.reduce((acc, { tokenAddress }) => {
    return acc + (tokenAddress !== stages[0]?.tokenAddress ? 1 : 0);
  }, 1);
  const stagedPaymentTokenSymbol =
    tokensCount === 1 &&
    allTokens.find(
      ({ token }) => token.tokenAddress === stages[0]?.tokenAddress,
    )?.token.symbol;

  return (
    <FormattedMessage
      id="action.title"
      values={{
        actionType: ExtendedColonyActionType.StagedPayment,
        recipient: <RecipientUser userAddress={recipient} />,
        initiator: <CurrentUser />,
        stagedAmount: (
          <Numeral value={summedAmount} decimals={DEFAULT_TOKEN_DECIMALS} />
        ),
        tokenSymbol: stagedPaymentTokenSymbol,
        milestonesCount: stages.length,
        milestones: stages.length,
        tokensNumber: tokensCount,
      }}
    />
  );
};

StagedPaymentsDescription.displayName = displayName;
export default StagedPaymentsDescription;
