import React, { FC } from 'react';

import { TextWithValueProps } from './types';

const TextWithValue: FC<TextWithValueProps> = ({ children, text }) => (
  <div className="flex items-center justify-between gap-2">
    <span className="text-sm text-gray-600">{text}</span>
    {children}
  </div>
);

export default TextWithValue;
