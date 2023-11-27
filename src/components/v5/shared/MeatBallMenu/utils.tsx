import React from 'react';

import { RenderMeatBallItemWrapper } from './types';

export const DEFAULT_ITEM_WRAPPER_RENDERER: RenderMeatBallItemWrapper = (
  props,
  children,
) => (
  <button type="button" {...props}>
    {children}
  </button>
);
