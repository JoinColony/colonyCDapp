import { CaretRight, CaretLeft } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC, type PropsWithChildren } from 'react';

import { useLargeTablet } from '~hooks/index.ts';

import { useEmblaCarouselSettings } from './hooks.ts';
import { CarouselButton } from './partials/CarouselButton.tsx';

interface WidgetCardsListProps {
  className?: string;
}
export const WidgetCardsList: FC<PropsWithChildren<WidgetCardsListProps>> = ({
  children,
  className,
}) => {
  const isLargeTablet = useLargeTablet();

  const {
    emblaRef,
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = useEmblaCarouselSettings({
    loop: false,
    slidesToScroll: !isLargeTablet ? 2 : 1,
  });

  return (
    <div className={clsx(className, 'relative flex')}>
      {!prevBtnDisabled && (
        <CarouselButton
          onClick={onPrevButtonClick}
          className="left-0 bg-gradient-to-r"
        >
          <CaretLeft />
        </CarouselButton>
      )}

      <div className="grow cursor-grab overflow-hidden">
        <div ref={emblaRef}>
          <div className="flex gap-4">{children}</div>
        </div>
      </div>

      {!nextBtnDisabled && (
        <CarouselButton
          onClick={onNextButtonClick}
          className="right-0 bg-gradient-to-l"
        >
          <CaretRight />
        </CarouselButton>
      )}
    </div>
  );
};
