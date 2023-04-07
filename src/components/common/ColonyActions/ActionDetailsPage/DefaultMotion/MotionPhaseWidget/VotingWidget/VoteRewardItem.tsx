import React from 'react';
import { useColonyContext } from '~hooks';
import Numeral from '~shared/Numeral';
import TokenIcon from '~shared/TokenIcon';

import styles from './VoteRewardItem.css';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.VotingWidget.VoteReward';

const VoteRewardItem = () => {
  const { colony } = useColonyContext();
  const { nativeToken } = colony || {};
  const minReward = '1000000000000000000';
  const maxReward = '10000000000000000000';
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
