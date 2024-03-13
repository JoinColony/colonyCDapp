import clsx from 'clsx';
import React, { type FC, type PropsWithChildren } from 'react';

import { type HoverWidthWrapperProps } from './types.ts';

const HoverWidthWrapper: FC<PropsWithChildren<HoverWidthWrapperProps>> = ({
  hoverClassName,
  hoverElement: HoverElement = 'div',
  children,
}) => (
  <>
    {children}
    <HoverElement
      className={clsx(
        'invisible h-[.0625rem] overflow-hidden text-transparent',
        hoverClassName,
      )}
    >
      {children}
    </HoverElement>
  </>
);

export default HoverWidthWrapper;
