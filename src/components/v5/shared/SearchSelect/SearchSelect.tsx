import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import debounce from 'lodash/debounce';
import React, {
  type FC,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { accordionAnimation } from '~constants/accordionAnimation.ts';
import { useMobile } from '~hooks/index.ts';
import Icon from '~shared/Icon/index.ts';
import { SpinnerLoader } from '~shared/Preloaders/index.ts';
import { formatText } from '~utils/intl.ts';
import EmptyContent from '~v5/common/EmptyContent/index.ts';
import Avatar from '~v5/shared/Avatar/index.ts';
import Portal from '~v5/shared/Portal/index.ts';

import MenuContainer from '../MenuContainer/index.ts';

import { useSearchSelect } from './hooks.ts';
import SearchInput from './partials/SearchInput/index.ts';
import SearchItem from './partials/SearchItem/index.ts';
import { type SearchSelectProps } from './types.ts';

const displayName = 'v5.SearchSelect';

const SearchSelect = React.forwardRef<HTMLDivElement, SearchSelectProps>(
  (
    {
      items,
      onSelect,
      isLoading,
      hideSearchOnMobile,
      onSearch,
      showEmptyContent = true,
      showSearchValueAsOption = false,
      state,
      message,
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

    const defaultOpenedAccordions = useMemo(
      () =>
        items.filter(({ isAccordion }) => isAccordion).map(({ key }) => key),
      [items],
    );

    const [openedAccordions, setOpenedAccordions] = useState<string[]>(
      defaultOpenedAccordions,
    );

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

    const handleAccordionClick = useCallback((key: string) => {
      setOpenedAccordions((prev) => {
        if (prev.includes(key)) {
          return prev.filter((item) => item !== key);
        }

        return [...prev, key];
      });
    }, []);

    const content = (
      <>
        <div
          className={clsx('px-3.5', {
            'mb-5': filteredList.length > 0 || showEmptyContent,
          })}
        >
          {isMobile && hideSearchOnMobile ? (
            <p className="text-4 text-gray-400 uppercase">
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
        {isLoading && (
          <div className="flex justify-center h-5">
            <SpinnerLoader appearance={{ size: 'medium' }} />
          </div>
        )}
        {!isLoading && (
          <div className="pr-1 sm:w-full overflow-y-scroll max-h-[calc(100vh-12rem)] sm:max-h-full px-1.5">
            <div>
              {filteredList.length > 0 ? (
                filteredList.map(({ options, title, isAccordion, key }) =>
                  isAccordion ? (
                    <div className="mb-[0.625rem] last:mb-0" key={key}>
                      <div className="flex items-center justify-between px-2">
                        <h5 className="text-4 text-gray-400 mb-2 uppercase">
                          {formatText(title)}
                        </h5>
                        {isAccordion && (
                          <button
                            type="button"
                            className="text-gray-700 w-4 h-4 justify-center items-end flex"
                            onClick={() => handleAccordionClick(key)}
                          >
                            <span className="text-gray-700 md:hover:text-blue-400">
                              <Icon
                                name={
                                  openedAccordions.includes(key)
                                    ? 'caret-up'
                                    : 'caret-down'
                                }
                                appearance={{ size: 'extraTiny' }}
                              />
                            </span>
                          </button>
                        )}
                      </div>
                      <AnimatePresence>
                        {openedAccordions.includes(key) && (
                          <motion.div
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={accordionAnimation}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                            className="overflow-hidden"
                          >
                            <SearchItem options={options} onChange={onSelect} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <div key={key} className="mb-[0.625rem] last:mb-0">
                      <h5 className="text-4 text-gray-400 mb-2 uppercase pl-2">
                        {formatText(title)}
                      </h5>
                      <SearchItem options={options} onChange={onSelect} />
                    </div>
                  ),
                )
              ) : (
                <>
                  {showSearchValueAsOption && (
                    <button
                      type="button"
                      className="text-sm md:hover:text-blue-400 flex items-center gap-2 min-h-[3.125rem] justify-center"
                      onClick={() => onSelect?.(searchValue)}
                    >
                      <Avatar />
                      <span className="max-w-[15.625rem] truncate">
                        {searchValue}
                      </span>
                    </button>
                  )}
                  {showEmptyContent && (
                    <EmptyContent
                      icon="binoculars"
                      title={{ id: 'actionSidebar.emptyTitle' }}
                      description={{ id: 'actionSidebar.emptyDescription' }}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </>
    );

    return (
      <Portal>
        <MenuContainer
          className="py-6 px-2.5 w-full bg-base-white max-w-[calc(100%-2.25rem)] sm:max-w-[20.375rem] z-[60] absolute max-h-[37.5rem]"
          hasShadow
          rounded="s"
          ref={ref}
        >
          {content}
        </MenuContainer>
      </Portal>
    );
  },
);

(SearchSelect as FC).displayName = displayName;

export default SearchSelect;
