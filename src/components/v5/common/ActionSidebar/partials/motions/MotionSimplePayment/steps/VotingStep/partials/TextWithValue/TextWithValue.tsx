import React, { FC } from 'react';

import { TextWithValueProps } from './types';

const TextWithValue: FC<TextWithValueProps> = ({ items }) => (
  <dl className="mb-6">
    {items.map(({ key, rightColumn, leftColumn }) => (
      <div
        className="flex items-center justify-between gap-2 mb-2 last:mb-0"
        key={key}
      >
        <dt className="text-sm text-gray-600">{leftColumn}</dt>
        <dd className="text-sm">{rightColumn}</dd>
      </div>
    ))}
  </dl>
);

export default TextWithValue;
