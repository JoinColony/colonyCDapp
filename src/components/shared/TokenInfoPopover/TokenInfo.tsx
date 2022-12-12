import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { AddressZero } from '@ethersproject/constants';

import CopyableAddress from '~shared/CopyableAddress';
import TokenLink from '~shared/TokenLink';
import Button from '~shared/Button';
import TokenIcon from '~shared/TokenIcon';
import { Token } from '~types';

import { DEFAULT_NETWORK_INFO } from '~constants';

import styles from './TokenInfoPopover.css';

const displayName = 'TokenInfoPopover.TokenInfo';

interface Props {
  token: Token;
  isTokenNative: boolean;
}

const MSG = defineMessages({
  nativeTokenMessage: {
    id: `${displayName}.nativeTokenMessage`,
    defaultMessage: "*This is the colony's native token",
  },
  viewOnEtherscan: {
    id: `${displayName}.viewOnEtherscan`,
    defaultMessage: 'View on {blockExplorerName}',
  },
  addToWallet: {
    id: `${displayName}.addToWallet`,
    defaultMessage: 'Add token to Metamask',
  },
});

const TokenInfo = ({ token, isTokenNative }: Props) => {
  const {
    name,
    symbol,
    tokenAddress,
    // decimals,
  } = token;

  const handleAddAssetToMetamask = useCallback(
    /*
     * @TODO Refactor to remove the user of puser
     */
    //   addToken({
    // () =>
    //     address,
    //     symbol,
    //     decimals,
    //   }),
    // [address, symbol, decimals],
    () => {},
    [],
  );

  return (
    <div className={styles.main}>
      <div className={styles.section}>
        {name && (
          <div title={name} className={styles.displayName}>
            <TokenIcon token={token} size="xxs" />
            {name}
          </div>
        )}
        {symbol && (
          <p title={symbol} className={styles.symbol}>
            {symbol}
          </p>
        )}
        <div title={tokenAddress} className={styles.address}>
          <CopyableAddress full>{tokenAddress}</CopyableAddress>
        </div>
        {isTokenNative && (
          <p className={styles.nativeTokenMessage}>
            <FormattedMessage {...MSG.nativeTokenMessage} />
          </p>
        )}
      </div>
      <div className={styles.section}>
        <TokenLink
          className={styles.etherscanLink}
          tokenAddress={tokenAddress}
          text={MSG.viewOnEtherscan}
          textValues={{
            blockExplorerName: DEFAULT_NETWORK_INFO.blockExplorerName,
          }}
        />
        {tokenAddress !== AddressZero && (
          <span className={styles.addToWallet}>
            <Button
              appearance={{ theme: 'blue' }}
              text={MSG.addToWallet}
              onClick={handleAddAssetToMetamask}
            />
          </span>
        )}
      </div>
    </div>
  );
};

TokenInfo.displayName = displayName;

export default TokenInfo;
