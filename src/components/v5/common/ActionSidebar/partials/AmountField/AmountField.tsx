import { Id } from '@colony/colony-js';
import { WarningCircle } from '@phosphor-icons/react';
import { formatNumeral, unformatNumeral } from 'cleave-zen';
import clsx from 'clsx';
import React, { useState, type ChangeEvent, type FC, useEffect } from 'react';
import { useController } from 'react-hook-form';

import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useRelativePortalElement from '~hooks/useRelativePortalElement.ts';
import useToggle from '~hooks/useToggle/index.ts';
import Tooltip from '~shared/Extensions/Tooltip/Tooltip.tsx';
import Numeral from '~shared/Numeral/index.ts';
import { formatText } from '~utils/intl.ts';
import { multiLineTextEllipsis } from '~utils/strings.ts';
import {
  getBalanceForTokenAndDomain,
  getTokenDecimalsWithFallback,
} from '~utils/tokens.ts';
import HoverWidthWrapper from '~v5/shared/HoverWidthWrapper/index.ts';
import MenuContainer from '~v5/shared/MenuContainer/index.ts';
import Portal from '~v5/shared/Portal/index.ts';
import { TokenAvatar } from '~v5/shared/TokenAvatar/TokenAvatar.tsx';

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
  isTokenSelectionDisabled,
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
    if (!field.value || (value && field.value === unformatNumeral(value))) {
      return;
    }

    setValue(formatNumeral(field.value, formattingOptions));
  }, [field.value, formattingOptions, value]);

  const { portalElementRef, relativeElementRef } = useRelativePortalElement<
    HTMLButtonElement,
    HTMLDivElement
  >([isTokenSelectVisible], {
    top: 8,
  });

  const activeToken = selectedToken || colonyTokens[0];

  const isTokenInColony = colonyTokens.some(
    (colonyToken) => colonyToken.tokenAddress === selectedToken?.tokenAddress,
  );

  useEffect(() => {
    adjustInputWidth();
  }, [adjustInputWidth]);

  const selectedTokenContent = isTokenInColony ? (
    <div className="flex items-center gap-1">
      <TokenAvatar
        size={18}
        tokenName={activeToken.name}
        tokenAddress={activeToken.tokenAddress}
        tokenAvatarSrc={activeToken.avatar ?? undefined}
      />
      <span
        className={clsx('text-md', {
          'text-gray-300': isDisabled,
        })}
      >
        {multiLineTextEllipsis(activeToken.symbol, 5)}
      </span>
    </div>
  ) : (
    <Tooltip
      trigger="hover"
      popperOptions={{ placement: 'bottom' }}
      tooltipContent={formatText({ id: 'actionSidebar.tokenErrorTooltip' })}
    >
      <div className="flex items-center gap-1 text-negative-400">
        <WarningCircle size={16} />
        <span className="text-md">
          {formatText({
            id: 'actionSidebar.tokenError',
          })}
        </span>
      </div>
    </Tooltip>
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
          'placeholder:text-gray-400': !isError && !isDisabled,
          'placeholder:text-gray-300': isDisabled,
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
              'md:hover:text-blue-400': !readonly && !isTokenSelectionDisabled,
            },
          )}
          onClick={toggleTokenSelect}
          aria-label={formatText({ id: 'ariaLabel.selectToken' })}
          disabled={readonly || isDisabled || isTokenSelectionDisabled}
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
                            <TokenAvatar
                              size={18}
                              tokenName={colonyToken.name}
                              tokenAddress={colonyToken.tokenAddress}
                              tokenAvatarSrc={colonyToken.avatar ?? undefined}
                            />
                            <span className="text-md">
                              {multiLineTextEllipsis(colonyToken.symbol, 5)}
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
                              {multiLineTextEllipsis(colonyToken.symbol, 5)}
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
