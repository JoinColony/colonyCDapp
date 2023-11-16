import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { AddressZero } from '@ethersproject/constants';

import { RpcMethods, Token } from '~types';
import { DEFAULT_NETWORK_INFO } from '~constants';
import { TokenType } from '~gql';

import Avatar from '~v5/shared/Avatar';
import Button from '~v5/shared/Button';
import CopyableAddress from '~v5/shared/CopyableAddress';
import { getBlockExplorerLink } from '~utils/external';
import Icon from '~shared/Icon';

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
  const { avatar, name, symbol, tokenAddress, decimals, thumbnail } = token;
  const { formatMessage } = useIntl();

  const handleAddAssetToMetamask = () => {
    // https://docs.metamask.io/wallet/how-to/register-token/
    if (window.ethereum) {
      window.ethereum
        // @ts-ignore
        .request({
          method: RpcMethods.WatchAsset,
          params: {
            type: TokenType.Erc20,
            options: {
              address: tokenAddress,
              symbol,
              decimals,
              image: thumbnail,
            },
          },
        })
        .catch((e) => {
          console.error(e);
        });
    }
  };

  return (
    <div className="flex flex-col items-center bg-base-white p-6 gap-6 w-80 text-gray-900">
      <div className="flex flex-row items-center w-full gap-4">
        <Avatar
          size="m"
          title={name}
          avatar={thumbnail || avatar}
          className="flex-shrink-0"
        />
        <div className="flex flex-col flex-1 min-w-0 gap-1">
          <h4 className="font-bold text-xl overflow-hidden text-ellipsis whitespace-nowrap">
            {name} ({symbol})
          </h4>
          <CopyableAddress address={tokenAddress} />
        </div>
      </div>
      {isTokenNative && <p>{formatMessage(MSG.nativeTokenMessage)}</p>}
      {tokenAddress !== AddressZero && (
        <Button
          isFullSize
          mode="primaryOutline"
          text={MSG.addToWallet}
          onClick={handleAddAssetToMetamask}
        />
      )}
      <hr className="w-full" />
      <a
        className="flex flex-row items-center self-start gap-2 text-md"
        target="_blank"
        rel="noreferrer noopener"
        href={getBlockExplorerLink({
          linkType: 'token',
          addressOrHash: tokenAddress,
        })}
      >
        <Icon name="arrow-square-out" appearance={{ size: 'extraTiny' }} />
        {formatMessage(MSG.viewOnEtherscan, {
          blockExplorerName: DEFAULT_NETWORK_INFO.blockExplorerName,
        })}
      </a>
    </div>
  );
};

TokenInfo.displayName = displayName;

export default TokenInfo;
