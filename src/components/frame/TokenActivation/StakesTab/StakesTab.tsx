import React, { Dispatch, SetStateAction } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import { SpinnerLoader } from '~shared/Preloaders';
import { Token } from '~types';
import { useAppContext, useColonyContext } from '~hooks';
import { getFormattedTokenValue } from '~utils/tokens';
// import { useMotionsTxHashesQuery } from '~data/index';

import { MotionStakedEvent } from './types';
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
  unclaimedMotionStakeEvents?: Array<MotionStakedEvent>;
  isLoadingMotions: boolean;
  token: Token;
  setIsPopoverOpen: Dispatch<SetStateAction<boolean>>;
}

const StakesTab = ({
  unclaimedMotionStakeEvents,
  isLoadingMotions,
  token,
  setIsPopoverOpen,
}: Props) => {
  const { colony } = useColonyContext();
  const { wallet } = useAppContext();
  // extract flat array of motionIds
  // const motionIds = useMemo(
  //   () =>
  //     unclaimedMotionStakeEvents &&
  //     unclaimedMotionStakeEvents.map((item) => item.values.motionId),
  //   [unclaimedMotionStakeEvents],
  // );

  // get TX hashes for the motionIds
  // const { data } = useMotionsTxHashesQuery({
  //   variables: {
  //     motionIds: motionIds || [],
  //     colonyAddress: colony?.colonyAddress || '',
  //   },
  //   fetchPolicy: 'network-only',
  // });

  // Hardcoded TX hash
  const txHash = '0xB93A5E663ee145fBEf82E9d57c49FaAf6F3f31FC';

  if (isLoadingMotions) {
    return (
      <div className={styles.loader}>
        <SpinnerLoader appearance={{ size: 'medium' }} />
      </div>
    );
  }

  return (
    <div className={styles.stakesContainer}>
      {unclaimedMotionStakeEvents && unclaimedMotionStakeEvents?.length > 0 ? (
        <>
          <div className={styles.claimAllButtonSection}>
            <FormattedMessage {...MSG.yourStakes} />
            <ClaimAllButton
              unclaimedMotionStakeEvents={unclaimedMotionStakeEvents}
              userAddress={wallet?.address || ''}
              colonyAddress={colony?.colonyAddress || ''}
              setIsPopoverOpen={setIsPopoverOpen}
            />
          </div>
          <ul data-test="claimableMotionsList">
            {unclaimedMotionStakeEvents?.map((motion) => (
              <StakesListItem
                stakedAmount={getFormattedTokenValue(
                  motion.values.stakeAmount,
                  token.decimals,
                )}
                tokenSymbol={token.symbol}
                colonyName={colony?.name || ''}
                txHash={txHash}
                // txHash={
                //   data?.motionsTxHashes &&
                //   data?.motionsTxHashes[motion.values.motionId]
                // }
                setIsPopoverOpen={setIsPopoverOpen}
                key={motion.values.motionId}
              />
            ))}
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
