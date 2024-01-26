import clsx from 'clsx';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { DEFAULT_NETWORK_INFO } from '~constants';
import Icon from '~shared/Icon';
import TokenIcon from '~shared/TokenIcon';
import { Token } from '~types';
import { getBlockExplorerLink } from '~utils/external';
import PillsBase from '~v5/common/Pills/PillsBase';
import CopyableAddress from '~v5/shared/CopyableAddress';

const displayName = 'TokenInfoPopover.TokenInfo';

interface Props {
  token: Token;
  isTokenNative: boolean;
  className?: string;
}

const MSG = defineMessages({
  nativeToken: {
    id: `${displayName}.nativeToken`,
    defaultMessage: 'Native',
  },
  viewOnEtherscan: {
    id: `${displayName}.viewOnEtherscan`,
    defaultMessage: 'View on {blockExplorerName}',
  },
});

const TokenInfo = ({ token, isTokenNative, className }: Props) => {
  const { name, symbol, tokenAddress } = token;
  const { formatMessage } = useIntl();

  return (
    <div
      className={clsx(
        className,
        'flex flex-col items-center p-6 gap-6 w-80 text-gray-900',
      )}
    >
      <div className="flex flex-row items-center w-full gap-4">
        <TokenIcon size="m" token={token} className="flex-shrink-0" />
        <div className="flex flex-col flex-1 gap-1 min-w-0">
          <div className="w-full flex items-center">
            <h4 className="heading-4 truncate" title={`${name} (${symbol})`}>
              {name} ({symbol})
            </h4>
            {isTokenNative && (
              <Icon
                name="verified"
                appearance={{ size: 'small' }}
                className="shrink-0 text-blue-400 ml-1"
              />
            )}
          </div>
          <CopyableAddress address={tokenAddress} />
        </div>
      </div>

      <div className="flex flex-row items-center w-full">
        <a
          className="flex flex-row items-center gap-2 text-md hover:text-blue-400"
          target="_blank"
          rel="noreferrer noopener"
          href={getBlockExplorerLink({
            linkType: 'token',
            addressOrHash: tokenAddress,
          })}
        >
          <Icon name="arrow-square-out" appearance={{ size: 'tiny' }} />
          {formatMessage(MSG.viewOnEtherscan, {
            blockExplorerName: DEFAULT_NETWORK_INFO.blockExplorerName,
          })}
        </a>
        {isTokenNative && (
          <PillsBase className="ml-auto bg-base-white border border-blue-100">
            <span className="text-sm font-medium text-blue-400">
              {formatMessage(MSG.nativeToken)}
            </span>
          </PillsBase>
        )}
      </div>
    </div>
  );
};

TokenInfo.displayName = displayName;

export default TokenInfo;
