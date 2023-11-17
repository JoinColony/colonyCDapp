import React, { FC } from 'react';
import clsx from 'clsx';

import CalamityBannerContent from './partials/CalamityBannerContent';
import { useCalamityBanner } from './hooks';
import { CalamityBannerProps } from './types';

const displayName = 'v5.CalamityBanner';

const CalamityBanner: FC<CalamityBannerProps> = ({ items }) => {
  const { showBanner, setShowBanner, activeElement, handleBannerChange } =
    useCalamityBanner(items);

  if (!showBanner && !items.length) {
    return null;
  }

  return (
    <div className="overflow-hidden relative">
      {items.map(({ key, ...item }, index) => (
        <CalamityBannerContent
          {...item}
          key={key}
          onCloseClick={() => setShowBanner(false)}
          className={clsx({
            'block sm:opacity-100 sm:visible': activeElement === index,
            'hidden sm:block sm:opacity-0 sm:invisible':
              activeElement !== index,
          })}
          onCaretClick={items.length > 1 ? handleBannerChange : undefined}
        />
      ))}
    </div>
  );
};

CalamityBanner.displayName = displayName;

export default CalamityBanner;
