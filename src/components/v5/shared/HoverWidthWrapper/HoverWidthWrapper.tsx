import React, { FC, PropsWithChildren } from 'react';
import clsx from 'clsx';
import { HoverWidthWrapperProps } from './types';

const HoverWidthWrapper: FC<PropsWithChildren<HoverWidthWrapperProps>> = ({
  hoverClassName,
  hoverElement: HoverElement = 'div',
  children,
}) => (
  <>
    {children}
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
