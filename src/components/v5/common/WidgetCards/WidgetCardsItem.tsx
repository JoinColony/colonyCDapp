import { type Icon } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC, type PropsWithChildren } from 'react';

import { tw } from '~utils/css/index.ts';

import { WidgetContent } from './partials/WidgetContent.tsx';

const wrapperClassName = tw`
  flex max-h-[6.9379rem] min-h-[6.5rem] min-w-[15.625rem]
  select-none flex-col justify-center rounded-lg border
  px-6 py-5 text-left outline-offset-[-1px]
`;
const hoverClassName = tw`transition-colors hover:bg-gray-25`;

type WidgetCardsItemVariant = 'default' | 'dashed';

interface WidgetCardsItemProps {
  variant?: WidgetCardsItemVariant;
  icon?: Icon;
  title?: React.ReactNode;
  subTitle?: React.ReactNode;
  onClick?: () => void;
  isLoading?: boolean;
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
  subTitle,
  onClick,
  isLoading,
  className,
}) => {
  const wrapperVariantClassName = variantClassNames[variant];
  const commonClassNames = clsx(
    className,
    wrapperClassName,
    wrapperVariantClassName,
  );

  const content = (
    <WidgetContent Icon={Icon} title={title} subTitle={subTitle}>
      {children}
    </WidgetContent>
  );

  if (onClick && !isLoading) {
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
