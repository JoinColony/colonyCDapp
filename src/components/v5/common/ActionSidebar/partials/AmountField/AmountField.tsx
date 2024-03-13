import { Id } from '@colony/colony-js';
import { formatNumeral, unformatNumeral } from 'cleave-zen';
import clsx from 'clsx';
import React, { useState, type ChangeEvent, type FC, useEffect } from 'react';
import { useController } from 'react-hook-form';

import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext.tsx';
import { useColonyContext } from '~context/ColonyContext.tsx';
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
  const [value, setValue] = useState('');
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
    const unformattedValue = unformatNumeral(value);
    if (field.value && field.value !== unformattedValue) {
      setValue(formatNumeral(field.value, formattingOptions));
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
      className="flex items-center gap-3 w-full text-md"
      ref={registerContainerRef}
    >
      <input
        ref={(ref) => {
          inputRef.current = ref || undefined;
          adjustInputWidth();
        }}
        readOnly={readonly || isDisabled}
        name={name}
        className={clsx('flex-shrink text-gray-900 outline-0 outline-none', {
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
      <div className="sm:relative flex-shrink-0" ref={dropdownRef}>
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
          onClick={toggleTokenSelect}
          aria-label={formatText({ id: 'ariaLabel.selectToken' })}
          disabled={readonly || isDisabled}
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
    </div>
  );
};

AmountField.displayName = displayName;

export default AmountField;
