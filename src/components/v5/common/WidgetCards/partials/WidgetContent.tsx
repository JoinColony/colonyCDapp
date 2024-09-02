import { type Icon } from '@phosphor-icons/react';
import React, { type FC, type PropsWithChildren } from 'react';

import { WidgetSubTitle } from './WidgetSubTitle.tsx';
import { WidgetIconWrapper } from './WidgetIconWrapper.tsx';
import { WidgetTitle } from './WidgetTitle.tsx';

interface WidgetContentProps {
  Icon?: Icon;
  title?: React.ReactNode;
  subTitle?: React.ReactNode;
}

export const WidgetContent: FC<PropsWithChildren<WidgetContentProps>> = ({
  Icon,
  title,
  subTitle,
  children,
}) => (
  <>
    {Icon ? (
      <WidgetIconWrapper Icon={Icon}>
        {title && <WidgetTitle title={title} />}
        {subTitle && <WidgetSubTitle title={subTitle} />}
        {children}
      </WidgetIconWrapper>
    ) : (
      <>
        {title && <WidgetTitle title={title} />}
        {subTitle && <WidgetSubTitle title={subTitle} />}
        {children}
      </>
    )}
  </>
);
