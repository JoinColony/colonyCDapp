import React, { FC } from 'react';
import clsx from 'clsx';

import { CardSelect } from '~v5/common/Fields/CardSelect';

import Link from '../Link';

import { BreadcrumbsProps } from './types';
import Icon from '~shared/Icon';

const displayName = 'v5.Breadcrumbs';

const Breadcrumbs: FC<BreadcrumbsProps> = ({ items, className }) => {
  return items.length ? (
    <ul
      className={clsx(
        className,
        'flex flex-wrap items-center uppercase text-gray-900 text-3',
      )}
    >
      {items.map(({ key, ...item }) => {
        const options =
          'dropdownOptions' in item
            ? item.dropdownOptions.map(({ href, label, ...option }) => ({
                label: <Link to={href}>{label}</Link>,
                value: href,
                ...option,
              }))
            : [];

        return (
          <li
            className='after:content-["/"] after:mx-2 last:after:hidden'
            key={key}
          >
            {'href' in item ? (
              <Link to={item.href} className="text-inherit">
                {item.label}
              </Link>
            ) : (
              <CardSelect<string>
                togglerClassName="text-inherit uppercase !text-gray-900 text-3 md:hover:!text-blue-400"
                options={options}
                value={item.selectedValue}
                renderSelectedValue={(option, placeholder, isSelectVisible) => {
                  const { label } = option || {};

                  return (
                    <span className="flex items-center">
                      {label || placeholder}{' '}
                      <Icon
                        name="caret-down"
                        appearance={{ size: 'extraExtraTiny' }}
                        className={clsx(
                          'fill-current ml-2 transition-transform',
                          {
                            'rotate-180': isSelectVisible,
                          },
                        )}
                      />
                    </span>
                  );
                }}
              />
            )}
          </li>
        );
      })}
    </ul>
  ) : null;
};

Breadcrumbs.displayName = displayName;

export default Breadcrumbs;
