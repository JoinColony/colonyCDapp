import { CaretDown } from '@phosphor-icons/react';
import clsx from 'clsx';
import React from 'react';

import { formatText } from '~utils/intl.ts';
import { CardSelect } from '~v5/common/Fields/CardSelect/index.ts';

import Link from '../Link/index.ts';

import { type BreadCrumbsCardSelectItem } from './types.ts';

const displayName = 'v5.Breadcrumbs.BreadcrumbsCardSelect';

interface Props {
  item: BreadCrumbsCardSelectItem;
}

const BreadcrumbsCardSelect = ({ item }: Props) => {
  const options =
    'dropdownOptions' in item
      ? item.dropdownOptions.map(({ href, label, color, ...option }) => ({
          label: (
            <Link
              to={href}
              className={clsx({
                'flex items-center w-full gap-2 px-4 py-2 transition-none sm:hover:!text-gray-900':
                  !!color,
              })}
            >
              {color && <span className={clsx(color, 'w-3.5 h-3.5 rounded')} />}
              {label}
            </Link>
          ),
          value: href,
          ...option,
        }))
      : [];
  return (
    <CardSelect<string>
      togglerClassName="uppercase tracking-[.075rem] text-3 md:hover:!text-blue-400"
      options={options}
      title={formatText({ id: 'breadcrumbs.teams' })}
      value={item.selectedValue}
      cardClassName="sm:!max-w-[13.5rem] !w-full"
      renderOptionWrapper={(props, label) => <div {...props}>{label}</div>}
      itemClassName="text-md md:transition-colors md:hover:font-medium md:hover:bg-gray-50 rounded w-full cursor-pointer"
      renderSelectedValue={(_, placeholder, isSelectVisible) => {
        const { dropdownOptions } = item;
        const selectedOption = dropdownOptions?.find(
          ({ href }) => href === item.selectedValue,
        )?.label;

        return (
          <span className="flex items-center">
            {selectedOption || placeholder}{' '}
            <CaretDown
              className={clsx(
                '!h-[0.75rem] !w-[0.75rem] text-[.625rem] fill-current ml-2 transition-transform',
                {
                  'rotate-180': isSelectVisible,
                },
              )}
              size={10}
            />
          </span>
        );
      }}
    />
  );
};

BreadcrumbsCardSelect.displayName = displayName;

export default BreadcrumbsCardSelect;
