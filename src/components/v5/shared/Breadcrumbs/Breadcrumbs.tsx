import clsx from 'clsx';
import React, { FC } from 'react';

import Link from '../Link/index.ts';

import BreadcrumbsCardSelect from './BreadcrumbsCardSelect.tsx';
import { BreadcrumbsItem, BreadcrumbsProps } from './types.ts';

const displayName = 'v5.Breadcrumbs';

const getBreadcrumbItem = (item: BreadcrumbsItem) => {
  if ('href' in item && item.href) {
    return (
      <Link to={item.href} className="text-inherit">
        {item.label}
      </Link>
    );
  }

  if ('dropdownOptions' in item) {
    return <BreadcrumbsCardSelect item={item} />;
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
          className='after:content-["/"] after:mx-2 last:after:hidden'
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
