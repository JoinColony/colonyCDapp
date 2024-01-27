import clsx from 'clsx';
import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import { InformationListProps } from './types.ts';

const displayName = 'v5.InformationList';

const InformationList: FC<InformationListProps> = ({ items, className }) => {
  const { formatMessage } = useIntl();

  return (
    <div
      className={clsx(
        className,
        'rounded border bg-negative-100 border-negative-400 p-[1.125rem] text-negative-400',
      )}
    >
      <ul className="text-sm list-disc pl-4">
        {items.map(({ id, title }) => (
          <li key={id}>{formatMessage(title)}</li>
        ))}
      </ul>
    </div>
  );
};

InformationList.displayName = displayName;

export default InformationList;
