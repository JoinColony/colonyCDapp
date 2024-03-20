import clsx from 'clsx';
import React, { type FC } from 'react';
import { useIntl } from 'react-intl';

import { type InformationListProps } from './types.ts';

const displayName = 'v5.InformationList';

const InformationList: FC<InformationListProps> = ({ items, className }) => {
  const { formatMessage } = useIntl();

  return (
    <div
      className={clsx(
        className,
        'rounded border border-negative-400 bg-negative-100 p-[1.125rem] text-negative-400',
      )}
    >
      <ul className="list-disc pl-4 text-sm">
        {items.map(({ id, title }) => (
          <li key={id}>{formatMessage(title)}</li>
        ))}
      </ul>
    </div>
  );
};

InformationList.displayName = displayName;

export default InformationList;
