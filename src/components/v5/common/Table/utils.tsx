import React from 'react';

import { RenderCellWrapper } from './types.ts';

export const getDefaultRenderCellWrapper =
  <T,>(): RenderCellWrapper<T> =>
  (cellClassName, content) =>
    <div className={cellClassName}>{content}</div>;
