import React, { type PropsWithChildren, type FC } from 'react';
import { FormattedMessage } from 'react-intl';

import { type LinkItemProps } from './types.ts';

const displayName = 'v5.common.SubNavigation.partials.LinkItem';

const LinkItem: FC<PropsWithChildren<LinkItemProps>> = ({
  title,
  description,
  statusBadge,
  onClick,
}) => (
  <li className="sm:mb-2 sm:last:mb-0">
    <button
      type="button"
      className="flex w-full flex-col px-6 py-2 hover:bg-gray-50 sm:mx-2 sm:w-[calc(100%-1rem)] sm:rounded sm:px-4"
      onClick={onClick}
    >
      <span className="mb-1 flex w-full justify-between text-gray-900 heading-5">
        <FormattedMessage {...title} />
        <span className="ml-1 shrink-0">{statusBadge}</span>
      </span>
      <span className="flex-wrap text-left text-md text-gray-600">
        <FormattedMessage {...description} />
      </span>
    </button>
  </li>
);
LinkItem.displayName = displayName;

export default LinkItem;
