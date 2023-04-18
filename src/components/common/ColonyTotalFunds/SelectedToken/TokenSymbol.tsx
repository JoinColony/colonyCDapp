import React from 'react';

import IconTooltip from '~shared/IconTooltip';
import { Token } from '~types/index';
import { useColonyContext } from '~hooks';

import styles from './TokenSymbol.css';

const displayName = 'common.ColonyTotalFunds.TokenSymbol';

type Props = {
  token: Token | null | undefined;
  tokenAddress: string | undefined;
  innerRef?: (ref: HTMLElement | null) => void;
  onClick?: () => void;
};

const TokenSymbol = ({ token, tokenAddress, innerRef, onClick }: Props) => {
  const { colony } = useColonyContext();
  const { nativeToken, status } = colony || {};
  const { tokenAddress: nativeTokenAddress } = nativeToken || {};

  return (
    <button className={styles.selectedTokenSymbol} ref={innerRef} onClick={onClick} type="button">
      <span data-test="colonyTokenSymbol">{token?.symbol}</span>
      {tokenAddress === nativeTokenAddress && !status?.nativeToken?.unlocked && (
        <IconTooltip
          icon="lock"
          tooltipText={{ id: 'tooltip.lockedToken' }}
          className={styles.tokenLockWrapper}
          appearance={{ size: 'large' }}
        />
      )}
    </button>
  );
};

TokenSymbol.displayName = displayName;

export default TokenSymbol;
