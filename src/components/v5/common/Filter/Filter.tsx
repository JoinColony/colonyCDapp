import React, { FC, useState } from 'react';
import { useIntl } from 'react-intl';

import { useMobile } from '~hooks';
import FilterButton from '~v5/shared/Filter/FilterButton';
import FilterOptions from './partials/FilterOptions';
import Modal from '~v5/shared/Modal';
import PopoverBase from '~v5/shared/PopoverBase';
import { useMembersPage } from '~frame/v5/pages/MembersPage/hooks';
import SearchInput from './partials/SearchInput';
import Button from '~v5/shared/Button';
import Icon from '~shared/Icon';
import { filterOptions } from './consts';

const displayName = 'v5.common.Filter';

const Filter: FC = () => {
  const { formatMessage } = useIntl();
  const [isOpened, setOpened] = useState(false);
  const [isSearchOpened, setIsSearchOpened] = useState(false);
  const isMobile = useMobile();
  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    useMembersPage();

  return (
    <>
      {isMobile ? (
        <div className="flex items-center gap-2">
          <FilterButton
            isOpen={isOpened}
            onClick={() => setOpened(!isOpened)}
          />
          <Button
            mode="primaryOutline"
            className="sm:hidden flex min-h-[2.25rem]"
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
            <FilterOptions options={filterOptions} />
          </Modal>
          <Modal
            isFullOnMobile={false}
            onClose={() => setIsSearchOpened(false)}
            isOpen={isSearchOpened}
          >
            <p className="text-4 text-gray-400 mb-4">
              {formatMessage({ id: 'filter.search.title' })}
            </p>
            <SearchInput onSearchButtonClick={() => setIsSearchOpened(false)} />
          </Modal>
        </div>
      ) : (
        <>
          <FilterButton isOpen={visible} setTriggerRef={setTriggerRef} />
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
              <SearchInput
                onSearchButtonClick={() => setIsSearchOpened(false)}
              />
              <FilterOptions options={filterOptions} />
            </PopoverBase>
          )}
        </>
      )}
    </>
  );
};

Filter.displayName = displayName;

export default Filter;
