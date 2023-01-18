import React from 'react';

import IconTooltip from '~shared/IconTooltip';
import { Token } from '~types/index';
import { useColonyContext } from '~hooks';

import styles from './TokenSymbol.css';

const displayName = 'common.ColonyTotalFunds.TokenSymbol';

type Props = {
  token: Token | null | undefined;
  tokenAddress: string | undefined;
};

const TokenSymbol = ({ token, tokenAddress }: Props) => {
  const { colony } = useColonyContext();
  const { nativeToken, status } = colony || {};
  const { tokenAddress: nativeTokenAddress } = nativeToken || {};

  return (
    <>
      <span data-test="colonyTokenSymbol">{token?.symbol}</span>
      {tokenAddress === nativeTokenAddress &&
        !status?.nativeToken?.unlocked && (
          <IconTooltip
            icon="lock"
            tooltipText={{ id: 'tooltip.lockedToken' }}
            className={styles.tokenLockWrapper}
            appearance={{ size: 'large' }}
          />
        )}
    </>
  );
};

TokenSymbol.displayName = displayName;

export default TokenSymbol;
