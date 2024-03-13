import clsx from 'clsx';
import React, { type FC, type PropsWithChildren } from 'react';

import { type HoverWidthWrapperProps } from './types.ts';

const HoverWidthWrapper: FC<PropsWithChildren<HoverWidthWrapperProps>> = ({
  hoverClassName,
  hoverElement: HoverElement = 'div',
  children,
}) => (
  <>
    <div className="flex">{children}</div>
    <HoverElement
      className={clsx(
        'text-transparent h-[.0625rem] overflow-hidden invisible',
        hoverClassName,
      )}
    >
      {children}
    </HoverElement>
  </>
);

export default HoverWidthWrapper;
