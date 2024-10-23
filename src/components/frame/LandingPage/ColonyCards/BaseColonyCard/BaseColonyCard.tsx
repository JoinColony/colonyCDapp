import clsx from 'clsx';
import React, { type PropsWithChildren } from 'react';

const displayName = 'frame.LandingPage.ColonyCards.BaseColonyCard';

export interface BaseColonyCardProps extends PropsWithChildren {
  avatarPlaceholder: React.ReactNode;
  isClickable?: boolean;
}
const BaseColonyCard = ({
  isClickable,
  avatarPlaceholder,
  children,
}: BaseColonyCardProps) => (
  <div
    className={clsx(
      'flex h-[4.5rem] items-center gap-[.875rem] rounded border px-5 py-4 transition-colors duration-normal',
      {
        'hover:border-gray-900': isClickable,
      },
    )}
  >
    <div className="flex h-8 w-8 items-center justify-center">
      {avatarPlaceholder}
    </div>
    <div className="flex w-full items-center justify-between">{children}</div>
  </div>
);

BaseColonyCard.displayName = displayName;

export default BaseColonyCard;
