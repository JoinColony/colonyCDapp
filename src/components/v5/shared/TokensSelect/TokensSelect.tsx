import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';
import { useController, useFormContext } from 'react-hook-form';
import TokenIcon from '~shared/TokenIcon';
import {
  getBalanceForTokenAndDomain,
  getTokenDecimalsWithFallback,
} from '~utils/tokens';
import Card from '~v5/shared/Card';
import Numeral from '~shared/Numeral';
import { useColonyContext } from '~hooks';
import useToggle from '~hooks/useToggle';
import { TokensSelectProps } from './types';
import { useRelativePortalElement } from '~hooks/useRelativePortalElement';
import Portal from '~v5/shared/Portal';
import Icon from '~shared/Icon';
import { useTokenField } from './hooks';

const displayName = 'v5.TokensSelect';

const TokensSelect: FC<TokensSelectProps> = ({
  name,
  hasAdditionalInformation = true,
  avatarSize = 'xs',
  hasIcon = false,
}) => {
  const { formatMessage } = useIntl();
  const { watch } = useFormContext();
  const { field: tokenAddressController } = useController({
    name,
  });
  const { colony } = useColonyContext();
  const [
    isTokenSelectVisible,
    { toggle: toggleTokenSelect, registerContainerRef },
  ] = useToggle();

  const selectedTeam = watch('team');

  const { colonyTokens, selectedToken } = useTokenField(
    tokenAddressController.value,
  );

  const { portalElementRef, relativeElementRef } = useRelativePortalElement<
    HTMLButtonElement,
    HTMLDivElement
  >([isTokenSelectVisible], {
    top: 8,
  });

  return (
    <div
      className="flex items-center gap-3 w-full text-md"
      ref={registerContainerRef}
    >
      <div className="sm:relative w-full">
        <button
          type="button"
          ref={relativeElementRef}
          className={clsx(
            'flex items-center gap-2 transition-colors md:hover:text-blue-400',
            {
              'text-gray-900': selectedToken?.symbol,
              'text-gray-500': !selectedToken?.symbol,
            },
          )}
          onClick={toggleTokenSelect}
          aria-label={formatMessage({ id: 'ariaLabel.selectToken' })}
        >
          <TokenIcon
            token={selectedToken || colonyTokens[0]}
            size={avatarSize}
          />
          <span className="text-md">
            {selectedToken?.symbol || colonyTokens[0].symbol}
          </span>
          {hasIcon && (
            <Icon
              name="arrow-down"
              appearance={{ size: 'extraTiny' }}
              className={clsx('w-3 h-3 transition-transform', {
                'rotate-180': isTokenSelectVisible,
                'rotate-0': !isTokenSelectVisible,
              })}
            />
          )}
        </button>
        {isTokenSelectVisible && (
          <Portal>
            <Card
              className="absolute z-[99999999]"
              hasShadow
              rounded="s"
              ref={(ref) => {
                registerContainerRef(ref);
                portalElementRef.current = ref;
              }}
            >
              {hasAdditionalInformation && (
                <h5 className="text-4 text-gray-400 mb-4 uppercase">
                  {formatMessage({ id: 'actionSidebar.availableTokens' })}
                </h5>
              )}
              <ul>
                {colonyTokens.map((colonyToken) => {
                  const tokenBalance = getBalanceForTokenAndDomain(
                    colony?.balances,
                    colonyToken.tokenAddress,
                    selectedTeam,
                  );

                  return (
                    <li
                      key={colonyToken.tokenAddress}
                      className="mb-4 last:mb-0"
                    >
                      <button
                        type="button"
                        className={`flex items-center gap-2 transition-colors md:hover:text-blue-400
                        justify-between w-full`}
                        onClick={() => {
                          tokenAddressController.onChange(
                            colonyToken.tokenAddress,
                          );
                          toggleTokenSelect();
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <TokenIcon token={colonyToken} size="xs" />
                          <span className="text-md">{colonyToken.symbol}</span>
                        </div>
                        {tokenBalance && hasAdditionalInformation && (
                          <span className="text-sm text-gray-400">
                            {formatMessage({
                              id: 'actionSidebar.availableFunds',
                            })}
                            {': '}
                            <Numeral
                              value={tokenBalance}
                              decimals={getTokenDecimalsWithFallback(
                                colonyToken?.decimals,
                              )}
                            />{' '}
                            {colonyToken.symbol}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </Card>
          </Portal>
        )}
      </div>
    </div>
  );
};

TokensSelect.displayName = displayName;

export default TokensSelect;
