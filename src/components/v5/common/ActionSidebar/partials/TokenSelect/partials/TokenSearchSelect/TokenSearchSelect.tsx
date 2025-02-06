import { Binoculars, Coin } from '@phosphor-icons/react';
import clsx from 'clsx';
import debounce from 'lodash/debounce';
import React, {
  type FC,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useTokenSelectContext } from '~context/TokenSelectContext/TokenSelectContext.ts';
import { useMobile } from '~hooks/index.ts';
import { SpinnerLoader } from '~shared/Preloaders/index.ts';
import { formatText } from '~utils/intl.ts';
import EmptyContent from '~v5/common/EmptyContent/index.ts';
import { FieldState } from '~v5/common/Fields/consts.ts';
import MenuContainer from '~v5/shared/MenuContainer/MenuContainer.tsx';
import Portal from '~v5/shared/Portal/index.ts';
import SearchInput from '~v5/shared/SearchSelect/partials/SearchInput/SearchInput.tsx';

import TokenSearchItem from '../TokenSearchItem/TokenSearchItem.tsx';

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
    const { isLoading: isTokensListDataLoading } = useTokenSelectContext();

    const [searchValue, setSearchValue] = useState('');
    const [debouncedSearchValue, setDebouncedSearchValue] = useState('');
    const isMobile = useMobile();
    const {
      filteredOptions,
      loading: loadingTokenData,
      suggestedOptions,
    } = useSearchSelect(debouncedSearchValue, filterOptionsFn);

    const hasError = state && state === FieldState.Error;

    useEffect(() => {
      const debounceTimeout = setTimeout(() => {
        setDebouncedSearchValue(searchValue);
      }, 500);

      return () => clearTimeout(debounceTimeout);
    }, [searchValue]);

    const handleSearch = useMemo(
      () => debounce(setDebouncedSearchValue, 500),
      [setDebouncedSearchValue],
    );

    const onChange = useCallback(
      (value: string) => {
        onSearch?.(value);
        setSearchValue(value);
        if (value) {
          handleSearch(value);
        } else {
          setDebouncedSearchValue('');
        }
      },
      [handleSearch, onSearch],
    );

    return (
      <Portal>
        <MenuContainer
          className={clsx(
            className,
            'absolute z-dropdown max-h-[37.5rem] w-full max-w-[calc(100%-2.25rem)] bg-base-white px-2.5 py-6 sm:max-w-[20.375rem]',
          )}
          hasShadow
          rounded="s"
          ref={ref}
          testId="token-search-select"
        >
          <div
            className={clsx('px-3.5', {
              'mb-5': !hasError,
            })}
          >
            {isMobile && hideSearchOnMobile ? (
              <p className="uppercase text-gray-400 text-4">
                {formatText({ id: 'actions.selectActionType' })}
              </p>
            ) : (
              <SearchInput
                onChange={onChange}
                state={state}
                message={message}
                value={searchValue}
                placeholder={formatText({
                  id: 'manageTokensTable.select',
                })}
              />
            )}
          </div>
          <div
            className={clsx({
              'flex h-5 justify-center':
                isLoading || isTokensListDataLoading || loadingTokenData,
              'max-h-[calc(100dvh-12rem)] overflow-y-auto px-1.5 pr-1 sm:max-h-none sm:w-full':
                !(isLoading || isTokensListDataLoading || loadingTokenData),
            })}
          >
            {isLoading || isTokensListDataLoading || loadingTokenData ? (
              <SpinnerLoader appearance={{ size: 'medium' }} />
            ) : (
              <>
                {(debouncedSearchValue && !!filteredOptions.length) ||
                (!debouncedSearchValue && !!suggestedOptions.length) ? (
                  <div className="mb-[0.625rem] last:mb-0">
                    {!debouncedSearchValue && (
                      <h5 className="mb-2 pl-2 uppercase text-gray-400 text-4">
                        {formatText({
                          id: 'manageTokensTable.suggestedTokens',
                        })}
                      </h5>
                    )}
                    <TokenSearchItem
                      options={
                        debouncedSearchValue
                          ? filteredOptions
                          : suggestedOptions
                      }
                      onOptionClick={onSelect}
                    />
                  </div>
                ) : (
                  <>
                    {!hasError && (
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
                    )}
                  </>
                )}
              </>
            )}
          </div>
          {additionalButtons}
        </MenuContainer>
      </Portal>
    );
  },
);

(TokenSearchSelect as FC).displayName = displayName;

export default TokenSearchSelect;
