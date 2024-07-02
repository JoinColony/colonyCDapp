import { Binoculars } from '@phosphor-icons/react';
import clsx from 'clsx';
import debounce from 'lodash/debounce';
import React, {
  type FC,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useMobile } from '~hooks/index.ts';
import { SpinnerLoader } from '~shared/Preloaders/index.ts';
import { formatText } from '~utils/intl.ts';
import EmptyContent from '~v5/common/EmptyContent/index.ts';
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
      items,
      onSelect,
      isLoading,
      hideSearchOnMobile,
      onSearch,
      showEmptyContent = true,
      state,
      message,
      additionalButtons,
      className,
    },
    ref,
  ) => {
    const [searchValue, setSearchValue] = useState('');
    const [debouncedSearchValue, setDebouncedSearchValue] = useState('');
    const isMobile = useMobile();
    const filteredList = useSearchSelect(items, debouncedSearchValue);

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
        >
          <div
            className={clsx('px-3.5', {
              'mb-5': filteredList.length > 0 || showEmptyContent,
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
                  id: 'placeholder.search',
                })}
              />
            )}
          </div>
          <div
            className={clsx({
              'flex h-5 justify-center': isLoading,
              'max-h-[calc(100vh-12rem)] overflow-y-auto px-1.5 pr-1 sm:max-h-none sm:w-full':
                !isLoading,
            })}
          >
            {isLoading ? (
              <SpinnerLoader appearance={{ size: 'medium' }} />
            ) : (
              <>
                {filteredList.length > 0
                  ? filteredList.map(({ options, title, key }) => (
                      <div key={key} className="mb-[0.625rem] last:mb-0">
                        <h5 className="mb-2 pl-2 uppercase text-gray-400 text-4">
                          {title}
                        </h5>
                        <TokenSearchItem
                          options={options}
                          onOptionClick={onSelect}
                        />
                      </div>
                    ))
                  : showEmptyContent && (
                      <EmptyContent
                        icon={Binoculars}
                        title={{ id: 'actionSidebar.emptyTitle' }}
                        description={{ id: 'actionSidebar.emptyDescription' }}
                      />
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
