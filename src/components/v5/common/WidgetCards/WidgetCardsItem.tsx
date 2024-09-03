import { type Icon } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC, type PropsWithChildren } from 'react';

import { tw } from '~utils/css/index.ts';

import { WidgetContent } from './partials/WidgetContent.tsx';

const wrapperClassName = tw`
  flex min-h-[7.4rem] min-w-[16.5rem] items-center justify-between
  gap-2 rounded-lg border px-6 py-6
`;
const hoverClassName = tw`transition-colors hover:border-gray-900 hover:text-gray-900`;

type WidgetCardsItemVariant = 'default' | 'dashed';

interface WidgetCardsItemProps {
  variant?: WidgetCardsItemVariant;
  icon?: Icon;
  title?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const variantClassNames: Record<WidgetCardsItemVariant, string> = {
  default: tw``,
  dashed: tw`border-dashed`,
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
