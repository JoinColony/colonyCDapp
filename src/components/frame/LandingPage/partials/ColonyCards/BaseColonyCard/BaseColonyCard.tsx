import clsx from 'clsx';
import React, { type PropsWithChildren } from 'react';

const displayName = 'frame.LandingPage.ColonyCards.BaseColonyCard';

export interface BaseColonyCardProps
  extends PropsWithChildren,
    React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    > {
  avatarPlaceholder: React.ReactNode;
  isClickable?: boolean;
}
const BaseColonyCard = ({
  isClickable,
  avatarPlaceholder,
  children,
  ...props
}: BaseColonyCardProps) => (
  <div
    {...props}
    className={clsx(
      'flex items-center justify-between gap-[.875rem] rounded border px-5 py-4 transition-colors duration-normal',
      {
        'cursor-pointer hover:border-gray-900': isClickable,
      },
    )}
  >
    <div>
      <div className="flex h-8 w-8 items-center justify-center">
        {avatarPlaceholder}
      </div>
    </div>
    {children}
  </div>
);

BaseColonyCard.displayName = displayName;

export default BaseColonyCard;
