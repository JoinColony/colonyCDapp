import React, { FC } from 'react';
import MeatBallMenu from '~v5/shared/MeatBallMenu';
import { formatText } from '~utils/intl';
import TokenTypeBadge from '~v5/common/Pills/TokenTypeBadge/TokenTypeBadge';
import { TOKEN_TYPE } from '~v5/common/Pills/TokenTypeBadge/types';
import { TableItemProps } from '../types';
import IconTooltip from '~shared/IconTooltip';
import CopyableAddress from '~shared/CopyableAddress';
import TokenIcon from '~shared/TokenIcon';
import TokenInfoPopover from '~shared/TokenInfoPopover';
import Numeral from '~shared/Numeral';
import {
  getBalanceForTokenAndDomain,
  getTokenDecimalsWithFallback,
} from '~utils/tokens';
import { ADDRESS_ZERO } from '~constants';
import EthUsd from '~shared/EthUsd';
import { tableMenuProps } from './utils';

const displayName = 'v5.pages.BalancePage.partials.TableItem';

const TableItem: FC<TableItemProps> = ({
  token,
  isTokenNative,
  nativeTokenStatus,
  balances,
  domainId = 1,
  onChange,
}) => {
  const { symbol } = token || {};
  const currentTokenBalance =
    getBalanceForTokenAndDomain(balances, token?.tokenAddress, domainId) || 0;

  return (
    <div
      className={`grid grid-cols-[1fr_0.5fr_0.5fr_0.5fr] sm:grid-cols-[2fr_0.5fr_0.5fr_1fr_1fr]
    py-3 border-t border-gray-100 first:border-none`}
    >
      <div className="flex items-center relative cursor-pointer">
        <TokenInfoPopover
          token={token}
          isTokenNative={isTokenNative}
          popperOptions={{
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [[0, 0]],
                },
              },
            ],
          }}
        >
          <div className="flex gap-4 items-center">
            <TokenIcon token={token} size="xs" />
            <div>
              {token.symbol ? (
                <span>{token.symbol}</span>
              ) : (
                <CopyableAddress>{token.tokenAddress}</CopyableAddress>
              )}
              {isTokenNative && !nativeTokenStatus?.unlocked && (
                <IconTooltip
                  icon="lock"
                  tooltipText={{ id: 'tooltip.lockedToken' }}
                  appearance={{ size: 'tiny' }}
                />
              )}
            </div>
          </div>
        </TokenInfoPopover>
      </div>
      <div className="flex items-center text-gray-600">{symbol}</div>
      <div className="hidden sm:flex items-center">
        <TokenTypeBadge
          tokenType={isTokenNative ? TOKEN_TYPE.NATIVE : TOKEN_TYPE.REPUTATION}
          name={formatText({
            id: isTokenNative ? 'token.type.native' : 'token.type.reputation',
          })}
        />
      </div>
      <div className="flex flex-col items-end">
        <Numeral
          value={currentTokenBalance}
          decimals={getTokenDecimalsWithFallback(token.decimals)}
          className="text-1 text-gray-900"
          suffix={token.symbol}
        />
        {token.tokenAddress !== ADDRESS_ZERO && (
          <EthUsd
            value={currentTokenBalance}
            showPrefix
            className="text-gray-600 text-sm"
          />
        )}
      </div>
      <div className="flex items-center ml-auto">
        <MeatBallMenu items={tableMenuProps} />
      </div>
    </div>
  );
};

TableItem.displayName = displayName;

export default TableItem;
