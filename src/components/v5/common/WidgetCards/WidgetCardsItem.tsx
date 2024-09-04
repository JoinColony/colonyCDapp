import { type Icon } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC, type PropsWithChildren } from 'react';

import { tw } from '~utils/css/index.ts';

import { WidgetContent } from './partials/WidgetContent.tsx';

const wrapperClassName = tw`
  mr-2 flex min-h-[7rem] min-w-[calc(100%-0.2rem)]
  flex-col justify-center rounded-lg border px-6 py-5
  sm:mx-2 sm:min-w-[calc(50%-0.6rem)] lg:min-w-[calc(25%-0.8rem)]
`;
const hoverClassName = tw`transition-colors hover:border-gray-900 hover:text-gray-900`;

type WidgetCardsItemVariant = 'default' | 'dashed';

interface WidgetCardsItemProps {
  variant?: WidgetCardsItemVariant;
  icon?: Icon;
  title?: React.ReactNode;
  subTitle?: React.ReactNode;
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
  subTitle,
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
    <WidgetContent Icon={Icon} title={title} subTitle={subTitle}>
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
