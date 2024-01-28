import React from 'react';

import { type RenderMeatBallItemWrapper } from './types.ts';

export const DEFAULT_ITEM_WRAPPER_RENDERER: RenderMeatBallItemWrapper = (
  props,
  children,
) => (
  <button type="button" {...props}>
    {children}
  </button>
);
