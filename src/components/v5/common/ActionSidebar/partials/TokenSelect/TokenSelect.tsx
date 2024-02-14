import clsx from 'clsx';
import { isAddress } from 'ethers/lib/utils';
import React, { type FC, useEffect, useState } from 'react';
import { useController } from 'react-hook-form';

import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext.ts';
import useRelativePortalElement from '~hooks/useRelativePortalElement.ts';
import useToggle from '~hooks/useToggle/index.ts';
import { formatText } from '~utils/intl.ts';
import { FieldState } from '~v5/common/Fields/consts.ts';
import SearchSelect from '~v5/shared/SearchSelect/SearchSelect.tsx';

import { useTokenSelect } from './hooks.tsx';
import { type TokenSelectProps } from './types.ts';

const displayName = 'v5.common.ActionsContent.partials.TokenSelect';

const TokenSelect: FC<TokenSelectProps> = ({ name }) => {
  const [searchError, setSearchError] = useState(false);
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
  });
  const isError = !!error;
  const [
    isTokenSelectVisible,
    {
      toggle: toggleTokenSelect,
      toggleOff: toggleTokenSelectOff,
      registerContainerRef,
    },
  ] = useToggle();
  const {
    tokenOptions,
    isRemoteTokenAddress,
    renderButtonContent,
    isNativeToken,
    colonyTokens,
  } = useTokenSelect(field.value);
  const { portalElementRef, relativeElementRef } = useRelativePortalElement<
    HTMLButtonElement,
    HTMLDivElement
  >([isTokenSelectVisible]);
  const { readonly } = useAdditionalFormOptionsContext();

  useEffect(() => {
    if (!isTokenSelectVisible) {
      setSearchError(false);
    }
  }, [isTokenSelectVisible]);

  return (
    <div className="sm:relative w-full">
      {readonly ? (
        <div className="flex text-md">{renderButtonContent()}</div>
      ) : (
        <>
          <button
            type="button"
            ref={relativeElementRef}
            className={clsx(
              'flex text-md transition-colors md:hover:text-blue-400',
              {
                'text-gray-400': !isError,
                'text-negative-400': isError,
                'pointer-events-none': isNativeToken,
              },
            )}
            onClick={toggleTokenSelect}
            aria-label={formatText({ id: 'manageTokensTable.select' })}
          >
            {renderButtonContent()}
          </button>
          {isTokenSelectVisible && (
            <SearchSelect
              showEmptyContent={!isRemoteTokenAddress}
              items={[
                isRemoteTokenAddress
                  ? { ...tokenOptions, options: [] }
                  : tokenOptions,
              ]}
              state={searchError ? FieldState.Error : undefined}
              message={
                searchError ? (
                  <span className="text-sm text-negative-400">
                    {formatText({ id: 'manageTokensTable.error' })}
                  </span>
                ) : undefined
              }
              onSearch={(query) => {
                const isColonyNativeToken = colonyTokens.some(
                  (token) => token?.token.tokenAddress === query,
                );
                setSearchError(isColonyNativeToken);

                if (isColonyNativeToken) {
                  return;
                }

                field.onChange(isAddress(query) ? query : undefined);
              }}
              onSelect={(value) => {
                field.onChange(value);
                toggleTokenSelectOff();
              }}
              ref={(ref) => {
                registerContainerRef(ref);
                portalElementRef.current = ref;
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

TokenSelect.displayName = displayName;

export default TokenSelect;
