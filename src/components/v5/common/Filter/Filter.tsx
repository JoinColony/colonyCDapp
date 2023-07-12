import React, { FC, useState } from 'react';
import { useMobile } from '~hooks';

import FilterButton from '~v5/shared/Filter/FilterButton';
import FilterOptions from './partials/FilterOptions';
import Modal from '~v5/shared/Modal';
import { filterOptions } from './consts';
import PopoverBase from '~v5/shared/PopoverBase';
import { useMembersPage } from '~frame/v5/pages/MembersPage/hooks';
import TableFiltering from '../TableFiltering';
import { useFilter } from './hooks';

const displayName = 'v5.common.Filter';

const Filter: FC = () => {
  const [isOpened, setOpened] = useState(false);
  const isMobile = useMobile();
  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    useMembersPage();
  const {
    selectedFilters,
    onSelectParentFilter,
    onSelectNestedOption,
    onClearFilters,
    selectedChildOption,
    numberSelectedFilters,
  } = useFilter();

  return (
    <>
      {isMobile ? (
        <>
          <FilterButton
            isOpen={isOpened}
            onClick={() => setOpened(!isOpened)}
            numberSelectedFilters={numberSelectedFilters}
          />
          <Modal
            isFullOnMobile={false}
            onClose={() => setOpened(false)}
            isOpen={isOpened}
          >
            <FilterOptions
              options={filterOptions}
              onSelectParentFilter={onSelectParentFilter}
              onSelectNestedOption={onSelectNestedOption}
              selectedChildOption={selectedChildOption}
            />
          </Modal>
        </>
      ) : (
        <>
          <div className="flex flex-row gap-2">
            {!!selectedFilters?.length && (
              <TableFiltering
                filterType="contributor"
                filterOptions={selectedFilters}
                onClick={() => onClearFilters()}
              />
            )}
            <FilterButton isOpen={visible} setTriggerRef={setTriggerRef} />
          </div>
          {visible && (
            <PopoverBase
              setTooltipRef={setTooltipRef}
              tooltipProps={getTooltipProps}
              withTooltipStyles={false}
              cardProps={{
                rounded: 's',
                hasShadow: true,
                className: 'py-4 px-2',
              }}
              classNames="w-full sm:max-w-[17.375rem]"
            >
              <FilterOptions
                options={filterOptions}
                onSelectParentFilter={onSelectParentFilter}
                onSelectNestedOption={onSelectNestedOption}
                selectedChildOption={selectedChildOption}
              />
            </PopoverBase>
          )}
        </>
      )}
    </>
  );
};

Filter.displayName = displayName;

export default Filter;
