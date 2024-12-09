import React, { type FC } from 'react';

import { type DescriptionListProps } from './types.ts';

const DescriptionList: FC<DescriptionListProps> = ({ items, className }) => (
  <dl className={className}>
    {items.map(({ key, value, label }) => (
      <div
        className="mb-2 flex items-center justify-between gap-2 text-sm last:mb-0"
        key={key}
      >
        <dt className="text-gray-600">{label}</dt>
        <dd>{value}</dd>
      </div>
    ))}
  </dl>
);

export default DescriptionList;
