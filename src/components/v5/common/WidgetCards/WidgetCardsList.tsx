import { CaretRight, CaretLeft } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC, type PropsWithChildren } from 'react';

import { useEmblaCarouselSettings } from './hooks.ts';
import { CarouselButton } from './partials/CarouselButton.tsx';

interface WidgetCardsListProps {
  className?: string;
}

export const WidgetCardsList: FC<PropsWithChildren<WidgetCardsListProps>> = ({
  children,
  className,
}) => {
  const {
    emblaRef,
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = useEmblaCarouselSettings({ loop: false, align: 'start' });

  return (
    <div className={clsx(className, 'relative flex')}>
      <CarouselButton onClick={onPrevButtonClick} disabled={prevBtnDisabled}>
        <CaretLeft />
      </CarouselButton>

      <div className="mx-4 grow cursor-grab overflow-hidden">
        <div ref={emblaRef}>
          <div className="flex">{children}</div>
        </div>
      </div>

      <CarouselButton onClick={onNextButtonClick} disabled={nextBtnDisabled}>
        <CaretRight />
      </CarouselButton>
    </div>
  );
};
