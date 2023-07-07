import React, { FC, useState } from 'react';
import { useMobile } from '~hooks';

import FilterButton from '~v5/shared/Filter/FilterButton';
import FilterOptions from './partials/FilterOptions';
import Modal from '~v5/shared/Modal';
import { filterOptions } from './consts';
import PopoverBase from '~v5/shared/PopoverBase';
import { useMembersPage } from '~frame/v5/pages/MembersPage/hooks';

const displayName = 'v5.common.Filter';

const Filter: FC = () => {
  const [isOpened, setOpened] = useState(false);
  const isMobile = useMobile();
  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    useMembersPage();

  return (
    <>
      {isMobile ? (
        <>
          <FilterButton
            isOpen={isOpened}
            onClick={() => setOpened(!isOpened)}
          />
          <Modal
            isFullOnMobile={false}
            onClose={() => setOpened(false)}
            isOpen={isOpened}
          >
            <FilterOptions options={filterOptions} />
          </Modal>
        </>
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
