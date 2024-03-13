import { X } from '@phosphor-icons/react';
import React, { type PropsWithChildren, type FC } from 'react';

import { type ActiveFiltersBoxProps } from './types.ts';

const ActiveFiltersBox: FC<PropsWithChildren<ActiveFiltersBoxProps>> = ({
  onClose,
  children,
}) => (
  <div className="flex items-center justify-end rounded-lg bg-blue-100 px-3 py-2 text-sm text-blue-400">
    <div>{children}</div>
    <button type="button" onClick={onClose} className="ml-2 flex-shrink-0">
      <X size={12} className="text-inherit" />
    </button>
  </div>
);

export default ActiveFiltersBox;
