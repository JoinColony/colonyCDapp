import React, { type FC } from 'react';

import { type DescriptionListProps } from './types.ts';

const DescriptionList: FC<DescriptionListProps> = ({ items, className }) => (
  <dl className={className}>
    {items.map(({ key, value, label }) => (
      <div
        className="flex text-sm items-center justify-between gap-2 mb-2 last:mb-0"
        key={key}
      >
        <dt className="text-gray-600">{label}</dt>
        <dd>{value}</dd>
      </div>
    ))}
  </dl>
);

export default DescriptionList;
