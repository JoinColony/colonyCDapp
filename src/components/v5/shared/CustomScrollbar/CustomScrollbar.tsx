import React, { FC, PropsWithChildren } from 'react';
import clsx from 'clsx';

import { CustomScrollbarProps } from './types';

const displayName = 'v5.CustomScrollbar';

const CustomScrollbar: FC<PropsWithChildren<CustomScrollbarProps>> = ({
  children,
  className,
}) => (
  <div
    className={clsx(
      className,
      'customScrollbar pr-1 md:max-h-[50vh] w-full overflow-y-scroll',
    )}
  >
    {children}
  </div>
);

CustomScrollbar.displayName = displayName;

export default CustomScrollbar;
