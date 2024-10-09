import clsx from 'clsx';
import React, { type FC } from 'react';

import RowItem from '../RowItem/index.ts';

import { type RowProps } from './types.ts';

const displayName = 'v5.pages.UserProfilePage.partials.Row';

// @TODO remove this and refactor UserAccountForm like UserPreferencesPage was
const Row: FC<RowProps> = ({ groups, className }) => (
  <ul>
    {groups?.map((item) => (
      <li
        key={item.key}
        className={clsx(
          className,
          'flex-col justify-between gap-6 border-b border-b-gray-200 py-6 first:pt-0 last:border-b-0 last:pb-0 [&:not(:first-child)]:flex',
        )}
      >
        <RowItem {...item} />
        {item.items?.length && (
          <ul className="flex flex-col gap-6">
            {item.items.map((subItem) => (
              <li
                key={subItem.key}
                className="flex flex-col justify-between gap-6 md:flex-row md:gap-[6.5rem]"
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
