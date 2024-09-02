import { CaretRight, CaretLeft } from '@phosphor-icons/react';
import React, { type FC, type PropsWithChildren } from 'react';

import { useEmblaCarouselSettings } from './hooks.ts';
import { CarouselButton } from './partials/CarouselButton.tsx';

export const WidgetCardsList: FC<PropsWithChildren> = ({ children }) => {
  const {
    emblaRef,
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = useEmblaCarouselSettings({ loop: false, align: 'start' });

  return (
    <div className="relative flex pb-[1.75rem]">
      <CarouselButton
        onClick={onPrevButtonClick}
        disabled={prevBtnDisabled}
        ariaLabel="Scroll left"
      >
        <CaretLeft />
      </CarouselButton>

      <div className="grow cursor-grab overflow-hidden">
        <div ref={emblaRef}>
          <div className="flex">{children}</div>
        </div>
      </div>

      <CarouselButton
        onClick={onNextButtonClick}
        disabled={nextBtnDisabled}
        ariaLabel="Scroll right"
      >
        <CaretRight />
      </CarouselButton>
    </div>
  );
};
