import { BigNumber } from 'ethers';
import React, { useEffect, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import DetailItem from '~shared/DetailsWidget/DetailItem';
import { MiniSpinnerLoader } from '~shared/Preloaders';
import { ColonyMotion } from '~types';
import { useColonyContext } from '~hooks';
import { getBalanceForTokenAndDomain } from '~utils/tokens';

import FinalizeButton from './FinalizeButton';

import styles from './FinalizeMotion.css';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.FinalizeMotion';

const MSG = defineMessages({
  finalizeLabel: {
    id: `${displayName}.finalizeLabel`,
    defaultMessage: `Finalize motion`,
  },
  finalizeError: {
    id: `${displayName}.finalizeError`,
    defaultMessage: `There are insufficient funds in the domain to finalize this transaction. Please add more tokens and try again.`,
  },
  finalizeTooltip: {
    id: `${displayName}.finalizeTooltip`,
    defaultMessage: `Finalize completes a motion, allows stakes to be
    reclaimed, and if applicable, takes the action the motion was
    created to authorise.`,
  },
  loading: {
    id: `${displayName}.loading`,
    defaultMessage: 'Loading staker rewards...',
  },
});

export interface FinalizeMotionProps {
  amount?: string | null;
  tokenAddress?: string | null;
  motionData: ColonyMotion;
  requiresDomainFunds: boolean;
  startPollingAction: (pollingInterval: number) => void;
  stopPollingAction: () => void;
}

const FinalizeMotion = ({
  amount,
  tokenAddress,
  motionData: { nativeMotionDomainId, motionId, gasEstimate },
  requiresDomainFunds,
  startPollingAction,
  stopPollingAction,
}: FinalizeMotionProps) => {
  const { colony } = useColonyContext();
  const { balances } = colony || {};
  const [isPolling, setIsPolling] = useState(false);

  /* Stop polling when mounted / dismounted */
  useEffect(() => {
    stopPollingAction();
    return stopPollingAction;
  }, [stopPollingAction]);

  if (isPolling) {
    return (
      <MiniSpinnerLoader className={styles.loading} loadingText={MSG.loading} />
    );
  }

  const domainBalance = getBalanceForTokenAndDomain(
    balances,
    tokenAddress ?? '',
    Number(nativeMotionDomainId),
  );

  const isFinalizable =
    !requiresDomainFunds ||
    // Safe casting since if requiresDomainFunds is true, we know amount is a string
    BigNumber.from(domainBalance ?? '0').gte(amount as string);

  return (
    <div>
      <DetailItem
        label={MSG.finalizeLabel}
        tooltipText={MSG.finalizeTooltip}
        tooltipPopperOptions={{ placement: 'left' }}
        item={
          <FinalizeButton
            isFinalizable={isFinalizable}
            gasEstimate={gasEstimate}
            motionId={motionId}
            startPollingAction={startPollingAction}
            setIsPolling={setIsPolling}
          />
        }
      />
      {!isFinalizable && (
        <div className={styles.finalizeError}>
          <FormattedMessage {...MSG.finalizeError} />
        </div>
      )}
    </div>
  );
};

FinalizeMotion.displayName = displayName;

export default FinalizeMotion;
