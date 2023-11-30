import React, { FC, useState } from 'react';
import { useIntl } from 'react-intl';
import { usePopperTooltip } from 'react-popper-tooltip';

import { useMobile } from '~hooks';
import FilterButton from '~v5/shared/Filter/FilterButton';
import Modal from '~v5/shared/Modal';
import PopoverBase from '~v5/shared/PopoverBase';
import Button from '~v5/shared/Button';
import Icon from '~shared/Icon';
import { useFilterContext } from '~context/FilterContext';

import TableFiltering from '../TableFiltering';
import FilterOptions from './partials/FilterOptions';
import SearchInput from './partials/SearchInput';
import { FilterProps } from './types';

const displayName = 'v5.common.Filter';

const Filter: FC<FilterProps> = ({ excludeFilterType, customLabel }) => {
  const { formatMessage } = useIntl();
  const [isOpened, setOpened] = useState(false);
  const [isSearchOpened, setIsSearchOpened] = useState(false);
  const isMobile = useMobile();
  const {
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible: isFiltersOpen,
  } = usePopperTooltip({
    delayShow: 200,
    delayHide: 200,
    placement: 'bottom-start',
    trigger: 'click',
    interactive: true,
  });

  const { selectedFilterCount } = useFilterContext();

  return (
    <>
      {isMobile ? (
        <div className="flex items-center gap-2">
          <FilterButton
            isOpen={isOpened}
            onClick={() => setOpened(!isOpened)}
            numberSelectedFilters={selectedFilterCount}
          />
          <Button
            mode="tertiary"
            className="sm:hidden flex"
            size="small"
            aria-label={formatMessage({ id: 'ariaLabel.openSearchModal' })}
            onClick={() => setIsSearchOpened(true)}
          >
            <Icon name="magnifying-glass" appearance={{ size: 'tiny' }} />
          </Button>
          <Modal
            isFullOnMobile={false}
            onClose={() => setOpened(false)}
            isOpen={isOpened}
          >
            <FilterOptions excludeFilterType={excludeFilterType} />
          </Modal>
          <Modal
            isFullOnMobile={false}
            onClose={() => setIsSearchOpened(false)}
            isOpen={isSearchOpened}
          >
            <p className="text-4 text-gray-400 mb-4">
              {formatMessage({ id: 'filter.search.title' })}
            </p>
            <div className="sm:px-3.5 sm:mb-6">
              <SearchInput
                onSearchButtonClick={() => setIsSearchOpened(false)}
              />
            </div>
          </Modal>
        </div>
      ) : (
        <>
          <div className="flex flex-row gap-2">
            <TableFiltering />
            <FilterButton
              isOpen={isFiltersOpen}
              setTriggerRef={setTriggerRef}
              customLabel={customLabel}
            />
          </div>
          {isFiltersOpen && (
            <PopoverBase
              setTooltipRef={setTooltipRef}
              tooltipProps={getTooltipProps}
              withTooltipStyles={false}
              cardProps={{
                rounded: 's',
                hasShadow: true,
                className: 'pt-6 pb-4 px-2.5',
              }}
              classNames="w-full sm:max-w-[17.375rem]"
            >
              <div className="sm:px-3.5 sm:mb-6">
                <SearchInput
                  onSearchButtonClick={() => setIsSearchOpened(false)}
                />
              </div>
              <FilterOptions excludeFilterType={excludeFilterType} />
            </PopoverBase>
          )}
        </>
      )}
    </>
  );
};

Filter.displayName = displayName;

export default Filter;
