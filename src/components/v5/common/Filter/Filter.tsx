import React, { FC, useState } from 'react';
import { useDetectClickOutside, useMobile } from '~hooks';

import { FilterProps } from './types';
import FilterButton from '~v5/shared/Filter/FilterButton';
import FilterOptions from './partials/FilterOptions';
import Modal from '~v5/shared/Modal';
import { filterOptions } from './consts';
import FilterPopover from './partials/FilterPopover';

const displayName = 'v5.common.Filter';

const Filter: FC<FilterProps> = () => {
  const [isOpened, setOpened] = useState(false);
  const isMobile = useMobile();

  const ref = useDetectClickOutside({
    onTriggered: () => setOpened(false),
  });

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
        <div ref={ref}>
          <FilterPopover isOpened={isOpened} setOpened={setOpened} />
        </div>
      )}
    </>
  );
};

Filter.displayName = displayName;

export default Filter;
