import { Id } from '@colony/colony-js';
import Cleave from 'cleave.js/react';
import clsx from 'clsx';
import React, { FC } from 'react';
import { useController } from 'react-hook-form';

import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext';
import { useColonyContext } from '~context/ColonyContext';
import useRelativePortalElement from '~hooks/useRelativePortalElement';
import useToggle from '~hooks/useToggle';
import Numeral from '~shared/Numeral';
import TokenIcon from '~shared/TokenIcon';
import { formatText } from '~utils/intl';
import {
  getBalanceForTokenAndDomain,
  getTokenDecimalsWithFallback,
} from '~utils/tokens';
import HoverWidthWrapper from '~v5/shared/HoverWidthWrapper';
import MenuContainer from '~v5/shared/MenuContainer';
import Portal from '~v5/shared/Portal';

import { useAmountField } from './hooks';
import { AmountFieldProps, CleaveChangeEvent } from './types';

const displayName = 'v5.common.ActionsContent.partials.AmountField';

const AmountField: FC<AmountFieldProps> = ({
  name,
  tokenAddress,
  maxWidth,
  teamId,
}) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name: `${name}.amount`,
  });
  const {
    field: tokenAddressController,
    fieldState: { error: tokenAddressError },
  } = useController({
    name: `${name}.tokenAddress`,
  });
  const isError = !!error || !!tokenAddressError;
  const { colony } = useColonyContext();
  const [
    isTokenSelectVisible,
    { toggle: toggleTokenSelect, registerContainerRef },
  ] = useToggle();
  const { readonly } = useAdditionalFormOptionsContext();

  const {
    colonyTokens,
    dynamicCleaveOptionKey,
    formattingOptions,
    selectedToken,
    inputRef,
    adjustInputWidth,
  } = useAmountField(
    tokenAddress || tokenAddressController.value,
    name,
    maxWidth,
  );

  const handleCleaveChange = (e: CleaveChangeEvent) => {
    field.onChange(e.target.rawValue);
    adjustInputWidth();
  };

  const { portalElementRef, relativeElementRef } = useRelativePortalElement<
    HTMLButtonElement,
    HTMLDivElement
  >([isTokenSelectVisible], {
    top: 8,
  });

  const selectedTokenContent = (
    <>
      <TokenIcon token={selectedToken || colonyTokens[0]} size="xxs" />
      <span className="text-md">
        {selectedToken?.symbol || colonyTokens[0].symbol}
      </span>
    </>
  );

  return (
    <div
      className="flex items-center gap-3 w-full text-md"
      ref={registerContainerRef}
    >
      <Cleave
        htmlRef={(ref) => {
          inputRef.current = ref;
          adjustInputWidth();
        }}
        readOnly={readonly}
        name={name}
        key={dynamicCleaveOptionKey}
        options={formattingOptions}
        className={clsx('flex-shrink text-gray-900 outline-0 outline-none', {
          'placeholder:text-gray-400': !isError,
          'text-negative-400 placeholder:text-negative-400': isError,
        })}
        placeholder={formatText({
          id: 'actionSidebar.enterAmount',
        })}
        value={field.value}
        autoComplete="off"
        onChange={handleCleaveChange}
      />
      {tokenAddress ? (
        <div className="flex items-center gap-1">{selectedTokenContent}</div>
      ) : (
        <div className="sm:relative w-full">
          <button
            type="button"
            ref={relativeElementRef}
            className={clsx(
              'flex-shrink-0 flex items-center gap-1 transition-colors',
              {
                'text-gray-900': selectedToken?.symbol,
                'text-gray-500': !selectedToken?.symbol,
                'md:hover:text-blue-400': !readonly,
              },
            )}
            onClick={readonly ? undefined : toggleTokenSelect}
            aria-label={formatText({ id: 'ariaLabel.selectToken' })}
          >
            {selectedTokenContent}
          </button>
          {isTokenSelectVisible && (
            <Portal>
              <MenuContainer
                className="absolute z-[60] px-2 py-6 w-full max-w-[calc(100%-2.25rem)] sm:w-auto sm:max-w-none"
                hasShadow
                rounded="s"
                ref={(ref) => {
                  registerContainerRef(ref);
                  portalElementRef.current = ref;
                }}
              >
                <h5 className="text-4 text-gray-400 mb-2 uppercase ml-4">
                  {formatText({ id: 'actionSidebar.availableTokens' })}
                </h5>
                <ul>
                  {colonyTokens.map((colonyToken) => {
                    const tokenBalance = getBalanceForTokenAndDomain(
                      colony.balances,
                      colonyToken.tokenAddress,
                      Number(teamId) || Id.RootDomain,
                    );

                    return (
                      <li
                        key={colonyToken.tokenAddress}
                        className="mb-1 last:mb-0"
                      >
                        <HoverWidthWrapper hoverClassName="font-medium block">
                          <button
                            type="button"
                            className={`flex items-center gap-1 transition-colors
                          md:hover:font-medium md:hover:bg-gray-50 py-2 px-4 rounded-lg
                          justify-between w-full`}
                            onClick={() => {
                              tokenAddressController.onChange(
                                colonyToken.tokenAddress,
                              );
                              toggleTokenSelect();
                            }}
                          >
                            <div className="flex items-center gap-1">
                              <TokenIcon
                                token={colonyToken}
                                size="xxs"
                                className="mr-1.5"
                              />
                              <span className="text-md">
                                {colonyToken.symbol}
                              </span>
                            </div>
                            {tokenBalance && (
                              <span className="text-sm text-gray-400 whitespace-nowrap ml-2">
                                {formatText({
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
                        </HoverWidthWrapper>
                      </li>
                    );
                  })}
                </ul>
              </MenuContainer>
            </Portal>
          )}
        </div>
      )}
    </div>
  );
};

AmountField.displayName = displayName;

export default AmountField;
