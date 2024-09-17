import clsx from 'clsx';
import React, { type FC } from 'react';

import Link from '../Link/index.ts';

import { type BreadcrumbsItem, type BreadcrumbsProps } from './types.ts';

const displayName = 'v5.Breadcrumbs';

const getBreadcrumbItem = (item: BreadcrumbsItem) => {
  if ('href' in item && item.href) {
    return (
      <Link to={item.href} className="text-inherit">
        {item.label}
      </Link>
    );
  }

  return <h5>{item.label}</h5>;
};

const Breadcrumbs: FC<BreadcrumbsProps> = ({ items, className }) => {
  return items.length ? (
    <ul
      className={clsx(
        className,
        'flex flex-wrap items-center uppercase tracking-[.075rem] text-gray-900 text-3',
      )}
    >
      {items.map((item) => (
        <li
          className='after:mx-2 after:content-["/"] last:after:hidden'
          key={item.key}
        >
          {getBreadcrumbItem(item)}
        </li>
      ))}
    </ul>
  ) : null;
};

Breadcrumbs.displayName = displayName;

export default Breadcrumbs;
