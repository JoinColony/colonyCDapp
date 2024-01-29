import clsx from 'clsx';
import React, { type FC } from 'react';

import RowItem from '../RowItem/index.ts';

import { type RowProps } from './types.ts';

const displayName = 'v5.pages.UserProfilePage.partials.Row';

const Row: FC<RowProps> = ({ groups, className }) => (
  <ul>
    {groups?.map((item) => (
      <li
        key={item.key}
        className={clsx(
          className,
          '[&:not(:first-child)]:flex flex-col gap-6 justify-between py-6 first:pt-0 border-b last:border-b-0 border-b-gray-200 last:pb-0',
        )}
      >
        <RowItem {...item} />
        {item.items?.length && (
          <ul className="flex flex-col gap-6">
            {item.items.map((subItem) => (
              <li
                key={subItem.key}
                className="flex flex-col md:flex-row gap-6 md:gap-[6.5rem] justify-between"
              >
                <RowItem {...subItem} />
              </li>
            ))}
          </ul>
        )}
      </li>
    ))}
  </ul>
);

Row.displayName = displayName;

export default Row;
