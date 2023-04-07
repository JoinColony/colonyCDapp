import React from 'react';
import { useColonyContext } from '~hooks';

import Numeral from '~shared/Numeral';
import TokenIcon from '~shared/TokenIcon';

import styles from './RevealRewardItem.css';

interface RevealRewardProps {
  voterReward?: string;
}

const displayName = 'common.ColonyActions.DefaultMotion.RevealRewardItem';

const RevealRewardItem = ({ voterReward }: RevealRewardProps) => {
  const { colony } = useColonyContext();
  const { nativeToken } = colony || {};

  return (
    <>
      {nativeToken && (
        <TokenIcon
          className={styles.tokenIcon}
          token={nativeToken}
          size="xxs"
        />
      )}
      {voterReward && (
        <Numeral
          value={voterReward}
          decimals={nativeToken?.decimals}
          suffix={nativeToken?.symbol}
          appearance={{ theme: 'dark', size: 'small' }}
        />
      )}
    </>
  );
};

RevealRewardItem.displayName = displayName;

export default RevealRewardItem;
