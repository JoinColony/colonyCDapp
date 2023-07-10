import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';
import { useMobile } from '~hooks';

import Accordion from '~shared/Extensions/Accordion';
import { useAccordion } from '~shared/Extensions/Accordion/hooks';
import { FilterOptionsProps } from '../types';
import SubNavigationItem from '~v5/shared/SubNavigationItem';

const displayName = 'v5.common.Filter.partials.FilterOptions';

const FilterOptions: FC<FilterOptionsProps> = ({ options }) => {
  const { formatMessage } = useIntl();
  const isMobile = useMobile();
  const { openIndex, onOpenIndexChange } = useAccordion();
  // @TODO: add conditions when filters should be visible / not visible
  // @TODO: add submenu

  return (
    <div>
      <span
        className={clsx('flex text-4 text-gray-400 uppercase', {
          'ml-5 mb-1': !isMobile,
          'mb-4': isMobile,
        })}
      >
        {formatMessage({ id: 'filters' })}
      </span>
      {isMobile ? (
        <Accordion
          items={options}
          openIndex={openIndex}
          onOpenIndexChange={onOpenIndexChange}
          mode="secondary"
        />
      ) : (
        <ul className="flex flex-col">
          {options?.map(({ id, iconName, title }) => (
            <SubNavigationItem key={id} iconName={iconName} title={title} />
          ))}
        </ul>
      )}
    </div>
  );
};

FilterOptions.displayName = displayName;

export default FilterOptions;
