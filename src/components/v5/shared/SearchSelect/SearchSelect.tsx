import React, {
  ChangeEvent,
  ChangeEventHandler,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import debounce from 'lodash/debounce';
import clsx from 'clsx';
import Portal from '~v5/shared/Portal';

import { SearchSelectProps } from './types';
import Card from '../Card';
import { useMobile } from '~hooks';
import Modal from '../Modal';
import { useSearchSelect } from './hooks';
import SearchInput from './partials/SearchInput';
import SearchItem from './partials/SearchItem';
import { accordionAnimation } from '~constants/accordionAnimation';
import Icon from '~shared/Icon';
import { SpinnerLoader } from '~shared/Preloaders';
import Avatar from '~v5/shared/Avatar';
import EmptyContent from '~v5/common/EmptyContent';
import { formatText } from '~utils/intl';

const displayName = 'v5.SearchSelect';

const SearchSelect = React.forwardRef<HTMLDivElement, SearchSelectProps>(
  (
    {
      items,
      onToggle,
      isOpen,
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
    const isMobile = useMobile();
    const filteredList = useSearchSelect(items, searchValue);

    const defaultOpenedAccordions = useMemo(
      () =>
        items.filter(({ isAccordion }) => isAccordion).map(({ key }) => key),
      [items],
    );

    const [openedAccordions, setOpenedAccordions] = useState<string[]>(
      defaultOpenedAccordions,
    );

    const handleSearch = useMemo(
      () => debounce(setSearchValue, 500),
      [setSearchValue],
    );

    const onInput: ChangeEventHandler<HTMLInputElement> = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const { value: inputValue } = e.target;

        onSearch?.(inputValue);
        handleSearch(inputValue);
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
          className={clsx({
            'mb-6': filteredList.length > 0 && showEmptyContent,
          })}
        >
          {isMobile && hideSearchOnMobile ? (
            <p className="text-4 text-gray-400 uppercase">
              {formatText({ id: 'actions.selectActionType' })}
            </p>
          ) : (
            <SearchInput onInput={onInput} state={state} message={message} />
          )}
        </div>
        {isLoading && (
          <div className="flex justify-center h-5">
            <SpinnerLoader appearance={{ size: 'medium' }} />
          </div>
        )}
        {!isLoading && (
          <div className="pr-1 w-full overflow-y-scroll max-h-[calc(100vh-12rem)] sm:max-h-full">
            <div>
              {filteredList.length > 0 ? (
                filteredList.map(({ options, title, isAccordion, key }) =>
                  isAccordion ? (
                    <div className="mb-[0.625rem] last:mb-0" key={key}>
                      <div className="flex items-center justify-between">
                        <h5 className="text-4 text-gray-400 mb-2 uppercase">
                          {formatText(title)}
                        </h5>
                        {isAccordion && (
                          <button
                            type="button"
                            className="text-gray-700"
                            onClick={() => handleAccordionClick(key)}
                          >
                            <Icon
                              name={
                                openedAccordions.includes(key)
                                  ? 'caret-up'
                                  : 'caret-down'
                              }
                              appearance={{ size: 'extraTiny' }}
                            />
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
                      <h5 className="text-4 text-gray-400 mb-2 uppercase">
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
                      className="text-sm md:hover:text-blue-400 flex items-center gap-2 min-h-[3.125rem]
                      "
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

    return isMobile ? (
      <Modal isOpen={isOpen} onClose={onToggle} isFullOnMobile={false}>
        {content}
      </Modal>
    ) : (
      <Portal>
        <Card
          className="py-4 px-2.5 w-full sm:max-w-[20.375rem] z-[60] absolute max-h-[37.5rem]"
          hasShadow
          rounded="s"
          ref={ref}
        >
          {content}
        </Card>
      </Portal>
    );
  },
);

export default Object.assign(SearchSelect, { displayName });
