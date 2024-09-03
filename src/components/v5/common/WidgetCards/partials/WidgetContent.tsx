import { type Icon } from '@phosphor-icons/react';
import React, { type FC, type PropsWithChildren } from 'react';

import { WidgetIconWrapper } from './WidgetIconWrapper.tsx';
import { WidgetTitle } from './WidgetTitle.tsx';

interface WidgetContentProps {
  Icon?: Icon;
  title?: React.ReactNode;
}

export const WidgetContent: FC<PropsWithChildren<WidgetContentProps>> = ({
  Icon,
  title,
  children,
}) => (
  <>
    {Icon ? (
      <WidgetIconWrapper Icon={Icon}>
        {title && <WidgetTitle title={title} />}
        {children}
      </WidgetIconWrapper>
    ) : (
      <>
        {title && <WidgetTitle title={title} />}
        {children}
      </>
    )}
  </>
);
