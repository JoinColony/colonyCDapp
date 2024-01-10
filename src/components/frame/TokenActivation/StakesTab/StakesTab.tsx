import { BigNumber } from 'ethers';
import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import { useAppContext, useColonyContext } from '~hooks';
import { UnclaimedStakes } from '~types';
import { getFormattedTokenValue } from '~utils/tokens';

import ClaimAllButton from './ClaimAllButton';
import StakesListItem from './StakesListItem';

import styles from './StakesTab.css';

const displayName = 'frame.TokenActivation.StakesTab';

const MSG = defineMessages({
  yourStakes: {
    id: `${displayName}.yourStakes`,
    defaultMessage: 'Your stakes',
  },
  noClaims: {
    id: `${displayName}.noClaims`,
    defaultMessage: 'There are no stakes to claim.',
  },
  buttonText: {
    id: `${displayName}.buttonText`,
    defaultMessage: 'Claim all',
  },
});

export interface Props {
  currentUserClaims: UnclaimedStakes[];
}

const StakesTab = ({ currentUserClaims }: Props) => {
  const {
    colony: { nativeToken, name: colonyName, colonyAddress },
  } = useColonyContext();
  const { wallet, user } = useAppContext();

  return (
    <div className={styles.stakesContainer}>
      {currentUserClaims.length > 0 ? (
        <>
          <div className={styles.claimAllButtonSection}>
            <FormattedMessage {...MSG.yourStakes} />
            <ClaimAllButton
              unclaimedStakes={currentUserClaims}
              userAddress={wallet?.address || ''}
              colonyAddress={colonyAddress}
            />
          </div>
          <ul data-test="claimableMotionsList">
            {currentUserClaims?.map(({ unclaimedRewards, motionId }) => {
              /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
              const currentUserRewards = unclaimedRewards.find(
                ({ address }) => address === user?.walletAddress,
              )!; // safe assertion: we use this condition as a filter condition when getting `currentUserClaims`
              const stakedAmount = BigNumber.from(
                currentUserRewards.rewards.yay,
              ).add(currentUserRewards.rewards.nay);

              return (
                <StakesListItem
                  stakedAmount={getFormattedTokenValue(
                    stakedAmount,
                    nativeToken.decimals,
                  )}
                  tokenSymbol={nativeToken.symbol}
                  colonyName={colonyName}
                  key={motionId}
                  motionId={motionId}
                />
              );
            })}
          </ul>
        </>
      ) : (
        <div className={styles.noClaims}>
          <FormattedMessage {...MSG.noClaims} />
        </div>
      )}
    </div>
  );
};

export default StakesTab;
