import React from 'react';
import { BigNumber } from 'ethers';
import { ColonyActionType } from '~gql';
import { useAppContext, useColonyContext } from '~hooks';
import { mapPayload } from '~utils/actions';
import { formatText } from '~utils/intl';
import Numeral from '~shared/Numeral';
import { getBalanceForTokenAndDomain } from '~utils/tokens';
import { MotionFinalizePayload } from '~redux/types/actions/motion';
import { DescriptionListItem } from '../VotingStep/partials/DescriptionList/types';
import { MotionAction } from '~types/motions';

export const useFinalizeStep = (actionData: MotionAction) => {
  const {
    motionData: { nativeMotionDomainId, motionId, gasEstimate },
    type,
    amount,
    fromDomain,
    tokenAddress,
  } = actionData;
  const { colony } = useColonyContext();
  const { balances } = colony || {};
  const { nativeToken } = colony || {};
  const { user } = useAppContext();

  const domainBalance = getBalanceForTokenAndDomain(
    balances,
    tokenAddress ?? '',
    Number(nativeMotionDomainId),
  );

  const requiresDomainFunds: boolean =
    !!fromDomain &&
    !!amount &&
    type !== ColonyActionType.MintTokensMotion &&
    type !== ColonyActionType.EmitDomainReputationPenaltyMotion &&
    type !== ColonyActionType.EmitDomainReputationRewardMotion;

  const isFinalizable =
    !requiresDomainFunds ||
    // Safe casting since if requiresDomainFunds is true, we know amount is a string
    BigNumber.from(domainBalance ?? '0').gte(amount as string);

  const transform = mapPayload(
    () =>
      ({
        colonyAddress: colony?.colonyAddress,
        userAddress: user?.walletAddress,
        motionId,
        gasEstimate,
      } as MotionFinalizePayload),
  );

  const items: DescriptionListItem[] = [
    {
      key: '1',
      label: formatText({ id: 'motion.finalizeStep.staked' }),
      value: (
        <div>
          <Numeral
            value="21.346" // @TODO: display correct value
            decimals={nativeToken?.decimals}
            suffix={nativeToken?.symbol}
          />
        </div>
      ),
    },
    {
      key: '2',
      label: formatText({ id: 'motion.finalizeStep.winnings' }),
      value: (
        <div>
          <Numeral
            value="0" // @TODO: display correct value
            decimals={nativeToken?.decimals}
            suffix={nativeToken?.symbol}
          />
        </div>
      ),
    },
    {
      key: '3',
      label: formatText({ id: 'motion.finalizeStep.total' }),
      value: (
        <div>
          <Numeral
            value="21.346" // @TODO: display correct value
            decimals={nativeToken?.decimals}
            suffix={nativeToken?.symbol}
          />
        </div>
      ),
    },
  ];

  return {
    transform,
    items,
    isFinalizable,
  };
};
