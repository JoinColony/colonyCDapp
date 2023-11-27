import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { Token } from '~types';
import { DEFAULT_NETWORK_INFO } from '~constants';

import Avatar from '~v5/shared/Avatar';
import CopyableAddress from '~v5/shared/CopyableAddress';
import { getBlockExplorerLink } from '~utils/external';
import Icon from '~shared/Icon';
import PillsBase from '~v5/common/Pills/PillsBase';

const displayName = 'TokenInfoPopover.TokenInfo';

interface Props {
  token: Token;
  isTokenNative: boolean;
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

const TokenInfo = ({ token, isTokenNative }: Props) => {
  const { avatar, name, symbol, tokenAddress, thumbnail } = token;
  const { formatMessage } = useIntl();

  return (
    <div className="flex flex-col items-center p-6 gap-6 w-80 text-gray-900">
      <div className="flex flex-row items-center w-full gap-4">
        <Avatar
          size="m"
          title={name}
          avatar={thumbnail || avatar}
          className="flex-shrink-0"
        />
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
