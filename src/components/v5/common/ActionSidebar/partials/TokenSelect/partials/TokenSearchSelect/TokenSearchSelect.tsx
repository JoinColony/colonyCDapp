import { Binoculars, Coin } from '@phosphor-icons/react';
import React, { type FC, useState } from 'react';

import { useTokenSelectContext } from '~context/TokenSelectContext/TokenSelectContext.ts';
import EmptyContent from '~v5/common/EmptyContent/index.ts';
import { FieldState } from '~v5/common/Fields/consts.ts';
import { renderTokenOption } from '~v5/shared/SearchSelect/partials/OptionRenderer/TokenOptionRenderer.tsx';
import SearchSelect from '~v5/shared/SearchSelect/SearchSelect.tsx';

import { useSearchSelect } from './hooks.ts';
import { type TokenSearchSelectProps } from './types.ts';

const displayName =
  'v5.common.ActionsContent.partials.TokenSelect.partials.TokenSearchSelect';

const TokenSearchSelect = React.forwardRef<
  HTMLDivElement,
  TokenSearchSelectProps
>(
  (
    {
      onSelect,
      isLoading,
      hideSearchOnMobile,
      onSearch,
      state,
      message,
      additionalButtons,
      className,
      filterOptionsFn,
    },
    ref,
  ) => {
    const [debouncedSearchValue, setDebouncedSearchValue] = useState('');
    const hasError = state && state === FieldState.Error;
    const { isLoading: isTokensListDataLoading } = useTokenSelectContext();
    const { items, loading: loadingTokenData } = useSearchSelect(
      debouncedSearchValue,
      filterOptionsFn,
    );

    const handleDebouncedSearch = (value: string) => {
      setDebouncedSearchValue(value);
    };

    return (
      <SearchSelect
        ref={ref}
        isLoading={isLoading || isTokensListDataLoading || loadingTokenData}
        renderOption={renderTokenOption}
        items={items}
        className={className}
        onSelect={onSelect}
        onSearch={onSearch}
        onDebouncedSearch={handleDebouncedSearch}
        showEmptyContent={!hasError}
        showSearchValueAsOption
        additionalButtons={additionalButtons}
        hideSearchOnMobile={hideSearchOnMobile}
        message={message}
        emptyContent={
          <EmptyContent
            icon={debouncedSearchValue ? Binoculars : Coin}
            title={{
              id: debouncedSearchValue
                ? 'manageTokensTable.noTokenFound.title'
                : 'manageTokensTable.addNewToken.title',
            }}
            description={{
              id: debouncedSearchValue
                ? 'manageTokensTable.noTokenFound.description'
                : 'manageTokensTable.addNewToken.description',
            }}
            isDropdown
            className="!p-0"
          />
        }
      />
    );
  },
);

(TokenSearchSelect as FC).displayName = displayName;

export default TokenSearchSelect;
