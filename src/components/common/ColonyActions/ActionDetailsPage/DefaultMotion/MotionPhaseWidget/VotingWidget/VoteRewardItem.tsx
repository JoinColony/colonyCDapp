import React from 'react';

import { useColonyContext } from '~hooks';
import Numeral from '~shared/Numeral';
import TokenIcon from '~shared/TokenIcon';

import styles from './VoteRewardItem.css';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.VotingWidget.VoteReward';

interface VoteRewardItemProps {
  minReward?: string;
  maxReward?: string;
}

const VoteRewardItem = ({ minReward, maxReward }: VoteRewardItemProps) => {
  const { colony } = useColonyContext();

  const { nativeToken } = colony || {};
  const showRewardRange = minReward !== maxReward;
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
};

VoteRewardItem.displayName = displayName;

export default VoteRewardItem;
