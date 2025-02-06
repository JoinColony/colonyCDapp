import clsx from 'clsx';
import { isAddress } from 'ethers/lib/utils';
import React, { type FC, useEffect, useState, useMemo } from 'react';
import { useController } from 'react-hook-form';

import { apolloClient } from '~apollo';
import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import TokenSelectContextProvider from '~context/TokenSelectContext/TokenSelectContextProvider.tsx';
import {
  GetTokenFromEverywhereDocument,
  type GetTokenFromEverywhereQuery,
  type GetTokenFromEverywhereQueryVariables,
} from '~gql';
import useRelativePortalElement from '~hooks/useRelativePortalElement.ts';
import useToggle from '~hooks/useToggle/index.ts';
import { notNull } from '~utils/arrays/index.ts';
import { formatText } from '~utils/intl.ts';
import { FieldState } from '~v5/common/Fields/consts.ts';

import { useTokenSelect } from './hooks.tsx';
import TokenSearchSelect from './partials/TokenSearchSelect/TokenSearchSelect.tsx';
import { type TokenSelectProps } from './types.ts';

const displayName = 'v5.common.ActionsContent.partials.TokenSelect';

const TokenSelectContent: FC<TokenSelectProps> = ({
  name,
  disabled = false,
  readOnly: readOnlyProp,
  filterOptionsFn,
}) => {
  const { colony } = useColonyContext();
  const [searchError, setSearchError] = useState(false);
  const [tokenError, setTokenError] = useState(false);
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
  const { renderButtonContent } = useTokenSelect(field.value);
  const { portalElementRef, relativeElementRef } = useRelativePortalElement<
    HTMLButtonElement,
    HTMLDivElement
  >([isTokenSelectVisible], {
    top: 8,
  });
  const { readonly } = useAdditionalFormOptionsContext();
  const colonyTokens = useMemo(
    () => colony.tokens?.items.filter(notNull) || [],
    [colony.tokens?.items],
  );

  useEffect(() => {
    if (!isTokenSelectVisible) {
      setSearchError(false);
      setTokenError(false);
    }
  }, [isTokenSelectVisible]);

  return (
    <div className="w-full sm:relative" data-testid="token-select">
      {readonly || readOnlyProp ? (
        <div
          className={clsx('flex text-md', {
            'text-negative-400': isError,
          })}
        >
          {renderButtonContent()}
        </div>
      ) : (
        <>
          <button
            type="button"
            ref={relativeElementRef}
            className={clsx(
              'flex w-full text-md transition-colors md:hover:text-blue-400',
              {
                'text-gray-900': !isError && !disabled && field.value,
                'text-gray-400': !isError && !disabled && !field.value,
                'text-negative-400': isError,
                'text-gray-300': disabled,
              },
            )}
            onClick={toggleTokenSelect}
            aria-label={formatText({ id: 'manageTokensTable.select' })}
          >
            {renderButtonContent()}
          </button>
          {isTokenSelectVisible && (
            <TokenSearchSelect
              state={searchError || tokenError ? FieldState.Error : undefined}
              message={
                searchError || tokenError ? (
                  <span className="text-sm text-negative-400">
                    {formatText({
                      id: searchError
                        ? 'manageTokensTable.error'
                        : 'manageTokensTable.tokenError',
                    })}
                  </span>
                ) : undefined
              }
              onSearch={async (query) => {
                const isColonyToken = colonyTokens.some(
                  ({ token: { tokenAddress } }) => tokenAddress === query,
                );
                setSearchError(isColonyToken);

                if (isColonyToken || !isAddress(query)) {
                  return;
                }

                const {
                  data: { getTokenFromEverywhere },
                } = await apolloClient.query<
                  GetTokenFromEverywhereQuery,
                  GetTokenFromEverywhereQueryVariables
                >({
                  query: GetTokenFromEverywhereDocument,
                  variables: {
                    input: {
                      tokenAddress: query,
                    },
                  },
                });

                setTokenError(!getTokenFromEverywhere);
              }}
              onSelect={(value) => {
                field.onChange(value);
                toggleTokenSelectOff();
              }}
              ref={(ref) => {
                registerContainerRef(ref);
                portalElementRef.current = ref;
              }}
              filterOptionsFn={filterOptionsFn}
            />
          )}
        </>
      )}
    </div>
  );
};

const TokenSelect: FC<TokenSelectProps> = (props) => (
  <TokenSelectContextProvider>
    <TokenSelectContent {...props} />
  </TokenSelectContextProvider>
);

TokenSelect.displayName = displayName;

export default TokenSelect;
