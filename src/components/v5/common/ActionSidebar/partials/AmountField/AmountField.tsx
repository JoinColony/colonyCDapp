import { formatNumeral, unformatNumeral } from 'cleave-zen';
import clsx from 'clsx';
import React, { useState, type ChangeEvent, type FC, useEffect } from 'react';
import { useController, useFormContext } from 'react-hook-form';

import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useRelativePortalElement from '~hooks/useRelativePortalElement.ts';
import useToggle from '~hooks/useToggle/index.ts';
import { formatText } from '~utils/intl.ts';
import MenuContainer from '~v5/shared/MenuContainer/index.ts';
import Portal from '~v5/shared/Portal/index.ts';

import { useAmountField } from './hooks.ts';
import { TokenItem } from './partials/TokenItem.tsx';
import { TokenList } from './partials/TokenList.tsx';
import { TokenNotFound } from './partials/TokenNotFounds.tsx';
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
  const { trigger } = useFormContext();
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
  const [value, setValue] = useState<string>(
    field.value ? formatNumeral(field.value, formattingOptions) : '',
  );

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

  const handleFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
    const unformattedValue = unformatNumeral(e.target.value);

    field.onChange(unformattedValue);
    setValue(formatNumeral(e.target.value, formattingOptions));
    adjustInputWidth();
  };

  const handleTokenSelect = (selectedTokenAddress: string) => {
    tokenAddressController.onChange(selectedTokenAddress);
    if (value) {
      trigger(name);
    }
    toggleTokenSelect();
  };

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
        className={clsx(
          'flex-shrink bg-base-white text-gray-900 outline-none outline-0',
          {
            'placeholder:text-gray-400': !isError && !isDisabled,
            'placeholder:text-gray-300': isDisabled,
            'text-negative-400 placeholder:text-negative-400':
              !isDisabled && isError,
          },
        )}
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
          {isTokenInColony ? (
            <TokenItem token={activeToken} />
          ) : (
            <TokenNotFound />
          )}
        </button>
        {isTokenSelectVisible && (
          <Portal>
            <MenuContainer
              className="absolute z-sidebar w-full max-w-[calc(100%-2.25rem)] overflow-y-auto px-2 py-6 sm:w-auto sm:max-w-none"
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
              <TokenList
                tokens={colonyTokens}
                domainId={domainId}
                balances={colony.balances}
                onSelect={handleTokenSelect}
              />
            </MenuContainer>
          </Portal>
        )}
      </div>
    </div>
  );
};

AmountField.displayName = displayName;

export default AmountField;
