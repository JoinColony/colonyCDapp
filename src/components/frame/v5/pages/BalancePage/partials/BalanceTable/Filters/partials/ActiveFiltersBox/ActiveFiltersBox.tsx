import { X } from '@phosphor-icons/react';
import React, { type PropsWithChildren, type FC } from 'react';

import { type ActiveFiltersBoxProps } from './types.ts';

const ActiveFiltersBox: FC<PropsWithChildren<ActiveFiltersBoxProps>> = ({
  onClose,
  children,
}) => (
  <div className="px-3 py-2 bg-blue-100 text-blue-400 rounded-lg flex items-center justify-end text-sm">
    <div>{children}</div>
    <button type="button" onClick={onClose} className="ml-2 flex-shrink-0">
      <X size={12} className="text-inherit" />
    </button>
  </div>
);

export default ActiveFiltersBox;
