import { Id } from '@colony/colony-js';
import { formatNumeral, unformatNumeral } from 'cleave-zen';
import clsx from 'clsx';
import React, { useState, type ChangeEvent, type FC, useEffect } from 'react';
import { useController } from 'react-hook-form';

import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useRelativePortalElement from '~hooks/useRelativePortalElement.ts';
import useToggle from '~hooks/useToggle/index.ts';
import Numeral from '~shared/Numeral/index.ts';
import TokenIcon from '~shared/TokenIcon/index.ts';
import { formatText } from '~utils/intl.ts';
import {
  getBalanceForTokenAndDomain,
  getTokenDecimalsWithFallback,
} from '~utils/tokens.ts';
import HoverWidthWrapper from '~v5/shared/HoverWidthWrapper/index.ts';
import MenuContainer from '~v5/shared/MenuContainer/index.ts';
import Portal from '~v5/shared/Portal/index.ts';

import { useAmountField } from './hooks.ts';
import { type AmountFieldProps } from './types.ts';

const displayName = 'v5.common.ActionsContent.partials.AmountField';

const AmountField: FC<AmountFieldProps> = ({
  name,
  maxWidth,
  domainId,
  isDisabled,
  placeholder,
  tokenAddressFieldName = 'tokenAddress',
}) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
  });
  const {
    field: tokenAddressController,
    fieldState: { error: tokenAddressError },
  } = useController({
    name: tokenAddressFieldName,
  });
  const [value, setValue] = useState<string | undefined>(undefined);
  const isError = !!error || !!tokenAddressError;
  const { colony } = useColonyContext();
  const [
    isTokenSelectVisible,
    { toggle: toggleTokenSelect, registerContainerRef },
  ] = useToggle();
  const { readonly } = useAdditionalFormOptionsContext();

  const {
    colonyTokens,
    formattingOptions,
    selectedToken,
    inputRef,
    dropdownRef,
    adjustInputWidth,
  } = useAmountField(tokenAddressController.value, maxWidth);

  const handleFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
    const unformattedValue = unformatNumeral(e.target.value);

    field.onChange(unformattedValue);
    setValue(formatNumeral(e.target.value, formattingOptions));
    adjustInputWidth();
  };

  useEffect(() => {
    if (value) {
      const unformattedValue = unformatNumeral(value);

      if (field.value !== unformattedValue) {
        field.onChange(unformatNumeral(value));
      }
    }
  }, [value, field, formattingOptions]);

  const { portalElementRef, relativeElementRef } = useRelativePortalElement<
    HTMLButtonElement,
    HTMLDivElement
  >([isTokenSelectVisible], {
    top: 8,
  });

  const selectedTokenContent = (
    <div className="flex items-center gap-1">
      <TokenIcon token={selectedToken || colonyTokens[0]} size="xxs" />
      <span
        className={clsx('text-md', {
          'text-gray-400': isDisabled,
        })}
      >
        {selectedToken?.symbol || colonyTokens[0].symbol}
      </span>
    </div>
  );

  return (
    <div
      className="flex w-full items-center gap-3 text-md"
      ref={registerContainerRef}
    >
      <input
        ref={(ref) => {
          inputRef.current = ref;
          adjustInputWidth();
        }}
        readOnly={readonly || isDisabled}
        name={name}
        className={clsx('flex-shrink text-gray-900 outline-none outline-0', {
          'placeholder:text-gray-400': !isError || isDisabled,
          'text-negative-400 placeholder:text-negative-400':
            !isDisabled && isError,
        })}
        placeholder={
          placeholder ||
          formatText({
            id: 'actionSidebar.enterAmount',
          })
        }
        value={value}
        autoComplete="off"
        onChange={handleFieldChange}
      />
      <div className="flex-shrink-0 sm:relative" ref={dropdownRef}>
        <button
          type="button"
          ref={relativeElementRef}
          className={clsx(
            'flex flex-shrink-0 items-center gap-1 transition-colors',
            {
              'text-gray-900': selectedToken?.symbol,
              'text-gray-500': !selectedToken?.symbol,
              'md:hover:text-blue-400': !readonly,
            },
          )}
          onClick={toggleTokenSelect}
          aria-label={formatText({ id: 'ariaLabel.selectToken' })}
          disabled={readonly || isDisabled}
        >
          {selectedTokenContent}
        </button>
        {isTokenSelectVisible && (
          <Portal>
            <MenuContainer
              className="absolute z-sidebar w-full max-w-[calc(100%-2.25rem)] px-2 py-6 sm:w-auto sm:max-w-none"
              hasShadow
              rounded="s"
              ref={(ref) => {
                registerContainerRef(ref);
                portalElementRef.current = ref;
              }}
            >
              <h5 className="mb-2 ml-4 uppercase text-gray-400 text-4">
                {formatText({ id: 'actionSidebar.availableTokens' })}
              </h5>
              <ul>
                {colonyTokens.map((colonyToken) => {
                  const tokenBalance = getBalanceForTokenAndDomain(
                    colony.balances,
                    colonyToken.tokenAddress,
                    domainId ?? Id.RootDomain,
                  );

                  return (
                    <li
                      key={colonyToken.tokenAddress}
                      className="mb-1 last:mb-0"
                    >
                      <HoverWidthWrapper hoverClassName="font-medium block">
                        <button
                          type="button"
                          className={`flex w-full items-center justify-between
                        gap-1 rounded-lg px-4 py-2 transition-colors
                        md:hover:bg-gray-50 md:hover:font-medium`}
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
                            <span className="ml-2 whitespace-nowrap text-sm text-gray-400">
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
    </div>
  );
};

AmountField.displayName = displayName;

export default AmountField;
