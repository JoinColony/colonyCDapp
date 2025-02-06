import {
  DefaultTimeDelimiter,
  formatNumeral,
  registerCursorTracker,
  unformatNumeral,
} from 'cleave-zen';
import clsx from 'clsx';
import React, {
  useState,
  type ChangeEvent,
  type FC,
  useEffect,
  useRef,
} from 'react';
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
import { TokenNotFound } from './partials/TokenNotFound.tsx';
import { type AmountFieldProps } from './types.ts';

const displayName = 'v5.common.ActionsContent.partials.AmountField';

const AmountField: FC<AmountFieldProps> = ({
  name,
  domainId,
  isDisabled,
  placeholder,
  tokenAddressFieldName = 'tokenAddress',
  isTokenSelectionDisabled,
  onBlur,
  onChange,
  readOnly: readOnlyProp,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const placeholderValue =
    placeholder || formatText({ id: 'actionSidebar.enterAmount' });

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

  const { colonyTokens, formattingOptions, selectedToken } = useAmountField(
    tokenAddressController.value,
  );

  const [value, setValue] = useState<string | undefined>(
    field.value ? formatNumeral(field.value, formattingOptions) : undefined,
  );

  const handleFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatNumeral(e.target.value, formattingOptions);

    // Strip 'M' from the input as the character 'M' is used as a placeholder in the unformatNumeral function and can result in weird values
    const unformattedValue = unformatNumeral(e.target.value.replace('M', ''));

    if (
      wrapperRef.current &&
      wrapperRef.current.dataset.value !== formattedValue
    ) {
      wrapperRef.current.dataset.value = formattedValue;
    }

    if (wrapperRef.current && formattedValue === '') {
      wrapperRef.current.dataset.value = placeholderValue;
    }

    onChange?.();

    field.onChange(unformattedValue.replace('-', ''));
    setValue(formattedValue);
  };

  useEffect(() => {
    if (selectedToken?.tokenAddress) {
      tokenAddressController.onChange(selectedToken.tokenAddress);
    }
  }, [selectedToken?.tokenAddress]);

  const handleTokenSelect = (selectedTokenAddress: string) => {
    tokenAddressController.onChange(selectedTokenAddress);
    if (value) {
      trigger(name);
    }
    toggleTokenSelect();
  };

  useEffect(() => {
    if (!inputRef.current) {
      return undefined;
    }

    return registerCursorTracker({
      input: inputRef.current,
      delimiter: DefaultTimeDelimiter,
    });
  }, [inputRef]);

  useEffect(() => {
    if (!field.value || (value && field.value === unformatNumeral(value))) {
      return;
    }

    const formattedValue = formatNumeral(field.value, formattingOptions);

    if (
      wrapperRef.current &&
      inputRef.current &&
      wrapperRef.current.dataset.value !== formattedValue
    ) {
      wrapperRef.current.dataset.value = formattedValue;
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

  const selectedTokenContent = isTokenInColony ? (
    <TokenItem token={activeToken} />
  ) : (
    <TokenNotFound />
  );

  return (
    <div
      className="relative inline-grid items-center gap-3 text-md before:invisible before:col-start-1 before:row-start-1 before:w-auto before:min-w-[0.5em] before:resize-none before:whitespace-pre-wrap before:text-md before:content-[attr(data-value)]"
      ref={wrapperRef}
      data-value={value || placeholderValue}
    >
      <input
        ref={inputRef}
        readOnly={readonly || readOnlyProp}
        disabled={isDisabled}
        name={name}
        className={clsx(
          'col-start-1 row-start-1 w-auto min-w-[0.5em] flex-shrink resize-none appearance-none bg-base-white text-md outline-none outline-0',
          {
            'text-gray-900 transition-colors placeholder:text-gray-400 md:hover:text-blue-400 md:placeholder:hover:text-blue-400':
              !isError && !isDisabled,
            'text-gray-400 placeholder:text-gray-300':
              isDisabled && !isTokenSelectionDisabled,
            'text-gray-500 placeholder:text-gray-300':
              isDisabled && isTokenSelectionDisabled,
            'bg-transparent': isDisabled,
            'text-negative-400 placeholder:text-negative-400':
              !isDisabled && isError,
          },
        )}
        placeholder={placeholderValue}
        value={value}
        autoComplete="off"
        onChange={handleFieldChange}
        onBlur={onBlur}
        size={1}
      />
      <span className="col-start-2 row-start-1">
        <div className="flex-shrink-0 sm:relative">
          {isTokenSelectionDisabled ? (
            selectedTokenContent
          ) : (
            <>
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
                    className="absolute z-sidebar w-full max-w-[calc(100%-2.25rem)] px-2 py-6 sm:w-auto sm:min-w-80 sm:max-w-none"
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
            </>
          )}
        </div>
      </span>
    </div>
  );
};

AmountField.displayName = displayName;

export default AmountField;
