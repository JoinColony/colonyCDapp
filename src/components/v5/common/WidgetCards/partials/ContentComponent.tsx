import { type Icon } from '@phosphor-icons/react';
import React, { type FC, type PropsWithChildren } from 'react';

import { IconWrapper } from './IconWrapper.tsx';
import { TitleComponent } from './TitleComponent.tsx';

interface ContentProps {
  Icon?: Icon;
  title?: React.ReactNode;
}

export const ContentComponent: FC<PropsWithChildren<ContentProps>> = ({
  Icon,
  title,
  children,
}) => (
  <>
    {Icon ? (
      <IconWrapper Icon={Icon}>
        {title && <TitleComponent title={title} />}
        {children}
      </IconWrapper>
    ) : (
      <>
        {title && <TitleComponent title={title} />}
        {children}
      </>
    )}
  </>
);
