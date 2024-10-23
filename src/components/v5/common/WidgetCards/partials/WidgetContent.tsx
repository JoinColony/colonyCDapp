import { type Icon } from '@phosphor-icons/react';
import React, { type FC, type PropsWithChildren } from 'react';

import { WidgetIconWrapper } from './WidgetIconWrapper.tsx';

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
}) => {
  const content = (
    <>
      {title && <h3 className="text-md">{title}</h3>}
      {subTitle && <h4 className="heading-4">{subTitle}</h4>}
      {children}
    </>
  );

  return Icon ? (
    <WidgetIconWrapper Icon={Icon}>{content}</WidgetIconWrapper>
  ) : (
    content
  );
};
