import { type Icon } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC, type PropsWithChildren } from 'react';

import { WidgetContent } from './partials/WidgetContent.tsx';
import { wrapperClassName, hoverClassName } from './styles.ts';

type WidgetCardsItemVariant = 'default' | 'dashed';

interface WidgetCardsItemProps {
  variant?: WidgetCardsItemVariant;
  icon?: Icon;
  title?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const variantClassNames: Record<WidgetCardsItemVariant, string> = {
  default: '',
  dashed: 'border-dashed',
};

export const WidgetCardsItem: FC<PropsWithChildren<WidgetCardsItemProps>> = ({
  children,
  variant = 'default',
  icon: Icon,
  title,
  onClick,
  className,
}) => {
  const wrapperVariantClassName = variantClassNames[variant];
  const commonClassNames = clsx(
    className,
    wrapperClassName,
    wrapperVariantClassName,
  );

  const content = (
    <WidgetContent Icon={Icon} title={title}>
      {children}
    </WidgetContent>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        type="button"
        className={clsx(commonClassNames, hoverClassName)}
      >
        {content}
      </button>
    );
  }

  return <div className={commonClassNames}>{content}</div>;
};
