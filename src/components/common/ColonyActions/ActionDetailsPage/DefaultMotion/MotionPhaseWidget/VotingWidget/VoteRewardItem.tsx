import React from 'react';
import { useGetVoterRewardsQuery } from '~gql';
import { useAppContext, useColonyContext } from '~hooks';
import Numeral from '~shared/Numeral';
import TokenIcon from '~shared/TokenIcon';
import { MotionData } from '~types';

import styles from './VoteRewardItem.css';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.VotingWidget.VoteReward';

interface VoteRewardItemProps {
  // motionState: MotionState;
  motionData: MotionData;
}

const VoteRewardItem = ({
  //  motionState,
  motionData: { motionId, motionDomainId, rootHash },
}: VoteRewardItemProps) => {
  const { colony } = useColonyContext();
  const { user } = useAppContext();

  const { data } = useGetVoterRewardsQuery({
    variables: {
      input: {
        voterAddress: user?.walletAddress ?? '',
        colonyAddress: colony?.colonyAddress ?? '',
        motionDomainId,
        motionId,
        rootHash,
      },
    },
  });

  const { max: maxReward, min: minReward } = data?.getVoterRewards || {};

  const { nativeToken } = colony || {};
  const showRewardRange = minReward !== maxReward;
  // if (motionState === MotionState.Voting) {
  return (
    <>
      {nativeToken && (
        <TokenIcon
          className={styles.tokenIcon}
          token={nativeToken}
          size="xxs"
        />
      )}
      {minReward && (
        <Numeral
          value={minReward}
          decimals={nativeToken?.decimals}
          appearance={{ theme: 'dark', size: 'small' }}
          suffix={showRewardRange ? undefined : nativeToken?.symbol}
        />
      )}
      {showRewardRange && maxReward && (
        <>
          <div className={styles.range} />
          <Numeral
            value={maxReward}
            decimals={nativeToken?.decimals}
            appearance={{ theme: 'dark', size: 'small' }}
            suffix={nativeToken?.symbol}
          />
        </>
      )}
    </>
  );
  // }
  /* {motionState === MotionState.Reveal && (
      <>
        <TokenIcon
          className={styles.tokenIcon}
          token={nativeToken}
          name={nativeToken.name || nativeToken.address}
          size="xxs"
        />
        <Numeral
          value={getFormattedTokenValue(
            voterReward.motionVoterReward.reward,
            nativeToken?.decimals,
          )}
          suffix={nativeToken?.symbol}
          appearance={{ theme: 'dark', size: 'small' }}
        />
      </>
    )} */
};

VoteRewardItem.displayName = displayName;

export default VoteRewardItem;
