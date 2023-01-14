import React from 'react';
import { defineMessages } from 'react-intl';

import Icon from '~shared/Icon';
import IconTooltip from '~shared/IconTooltip';
import { Token } from '~types/index';
import { useColonyContext } from '~hooks';

import styles from './TokenSymbol.css';

const displayName = 'common.ColonyTotalFunds.TokenSymbol';

const MSG = defineMessages({
  loadingData: {
    id: `${displayName}.loadingData`,
    defaultMessage: 'Loading token information...',
  },
  tokenSelect: {
    id: `${displayName}.tokenSelect`,
    defaultMessage: 'Select Tokens',
  },
});

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
      <Icon
        className={styles.caretIcon}
        name="caret-down-small"
        title={MSG.tokenSelect}
      />
    </>
  );
};

TokenSymbol.displayName = displayName;

export default TokenSymbol;
