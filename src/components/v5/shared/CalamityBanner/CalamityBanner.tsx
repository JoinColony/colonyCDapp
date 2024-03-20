import clsx from 'clsx';
import React, { type FC } from 'react';

import { useCalamityBanner } from './hooks.ts';
import CalamityBannerContent from './partials/CalamityBannerContent.tsx';
import { type CalamityBannerProps } from './types.ts';

const displayName = 'v5.CalamityBanner';

const CalamityBanner: FC<CalamityBannerProps> = ({ items }) => {
  const { showBanner, setShowBanner, activeElement, handleBannerChange } =
    useCalamityBanner(items);

  if (!showBanner || !items.length) {
    return null;
  }

  return (
    <div className="relative overflow-hidden">
      {items.map(({ key, ...item }, index) => (
        <CalamityBannerContent
          {...item}
          key={key}
          onCloseClick={() => setShowBanner(false)}
          className={clsx({
            block: activeElement === index,
            hidden: activeElement !== index,
          })}
          onCaretClick={items.length > 1 ? handleBannerChange : undefined}
        />
      ))}
    </div>
  );
};

CalamityBanner.displayName = displayName;

export default CalamityBanner;
