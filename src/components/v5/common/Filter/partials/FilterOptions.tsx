import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';
import { useMobile } from '~hooks';

import Icon from '~shared/Icon';
import styles from './FilterOptions.module.css';
import Accordion from '~shared/Extensions/Accordion';
import { useAccordion } from '~shared/Extensions/Accordion/hooks';
import { FilterOptionsProps } from '../types';

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
        className={clsx('flex text-xs font-medium text-gray-400 uppercase', {
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
          {options?.map((item) => (
            <li className={styles.li}>
              <Icon name={item.iconName} appearance={{ size: 'tiny' }} />

              {formatMessage({ id: item.title })}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

FilterOptions.displayName = displayName;

export default FilterOptions;
