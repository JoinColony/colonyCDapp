import { ArrowSquareOut, SealCheck } from '@phosphor-icons/react';
import clsx from 'clsx';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { DEFAULT_NETWORK_INFO } from '~constants/index.ts';
import { type Token } from '~types/graphql.ts';
import { getBlockExplorerLink } from '~utils/external/index.ts';
import PillsBase from '~v5/common/Pills/PillsBase.tsx';
import CopyableAddress from '~v5/shared/CopyableAddress/index.ts';
import { TokenAvatar } from '~v5/shared/TokenAvatar/TokenAvatar.tsx';

const displayName = 'TokenInfoPopover.TokenInfo';

interface Props {
  token: Token;
  isTokenNative: boolean;
  className?: string;
}

const MSG = defineMessages({
  nativeToken: {
    id: `${displayName}.nativeToken`,
    defaultMessage: 'Native Token',
  },
  nativeTokenDescription: {
    id: `${displayName}.nativeTokenDescription`,
    defaultMessage: 'This token was created by this Colony.',
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
        'flex w-80 flex-col items-center gap-4 p-6 text-gray-900 sm:w-96',
      )}
    >
      <div className="flex w-full flex-row items-center gap-4">
        <TokenAvatar
          size={60}
          tokenName={token.name}
          tokenAddress={token.tokenAddress}
          tokenAvatarSrc={token.avatar ?? undefined}
        />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex w-full items-center">
            <h4 className="truncate heading-4" title={`${name} (${symbol})`}>
              {name} ({symbol})
            </h4>
            {isTokenNative && (
              <SealCheck size={18} className="ml-1 shrink-0 text-blue-400" />
            )}
          </div>
          <CopyableAddress address={tokenAddress} />
        </div>
      </div>

      {isTokenNative && (
        <p className="w-full text-md text-gray-600">
          {formatMessage(MSG.nativeTokenDescription)}
        </p>
      )}

      <div className="flex w-full flex-row items-center border-t border-gray-200 pt-4">
        <a
          className="flex flex-row items-center gap-2 text-md hover:text-blue-400"
          target="_blank"
          rel="noreferrer noopener"
          href={getBlockExplorerLink({
            linkType: 'token',
            addressOrHash: tokenAddress,
          })}
        >
          <ArrowSquareOut size={18} />
          {formatMessage(MSG.viewOnEtherscan, {
            blockExplorerName: DEFAULT_NETWORK_INFO.blockExplorerName,
          })}
        </a>
        {isTokenNative && (
          <PillsBase className="ml-auto border border-blue-100 bg-base-white">
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
